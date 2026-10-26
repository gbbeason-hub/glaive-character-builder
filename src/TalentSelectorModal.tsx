import React, { useState, useMemo } from 'react';
import type { Talent } from './TalentsCard';

interface TalentSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  talents: Talent[];
  selectedTalents: string[];
  currentIndex: number;
  onSelectTalent: (talentId: string) => void;
}

// List of known ancestry set tags to split Ancestry vs Heroic
const ANCESTRY_SET_NAMES = new Set([
  'Construct',
  'Demi-Ogre',
  'Drake',
  'Dwarf',
  'Elf',
  'Goblin',
  'Half-Foot',
  'Infernal',
  'Kobold',
  'Orc',
]);

type MainTab = 'All' | 'Ancestry' | 'Heroic';

export const TalentSelectorModal: React.FC<TalentSelectorModalProps> = ({
  isOpen,
  onClose,
  talents,
  selectedTalents,
  currentIndex,
  onSelectTalent,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<MainTab>('All');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('All');

  if (!isOpen) return null;

  // Dynamically compute sub-pills based on active tab
  const subCategories = useMemo(() => {
    const sets = new Set<string>();

    talents.forEach((t) => {
      if (!t.set) return;
      const isAncestry = ANCESTRY_SET_NAMES.has(t.set);

      if (activeTab === 'All') {
        sets.add(t.set);
      } else if (activeTab === 'Ancestry' && isAncestry) {
        sets.add(t.set);
      } else if (activeTab === 'Heroic' && !isAncestry) {
        sets.add(t.set);
      }
    });

    return ['All', ...Array.from(sets)];
  }, [talents, activeTab]);

  // Handle main tab switch and reset sub-category filter
  const handleTabChange = (tab: MainTab) => {
    setActiveTab(tab);
    setSelectedSubCategory('All');
  };

  // Filter available talents based on search, main tab, sub-category, and duplication rules
  const filteredTalents = talents.filter((t) => {
    const currentId = selectedTalents[currentIndex];
    const isAlreadySelectedElsewhere =
      !t.repeatable &&
      selectedTalents.some((id, idx) => idx !== currentIndex && id === t.id);
    if (isAlreadySelectedElsewhere && t.id !== currentId) return false;

    const isAncestry = ANCESTRY_SET_NAMES.has(t.set);

    // Main Tab Filter
    if (activeTab === 'Ancestry' && !isAncestry) return false;
    if (activeTab === 'Heroic' && isAncestry) return false;

    // Sub-Category Filter
    if (selectedSubCategory !== 'All' && t.set !== selectedSubCategory) return false;

    // Search Input Filter
    const matchesSearch =
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.set.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card talent-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Sticky Header */}
        <div className="modal-header">
          <div className="modal-title-row">
            <h3>SELECT TALENT (Slot {currentIndex + 1})</h3>
            <button type="button" className="modal-close-btn" onClick={onClose}>
              ✕
            </button>
          </div>
          <div className="modal-stats-bar">
            <span>Choose from heroic talents, veteran tricks, or uncanny aptitudes</span>
          </div>
        </div>

        {/* 3-Option Segmented Control Selector */}
        <div className="talent-segmented-control">
          {(['All', 'Ancestry', 'Heroic'] as MainTab[]).map((tab) => (
            <button
              key={tab}
              type="button"
              className={`segmented-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => handleTabChange(tab)}
            >
              {tab === 'All' ? 'All Talents' : tab}
            </button>
          ))}
        </div>

        {/* Search Bar & Sub-Category Pills */}
        <div className="talent-filter-container">
          <input
            type="text"
            placeholder="Search talents by name or effect..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="talent-search-input"
            autoFocus
          />

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
        </div>

        {/* Scrollable Talent Cards List */}
        <div className="modal-item-list talent-grid-list">
          {filteredTalents.length === 0 ? (
            <p className="empty-inventory-text" style={{ textAlign: 'center', padding: '30px' }}>
              No matching talents found.
            </p>
          ) : (
            filteredTalents.map((t) => {
              const isSelected = selectedTalents[currentIndex] === t.id;

              return (
                <div
                  key={t.id}
                  className={`shop-item-card talent-selection-card ${
                    isSelected ? 'selected-card' : ''
                  }`}
                  onClick={() => {
                    onSelectTalent(t.id);
                    onClose();
                  }}
                >
                  <div className="shop-item-top-row">
                    <div className="item-title-group">
                      <span className="talent-card-tag">[{t.set}]</span>
                      <strong className="item-name">{t.name}</strong>
                      {t.repeatable && <span className="item-card-type-badge">Repeatable</span>}
                    </div>
                  </div>
                  <div className="item-details-column" style={{ marginTop: '6px' }}>
                    <span className="talent-card-description-preview">{t.description}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};