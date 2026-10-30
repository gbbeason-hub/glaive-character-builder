import React, { useState } from 'react';

export interface BackgroundItem {
  min?: number;
  max?: number;
  name: string;
  category?: 'underworld' | 'rural' | 'noble' | 'military' | 'vagabond';
  text: string;
  grantedSilver?: number;
  grantedFreeGear?: string;
  grantedTalentIds?: string[];
  grantedCompanions?: Array<{ type: string }>;
  grantedItems?: Array<{ id: string; quantity: number }>;
  notes?: string;
  isCustom?: boolean;
}

export interface TalentCatalogItem {
  id: string;
  name: string;
  description?: string;
}

export interface ItemCatalogEntry {
  id: string;
  name: string;
  type?: string;
}

interface BackgroundSelectorModalProps {
  isOpen: boolean;
  activeBackgroundText: string;
  backgroundsCatalog: BackgroundItem[];
  talentsCatalog?: TalentCatalogItem[];
  itemsCatalog?: ItemCatalogEntry[];
  onSelectBackground: (background: BackgroundItem) => void;
  onClose: () => void;
}

type CategoryTab = 'all' | 'underworld' | 'rural' | 'noble' | 'military' | 'vagabond' | 'custom';
type BenefitType = 'none' | 'silver' | 'gear' | 'talent' | 'companion';

const CATEGORY_LABELS: Record<CategoryTab, string> = {
  all: 'All',
  underworld: 'Underworld',
  rural: 'Rural',
  noble: 'Noble',
  military: 'Military',
  vagabond: 'Vagabond',
  custom: '+ Custom'
};

const BENEFIT_HELP_TEXT: Record<BenefitType, string> = {
  none: 'Give a game benefit (ADV or DISADV on certain rolls), a connection, a purpose, or other flavor.',
  silver: 'Add silver pieces to your starting total.',
  gear: 'Add a trinket to your Free Gear or a specific item.',
  talent: 'Select a heroic talent.',
  companion: 'Gain a pet, familiar, companion, or annoying donkey.'
};


