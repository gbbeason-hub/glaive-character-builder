import React, { useState } from 'react';
import type { Talent } from './TalentsCard';
import type { ItemCatalogEntry } from './BackgroundSelectorModal';

export interface CustomTalent extends Talent {
  isCustom?: boolean;
  effects?: Array<{ type: string; target: string; mode: string; value: number }>;
  containerGrant?: { type: string; count: number; itemSlots: number };
  hiddenItemGrant?: { name: string; type: string; damage?: string; range?: string; slots: number; cost_sp: number; cost_cp: number; details: string };
  catalogItemGrant?: { id: string; quantity: number };
}

interface CustomTalentFormProps {
  initialTalent?: CustomTalent | null;
  itemsCatalog?: ItemCatalogEntry[];
  hideSetSelection?: boolean; // Hides Archetype/Set inputs for Ancestry context
  forcedAncestryName?: string; // Automatically locks set name to character ancestry if provided
  submitButtonText?: string;  // Custom primary action button label
  onCancel: () => void;
  onSubmitCustomTalent: (customTalent: CustomTalent) => void;
}

type MechanicalEffectType = 'none' | 'hp' | 'slots' | 'ac' | 'container' | 'item';

const HEROIC_SETS = ['Barbarian', 'Holy Warrior', 'Hunter', 'Magic User', 'Raconteur', 'Thief', 'Warrior'];

