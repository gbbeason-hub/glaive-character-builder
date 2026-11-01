import React, { useState, useMemo, useEffect } from 'react';
import type { Talent } from './TalentsCard';
import { CustomTalentForm } from './CustomTalentForm';
import type { CustomTalent } from './CustomTalentForm';
import type { ItemCatalogEntry } from './BackgroundSelectorModal';

interface TalentSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  talents: Talent[];
  selectedTalents: string[];
  currentIndex: number;
  characterAncestryName?: string;
  itemsCatalog?: ItemCatalogEntry[];
  onSelectTalent: (talentId: string) => void;
  onAddCustomTalent?: (customTalent: CustomTalent) => void;
}

const ANCESTRY_SET_NAMES = new Set([
  'Construct', 'Demi-Ogre', 'Drake', 'Dwarf', 'Elf',
  'Goblin', 'Half-Foot', 'Infernal', 'Kobold', 'Orc',
]);

type MainTab = 'All' | 'Ancestry' | 'Heroic' | 'Custom';

export const TalentSelectorModal: React.FC<TalentSelectorModalProps> = ({
  isOpen,
  onClose,
  talents,
  selectedTalents,
  currentIndex,
  characterAncestryName = '',
  itemsCatalog = [],
  onSelectTalent,
  onAddCustomTalent,
}) => {
  const currentSlotId = selectedTalents[currentIndex] || '';
  const currentSelectedTalent = talents.find((t) => t.id === currentSlotId) as CustomTalent | undefined;

  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<MainTab>('All');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('All');
  const [restrictToMatchingAncestry, setRestrictToMatchingAncestry] = useState<boolean>(true);
  const [editingCustomTalent, setEditingCustomTalent] = useState<CustomTalent | null>(null);

  // Auto-detect if current slot holds a custom talent when modal opens
  useEffect(() => {
    if (isOpen) {
      if (currentSelectedTalent && currentSelectedTalent.isCustom) {
        setActiveTab('Custom');
        setEditingCustomTalent(currentSelectedTalent);
      } else {
        setActiveTab('All');
        setEditingCustomTalent(null);
      }
      setSearchTerm('');
      setSelectedSubCategory('All');
    }
  }, [isOpen, currentSlotId]);

  if (!isOpen) return null;

  const subCategories = useMemo(() => {
    const sets = new Set<string>();
    talents.forEach((t) => {
      if (!t.set) return;
      const isAncestry = ANCESTRY_SET_NAMES.has(t.set);
      if (activeTab === 'All') sets.add(t.set);
      else if (activeTab === 'Ancestry' && isAncestry) sets.add(t.set);
      else if (activeTab === 'Heroic' && !isAncestry) sets.add(t.set);
    });
    return ['All', ...Array.from(sets)];
  }, [talents, activeTab]);

  const handleTabChange = (tab: MainTab) => {
    setActiveTab(tab);
    setSelectedSubCategory('All');
    if (tab === 'Custom' && !currentSelectedTalent?.isCustom) {
      setEditingCustomTalent(null);
    }
  };

  const handleCustomSubmit = (newTalent: CustomTalent) => {
    if (onAddCustomTalent) {
      onAddCustomTalent(newTalent);
    }
    onSelectTalent(newTalent.id);
    onClose();
  };

  const filteredTalents = talents.filter((t) => {
    if (activeTab === 'Custom') return true;

    const isAlreadySelectedElsewhere =
      !t.repeatable &&
      selectedTalents.some((id, idx) => idx !== currentIndex && id === t.id);
    if (isAlreadySelectedElsewhere && t.id !== currentSlotId) return false;

    const isAncestry = ANCESTRY_SET_NAMES.has(t.set);
    if (activeTab === 'Ancestry' && !isAncestry) return false;
    if (activeTab === 'Heroic' && isAncestry) return false;

    if (activeTab === 'Ancestry' && restrictToMatchingAncestry) {
      if (!characterAncestryName) return false;
      if (t.set.toLowerCase() !== characterAncestryName.toLowerCase()) return false;
    }

    if (
      (!restrictToMatchingAncestry || activeTab !== 'Ancestry') &&
      selectedSubCategory !== 'All' &&
      t.set !== selectedSubCategory
    ) {
      return false;
    }

    return (
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.set.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card talent-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-row">
            <h3>SELECT TALENT (Slot {currentIndex + 1})</h3>
            <button type="button" className="modal-close-btn" onClick={onClose}>
              ✕
            </button>
          </div>
          <div className="modal-stats-bar">
            <span>Choose from catalog heroic talents or define a custom heroic ability</span>
          </div>
        </div>

        <div className="talent-segmented-control">
          {(['All', 'Ancestry', 'Heroic', 'Custom'] as MainTab[]).map((tab) => (
            <button
              key={tab}
              type="button"
              className={`segmented-btn ${activeTab === tab ? 'active' : ''} ${tab === 'Custom' ? 'custom-segmented-btn' : ''}`}
              onClick={() => handleTabChange(tab)}
            >
              {tab === 'All' ? 'All Talents' : tab === 'Custom' ? '+ Custom' : tab}
            </button>
          ))}
        </div>

        {activeTab !== 'Custom' && (
          <div className="talent-filter-container">
            <input
              type="text"
              placeholder="Search talents by name or effect..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="talent-search-input"
              autoFocus
            />

            {activeTab === 'Ancestry' && (
              <div className="ancestry-toggle-row">
                <label className="ancestry-toggle-label">
                  <input
                    type="checkbox"
                    checked={restrictToMatchingAncestry}
                    onChange={(e) => setRestrictToMatchingAncestry(e.target.checked)}
                  />
                  Restricts talents to selected ancestry
                </label>
              </div>
            )}

            {(!restrictToMatchingAncestry || activeTab !== 'Ancestry') && (
              <div className="talent-pill-scroll-row">
                {subCategories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className={`talent-filter-pill ${selectedSubCategory === cat ? 'active' : ''}`}
                    onClick={() => setSelectedSubCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="modal-item-list talent-grid-list">
          <div style={{ display: activeTab === 'Custom' ? 'block' : 'none' }}>
            <CustomTalentForm
              key={editingCustomTalent ? editingCustomTalent.id : 'new'}
              initialTalent={editingCustomTalent}
              itemsCatalog={itemsCatalog}
              forcedAncestryName={characterAncestryName}
              onCancel={() => {
                setActiveTab('All');
                setEditingCustomTalent(null);
              }}
              onSubmitCustomTalent={handleCustomSubmit}
            />
          </div>

          {activeTab !== 'Custom' && (
            <>
              {filteredTalents.length === 0 ? (
                <p className="empty-inventory-text empty-talents-text">
                  {activeTab === 'Ancestry' && restrictToMatchingAncestry && !characterAncestryName
                    ? 'Please select an ancestry first on your character sheet.'
                    : 'No matching talents found.'}
                </p>
              ) : (
                filteredTalents.map((t) => {
                  const isSelected = selectedTalents[currentIndex] === t.id;
                  const isCustom = (t as CustomTalent).isCustom;

                  return (
                    <div
                      key={t.id}
                      className={`shop-item-card talent-selection-card ${isSelected ? 'selected-card' : ''}`}
                      onClick={() => {
                        if (isCustom) {
                          setEditingCustomTalent(t as CustomTalent);
                          setActiveTab('Custom');
                        } else {
                          onSelectTalent(t.id);
                          onClose();
                        }
                      }}
                    >
                      <div className="shop-item-top-row">
                        <div className="item-title-group">
                          <span className="talent-card-tag">[{t.set}]</span>
                          <strong className="item-name">{t.name}</strong>
                          {t.repeatable && <span className="item-card-type-badge">Repeatable</span>}
                          {isCustom && (
                            <span className="item-card-type-badge custom-badge-tag" title="Click to edit custom talent">
                              Custom ✏️
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="item-details-column talent-card-desc-wrap">
                        <span className="talent-card-description-preview">{t.description}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};