export const BackgroundSelectorModal: React.FC<BackgroundSelectorModalProps> = ({
  isOpen,
  activeBackgroundText,
  backgroundsCatalog,
  talentsCatalog = [],
  itemsCatalog = [],
  onSelectBackground,
  onClose
}) => {
  const [activeCategory, setActiveCategory] = useState<CategoryTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showValidation, setShowValidation] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [text, setText] = useState('');
  const [benefitType, setBenefitType] = useState<BenefitType>('none');
  const [grantedSilver, setGrantedSilver] = useState<number>(5);
  const [grantedFreeGear, setGrantedFreeGear] = useState<string>('');
  const [selectedItemId, setSelectedItemId] = useState<string>('');
  const [selectedTalentId, setSelectedTalentId] = useState<string>('');
  const [companionType, setCompanionType] = useState<string>('');
  const [narrativeBenefit, setNarrativeBenefit] = useState<string>('');


  if (!isOpen) return null;

  const filteredBackgrounds = backgroundsCatalog.filter(bg => {
    const matchesCategory = activeCategory === 'all' || bg.category === activeCategory;
    const matchesSearch =
      bg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bg.text.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleApplyCustom = () => {
    if (!name.trim()) {
      setShowValidation(true);
      return;
    }

    const customBg: BackgroundItem = {
      name: name.trim(),
      text: text.trim() || 'Custom background story.',
      isCustom: true
    };

    if (benefitType === 'none' && narrativeBenefit.trim()) {
      customBg.notes = narrativeBenefit.trim();
      customBg.text = customBg.text ? `${customBg.text} Benefit: ${narrativeBenefit.trim()}` : `Benefit: ${narrativeBenefit.trim()}`;
    } else if(benefitType === 'silver' && grantedSilver > 0) {
      customBg.grantedSilver = grantedSilver;
    } else if (benefitType === 'gear') {
      if (grantedFreeGear.trim()) {
        customBg.grantedFreeGear = grantedFreeGear.trim();
      }
      if (selectedItemId) {
        customBg.grantedItems = [{ id: selectedItemId, quantity: 1 }];
      }
    } else if (benefitType === 'talent' && selectedTalentId) {
      customBg.grantedTalentIds = [selectedTalentId];
    } else if (benefitType === 'companion' && companionType.trim()) {
      customBg.grantedCompanions = [{ type: companionType.trim() }];
    }

    onSelectBackground(customBg);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card background-modal" onClick={e => e.stopPropagation()}>
        <header className="modal-header">
          <div className="modal-title-row">
            <h3>Select Background</h3>
            <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">✕</button>
          </div>
          <p className="shopkeeper-flavor-text">Choose a narrative origin story or define your own</p>
        </header>

        <div className="category-pills-row">
          {(Object.keys(CATEGORY_LABELS) as CategoryTab[]).map(cat => (
            <button
              key={cat}
              className={`pill-btn ${activeCategory === cat ? 'active' : ''} ${cat === 'custom' ? 'custom-pill' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>

        {activeCategory !== 'custom' && (
          <div className="search-bar-container">
            <input
              type="text"
              className="modal-search-input"
              placeholder="Search backgrounds by name or text..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        )}

        <div className="modal-body-content">
          {activeCategory === 'custom' ? (
            <div className="custom-background-form">
              <div className="form-group">
                <label className="field-label" htmlFor="custom-bg-name">
                  Background Name <span className="required-star">*</span>
                </label>
                <input
                  id="custom-bg-name"
                  type="text"
                  className={showValidation && !name.trim() ? 'input-error' : ''}
                  placeholder="examples: Clockwork Clockmaker, Disgraced Alchemist..."
                  value={name}
                  onChange={e => {
                    setShowValidation(false);
                    setName(e.target.value);
                  }}
                  autoFocus
                />
                {showValidation && !name.trim() && (
                  <span className="error-message">Background name is required</span>
                )}
              </div>

              <div className="form-group">
                <label className="field-label" htmlFor="custom-bg-text">Origin & Flavor Text</label>
                <textarea
                  id="custom-bg-text"
                  className="form-textarea"
                  rows={3}
                  placeholder="Describe your origin story, key events, or personal motivation..."
                  value={text}
                  onChange={e => setText(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="field-label" htmlFor="benefit-type-select">Primary Benefit</label>
                <select
                  id="benefit-type-select"
                  value={benefitType}
                  onChange={e => setBenefitType(e.target.value as BenefitType)}
                >
                  <option value="none">Narrative</option>
                  <option value="silver">Bonus Silver</option>
                  <option value="gear">Free Gear / Item</option>
                  <option value="talent">Talent</option>
                  <option value="companion">Companion</option>
                </select>
                <p className="benefit-help-text">{BENEFIT_HELP_TEXT[benefitType]}</p>
              </div>

              {benefitType === 'none' && (
                <div className="form-group sub-input-group">
                  <label className="field-label" htmlFor="custom-narrative-input">Narrative Benefit / Details</label>
                  <input
                    id="custom-narrative-input"
                    type="text"
                    placeholder="examples: ADV on WIS saves vs fungi, local crime contact..."
                    value={narrativeBenefit}
                    onChange={e => setNarrativeBenefit(e.target.value)}
                  />
                </div>
              )}

              {benefitType === 'silver' && (
                <div className="form-group sub-input-group">
                  <label className="field-label" htmlFor="custom-silver-input">Bonus Silver Pieces (SP)</label>
                  <input
                    id="custom-silver-input"
                    type="number"
                    min={1}
                    value={grantedSilver}
                    onChange={e => setGrantedSilver(parseInt(e.target.value, 10) || 0)}
                  />
                </div>
              )}

              {benefitType === 'gear' && (
                <div className="form-group sub-input-group">
                  <label className="field-label" htmlFor="custom-gear-input">Free Gear / Trinket Text</label>
                  <input
                    id="custom-gear-input"
                    type="text"
                    className="mb-2"
                    placeholder="examples: Pocket Chronometer, Sealed Scroll..."
                    value={grantedFreeGear}
                    onChange={e => setGrantedFreeGear(e.target.value)}
                  />

                  <label className="field-label" htmlFor="custom-item-select">Or Select Specific Catalog Item</label>
                  <select
                    id="custom-item-select"
                    value={selectedItemId}
                    onChange={e => setSelectedItemId(e.target.value)}
                  >
                    <option value="">-- Optional: Choose Item --</option>
                    {itemsCatalog.map(item => (
                      <option key={item.id} value={item.id}>
                        {item.name} ({item.type || 'Equipment'})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {benefitType === 'talent' && (
                <div className="form-group sub-input-group">
                  <label className="field-label" htmlFor="custom-talent-select">Select Heroic Talent</label>
                  <select
                    id="custom-talent-select"
                    value={selectedTalentId}
                    onChange={e => setSelectedTalentId(e.target.value)}
                  >
                    <option value="">-- Choose a Talent --</option>
                    {talentsCatalog.map(talent => (
                      <option key={talent.id} value={talent.id}>
                        {talent.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {benefitType === 'companion' && (
                <div className="form-group sub-input-group">
                  <label className="field-label" htmlFor="custom-companion-input">Companion Type or Description</label>
                  <input
                    id="custom-companion-input"
                    type="text"
                    placeholder="examples: Stubborn Mule, Scout Crow, Talking Pig..."
                    value={companionType}
                    onChange={e => setCompanionType(e.target.value)}
                  />
                </div>
              )}

              <div className="custom-form-actions">
                <button type="button" className="btn-secondary" onClick={() => setActiveCategory('all')}>
                  Cancel
                </button>
                <button type="button" className="btn-primary" onClick={handleApplyCustom}>
                  Use Custom Background
                </button>
              </div>
            </div>
          ) : (
            <div className="background-cards-list">
              {filteredBackgrounds.map((bg, idx) => (
                <div
                  key={idx}
                  className={`background-card ${activeBackgroundText === bg.text ? 'selected' : ''}`}
                  onClick={() => {
                    onSelectBackground(bg);
                    onClose();
                  }}
                >
                  <div className="card-header-row">
                    {bg.min && bg.max && <span className="d100-badge">[{bg.min}–{bg.max}]</span>}
                    <h3 className="card-title">{bg.name}</h3>
                  </div>
                  <p className="card-text">{bg.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};