export const CustomTalentForm: React.FC<CustomTalentFormProps> = ({
  initialTalent,
  itemsCatalog = [],
  hideSetSelection = false,
  forcedAncestryName = '',
  submitButtonText,
  onCancel,
  onSubmitCustomTalent,
}) => {
  const [customName, setCustomName] = useState(initialTalent?.name || '');
  
  // Talent category mode: 'heroic' vs 'ancestry'
  const [talentCategory, setTalentCategory] = useState<'heroic' | 'ancestry'>(
    initialTalent?.type === 'ancestry' || forcedAncestryName ? 'ancestry' : 'heroic'
  );

  const [customSet, setCustomSet] = useState(
    initialTalent && HEROIC_SETS.includes(initialTalent.set) ? initialTalent.set : 'Warrior'
  );
  const [isNewSet, setIsNewSet] = useState(
    initialTalent ? !HEROIC_SETS.includes(initialTalent.set) && !forcedAncestryName : false
  );
  const [customNewSetName, setCustomNewSetName] = useState(
    initialTalent && !HEROIC_SETS.includes(initialTalent.set) ? initialTalent.set : ''
  );
  const [customDescription, setCustomDescription] = useState(initialTalent?.description || '');
  
  const [mechanicalEffect, setMechanicalEffect] = useState<MechanicalEffectType>(() => {
    if (!initialTalent) return 'none';
    if (initialTalent.effects?.some((e) => e.target === 'hp_per_level_bonus')) return 'hp';
    if (initialTalent.effects?.some((e) => e.target === 'extra_item_slots')) return 'slots';
    if (initialTalent.effects?.some((e) => e.target === 'ac_bonus')) return 'ac';
    if (initialTalent.containerGrant) return 'container';
    if (initialTalent.hiddenItemGrant || initialTalent.catalogItemGrant) return 'item';
    return 'none';
  });

  const [hpBonusValue, setHpBonusValue] = useState<number>(() => {
    const eff = initialTalent?.effects?.find((e) => e.target === 'hp_per_level_bonus');
    return eff ? (eff.value as number) : 2;
  });
  const [itemSlotValue, setItemSlotValue] = useState<number>(() => {
    const eff = initialTalent?.effects?.find((e) => e.target === 'extra_item_slots');
    return eff ? (eff.value as number) : 3;
  });
  const [acBonusValue, setAcBonusValue] = useState<number>(() => {
    const eff = initialTalent?.effects?.find((e) => e.target === 'ac_bonus');
    return eff ? (eff.value as number) : 1;
  });

  const [containerType, setContainerType] = useState<string>(
    initialTalent?.containerGrant?.type || 'Spellbook'
  );
  const [hiddenItemName, setHiddenItemName] = useState<string>(
    initialTalent?.hiddenItemGrant?.name || ''
  );
  const [selectedCatalogItemId, setSelectedCatalogItemId] = useState<string>(
    initialTalent?.catalogItemGrant?.id || ''
  );

  const [showValidation, setShowValidation] = useState(false);

  const handleSubmit = () => {
    if (!customName.trim()) {
      setShowValidation(true);
      return;
    }

    const resolvedSet = hideSetSelection
      ? initialTalent?.set || 'Custom'
      : talentCategory === 'ancestry'
      ? forcedAncestryName || 'Ancestry'
      : isNewSet && customNewSetName.trim()
      ? customNewSetName.trim()
      : customSet;

    const customId = initialTalent?.id || `custom_talent_${Date.now()}`;

    // Construct a base object with zero grant properties by default
    const newTalent: CustomTalent = {
      id: customId,
      name: customName.trim(),
      type: talentCategory === 'ancestry' ? 'ancestry' : 'talent',
      set: resolvedSet,
      description: customDescription.trim() || 'Custom talent.',
      isCustom: true,
    };

    // Apply ONLY the active mechanical effect, explicitly clearing out unselected grant types
    if (mechanicalEffect === 'hp') {
      newTalent.effects = [{ type: 'stat_modifier', target: 'hp_per_level_bonus', mode: 'add', value: hpBonusValue }];
      delete newTalent.containerGrant;
      delete newTalent.hiddenItemGrant;
      delete newTalent.catalogItemGrant;
    } else if (mechanicalEffect === 'slots') {
      newTalent.effects = [{ type: 'stat_modifier', target: 'extra_item_slots', mode: 'add', value: itemSlotValue }];
      delete newTalent.containerGrant;
      delete newTalent.hiddenItemGrant;
      delete newTalent.catalogItemGrant;
    } else if (mechanicalEffect === 'ac') {
      newTalent.effects = [{ type: 'stat_modifier', target: 'ac_bonus', mode: 'add', value: acBonusValue }];
      delete newTalent.containerGrant;
      delete newTalent.hiddenItemGrant;
      delete newTalent.catalogItemGrant;
    } else if (mechanicalEffect === 'container') {
      newTalent.containerGrant = { type: containerType, count: 1, itemSlots: 1 };
      delete newTalent.effects;
      delete newTalent.hiddenItemGrant;
      delete newTalent.catalogItemGrant;
    } else if (mechanicalEffect === 'item') {
      delete newTalent.effects;
      delete newTalent.containerGrant;

      if (selectedCatalogItemId) {
        newTalent.catalogItemGrant = { id: selectedCatalogItemId, quantity: 1 };
        delete newTalent.hiddenItemGrant;
      } else if (hiddenItemName.trim()) {
        newTalent.hiddenItemGrant = {
          name: hiddenItemName.trim(),
          type: 'Equipment',
          slots: 0,
          cost_sp: 0,
          cost_cp: 0,
          details: 'Custom talent-granted item.',
        };
        delete newTalent.catalogItemGrant;
      } else {
        delete newTalent.hiddenItemGrant;
        delete newTalent.catalogItemGrant;
      }
    } else {
      // If 'none' or any other state is chosen, strip all mechanical effect and item grants completely
      delete newTalent.effects;
      delete newTalent.containerGrant;
      delete newTalent.hiddenItemGrant;
      delete newTalent.catalogItemGrant;
    }

    onSubmitCustomTalent(newTalent);
  };

  return (
    <div className="custom-background-form custom-talent-form-container">
      <div className="form-group">
        <label className="field-label" htmlFor="custom-talent-name">
          Talent Name <span className="required-star">*</span>
        </label>
        <input
          id="custom-talent-name"
          type="text"
          className={showValidation && !customName.trim() ? 'input-error' : ''}
          placeholder="examples: Shadow Step, Iron Resolve, Stone Skin..."
          value={customName}
          onChange={(e) => {
            setShowValidation(false);
            setCustomName(e.target.value);
          }}
          autoFocus
        />
        {showValidation && !customName.trim() && (
          <span className="error-message">Talent name is required</span>
        )}
      </div>

      {/* Category Toggle: Heroic vs Ancestry Talent */}
      {!hideSetSelection && forcedAncestryName && (
        <div className="form-group">
          <label className="field-label">Talent Category</label>
          <div style={{ display: 'flex', gap: '16px' }}>
            <label className="radio-option-label">
              <input
                type="radio"
                name="talentCategory"
                checked={talentCategory === 'heroic'}
                onChange={() => setTalentCategory('heroic')}
              />
              <span>Heroic Talent</span>
            </label>
            <label className="radio-option-label">
              <input
                type="radio"
                name="talentCategory"
                checked={talentCategory === 'ancestry'}
                onChange={() => setTalentCategory('ancestry')}
              />
              <span>Ancestry Talent ({forcedAncestryName})</span>
            </label>
          </div>
        </div>
      )}

      {/* Set / Archetype Selection */}
      {!hideSetSelection && talentCategory === 'heroic' && (
        <div className="form-row-two-col">
          <div className="form-group flex-1">
            <label className="field-label" htmlFor="custom-talent-set">
              Talent Set / Archetype
            </label>
            <select
              id="custom-talent-set"
              value={isNewSet ? 'NEW' : customSet}
              onChange={(e) => {
                if (e.target.value === 'NEW') {
                  setIsNewSet(true);
                } else {
                  setIsNewSet(false);
                  setCustomSet(e.target.value);
                }
              }}
            >
              {HEROIC_SETS.map((set) => (
                <option key={set} value={set}>
                  {set}
                </option>
              ))}
              <option value="NEW">[+ New Type]</option>
            </select>
          </div>

          {isNewSet && (
            <div className="form-group flex-1">
              <label className="field-label" htmlFor="custom-new-set-input">
                New Set Name
              </label>
              <input
                id="custom-new-set-input"
                type="text"
                placeholder="examples: Swashbuckler, Alchemist"
                value={customNewSetName}
                onChange={(e) => setCustomNewSetName(e.target.value)}
              />
            </div>
          )}
        </div>
      )}

      {talentCategory === 'ancestry' && forcedAncestryName && !hideSetSelection && (
        <div className="form-group">
          <label className="field-label">Assigned Ancestry Set</label>
          <input type="text" disabled value={forcedAncestryName} style={{ backgroundColor: '#f1f5f9', color: '#64748b' }} />
        </div>
      )}

      <div className="form-group">
        <label className="field-label" htmlFor="custom-talent-desc">
          Description & Rules Text
        </label>
        <textarea
          id="custom-talent-desc"
          className="form-textarea"
          rows={3}
          placeholder="Describe your talent mechanics..."
          value={customDescription}
          onChange={(e) => setCustomDescription(e.target.value)}
        />
        <p className="benefit-help-text">
          Examples: Advantage on saves for specific hazards, free tactical reactions when enemies move or cast spell, free action, unique combat maneuvers, or social/sensory aptitudes.
        </p>
      </div>

      <div className="form-group mechanical-effect-group">
        <label className="field-label">Primary Mechanical Effect (Optional)</label>
        <div className="sub-input-group mechanical-options-box">
          <label className="radio-option-label">
            <input
              type="radio"
              name="mechanicalEffect"
              checked={mechanicalEffect === 'none'}
              onChange={() => setMechanicalEffect('none')}
            />
            <strong>None (Pure Narrative / Action / Advantage)</strong>
          </label>

          <label className="radio-option-label">
            <input
              type="radio"
              name="mechanicalEffect"
              checked={mechanicalEffect === 'hp'}
              onChange={() => setMechanicalEffect('hp')}
            />
            <strong>Hit Points per Level</strong>
          </label>
          {mechanicalEffect === 'hp' && (
            <div className="sub-radio-indent">
              <label className="radio-sub-label">
                <input type="radio" name="hpValue" checked={hpBonusValue === 1} onChange={() => setHpBonusValue(1)} /> +1 HP / Level
              </label>
              <label className="radio-sub-label">
                <input type="radio" name="hpValue" checked={hpBonusValue === 2} onChange={() => setHpBonusValue(2)} /> +2 HP / Level
              </label>
            </div>
          )}

          <label className="radio-option-label">
            <input
              type="radio"
              name="mechanicalEffect"
              checked={mechanicalEffect === 'slots'}
              onChange={() => setMechanicalEffect('slots')}
            />
            <strong>Extra Item Slots</strong>
          </label>
          {mechanicalEffect === 'slots' && (
            <div className="sub-radio-indent slots-select-row">
              <span className="slots-label-text">Slots:</span>
              <select className="slots-dropdown-select" value={itemSlotValue} onChange={(e) => setItemSlotValue(Number(e.target.value))}>
                <option value={1}>+1</option>
                <option value={2}>+2</option>
                <option value={3}>+3</option>
              </select>
            </div>
          )}

          <label className="radio-option-label">
            <input
              type="radio"
              name="mechanicalEffect"
              checked={mechanicalEffect === 'ac'}
              onChange={() => setMechanicalEffect('ac')}
            />
            <strong>Armor Class (AC) Bonus</strong>
          </label>
          {mechanicalEffect === 'ac' && (
            <div className="sub-radio-indent">
              <label className="radio-sub-label">
                <input type="radio" name="acValue" checked={acBonusValue === 1} onChange={() => setAcBonusValue(1)} /> +1 AC
              </label>
              <label className="radio-sub-label">
                <input type="radio" name="acValue" checked={acBonusValue === 2} onChange={() => setAcBonusValue(2)} /> +2 AC
              </label>
            </div>
          )}

          <label className="radio-option-label">
            <input
              type="radio"
              name="mechanicalEffect"
              checked={mechanicalEffect === 'container'}
              onChange={() => setMechanicalEffect('container')}
            />
            <strong>Spell Container / Relic Slot</strong>
          </label>
          {mechanicalEffect === 'container' && (
            <div className="sub-radio-indent">
              <select
                className="container-select-dropdown"
                value={containerType}
                onChange={(e) => setContainerType(e.target.value)}
              >
                <option value="Spellbook">Spellbook</option>
                <option value="Holy Relic">Holy Relic</option>
                <option value="Familiar Spell">Familiar Slot</option>
              </select>
            </div>
          )}

          <label className="radio-option-label">
            <input
              type="radio"
              name="mechanicalEffect"
              checked={mechanicalEffect === 'item'}
              onChange={() => setMechanicalEffect('item')}
            />
            <strong>Free Gear / Item</strong>
          </label>
          {mechanicalEffect === 'item' && (
            <div className="sub-input-group" style={{ marginTop: '12px', paddingLeft: '0' }}>
              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label className="field-label" htmlFor="custom-talent-gear-input">Free Gear / Trinket Text</label>
                <input
                  id="custom-talent-gear-input"
                  type="text"
                  placeholder="examples: Hidden Dagger, Poison Ring"
                  value={hiddenItemName}
                  onChange={(e) => setHiddenItemName(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '0' }}>
                <label className="field-label" htmlFor="custom-talent-item-select">Or Select Specific Catalog Item</label>
                <select
                  id="custom-talent-item-select"
                  value={selectedCatalogItemId}
                  onChange={(e) => setSelectedCatalogItemId(e.target.value)}
                  style={{ width: '100%' }}
                >
                  <option value="">-- Optional: Choose Item --</option>
                  {itemsCatalog.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} ({item.type || 'Equipment'})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="custom-form-actions">
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="button" className="btn-primary" onClick={handleSubmit}>
          {submitButtonText || (initialTalent ? 'Save Changes' : 'Use Custom Talent')}
        </button>
      </div>
    </div>
  );
};