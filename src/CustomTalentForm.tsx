import React, { useState } from 'react';
import type { Talent } from './TalentsCard';

export interface CustomTalent extends Talent {
  isCustom?: boolean;
  effects?: Array<{ type: string; target: string; mode: string; value: number }>;
  containerGrant?: { type: string; count: number; itemSlots: number };
  hiddenItemGrant?: { name: string; type: string; damage?: string; range?: string; slots: number; cost_sp: number; details: string };
}

interface CustomTalentFormProps {
  initialTalent?: CustomTalent | null;
  onCancel: () => void;
  onSubmitCustomTalent: (customTalent: CustomTalent) => void;
}

type MechanicalEffectType = 'none' | 'hp' | 'slots' | 'ac' | 'container' | 'item';

const HEROIC_SETS = ['Barbarian', 'Holy Warrior', 'Hunter', 'Magic User', 'Raconteur', 'Thief', 'Warrior'];

export const CustomTalentForm: React.FC<CustomTalentFormProps> = ({
  initialTalent,
  onCancel,
  onSubmitCustomTalent,
}) => {
  const [customName, setCustomName] = useState(initialTalent?.name || '');
  const [customSet, setCustomSet] = useState(initialTalent && HEROIC_SETS.includes(initialTalent.set) ? initialTalent.set : 'Warrior');
  const [isNewSet, setIsNewSet] = useState(initialTalent ? !HEROIC_SETS.includes(initialTalent.set) : false);
  const [customNewSetName, setCustomNewSetName] = useState(initialTalent && !HEROIC_SETS.includes(initialTalent.set) ? initialTalent.set : '');
  const [customDescription, setCustomDescription] = useState(initialTalent?.description || '');
  const [mechanicalEffect, setMechanicalEffect] = useState<MechanicalEffectType>(() => {
    if (!initialTalent) return 'none';
    if (initialTalent.effects?.some(e => e.target === 'hp_per_level_bonus')) return 'hp';
    if (initialTalent.effects?.some(e => e.target === 'extra_item_slots')) return 'slots';
    if (initialTalent.effects?.some(e => e.target === 'ac_bonus')) return 'ac';
    if (initialTalent.containerGrant) return 'container';
    if (initialTalent.hiddenItemGrant) return 'item';
    return 'none';
  });

  const [hpBonusValue, setHpBonusValue] = useState<number>(() => {
    const eff = initialTalent?.effects?.find(e => e.target === 'hp_per_level_bonus');
    return eff ? eff.value : 2;
  });
  const [itemSlotValue, setItemSlotValue] = useState<number>(() => {
    const eff = initialTalent?.effects?.find(e => e.target === 'extra_item_slots');
    return eff ? eff.value : 3;
  });
  const [acBonusValue, setAcBonusValue] = useState<number>(() => {
    const eff = initialTalent?.effects?.find(e => e.target === 'ac_bonus');
    return eff ? eff.value : 1;
  });
  const [containerType, setContainerType] = useState<string>(initialTalent?.containerGrant?.type || 'Spellbook');
  const [hiddenItemName, setHiddenItemName] = useState<string>(initialTalent?.hiddenItemGrant?.name || '');

  const [showValidation, setShowValidation] = useState(false);

  const handleSubmit = () => {
    if (!customName.trim()) {
      setShowValidation(true);
      return;
    }

    const resolvedSet = isNewSet && customNewSetName.trim() ? customNewSetName.trim() : customSet;
    const customId = initialTalent?.id || `custom_talent_${Date.now()}`;

    const newTalent: CustomTalent = {
      id: customId,
      name: customName.trim(),
      type: 'talent',
      set: resolvedSet,
      description: customDescription.trim() || 'Custom heroic talent.',
      isCustom: true,
    };

    if (mechanicalEffect === 'hp') {
      newTalent.effects = [{ type: 'stat_modifier', target: 'hp_per_level_bonus', mode: 'add', value: hpBonusValue }];
    } else if (mechanicalEffect === 'slots') {
      newTalent.effects = [{ type: 'stat_modifier', target: 'extra_item_slots', mode: 'add', value: itemSlotValue }];
    } else if (mechanicalEffect === 'ac') {
      newTalent.effects = [{ type: 'stat_modifier', target: 'ac_bonus', mode: 'add', value: acBonusValue }];
    } else if (mechanicalEffect === 'container') {
      newTalent.containerGrant = { type: containerType, count: 1, itemSlots: 1 };
    } else if (mechanicalEffect === 'item' && hiddenItemName.trim()) {
      newTalent.hiddenItemGrant = {
        name: hiddenItemName.trim(),
        type: 'Equipment',
        slots: 0,
        cost_sp: 0,
        details: 'Custom talent-granted item.',
      };
    }

    onSubmitCustomTalent(newTalent);
  };

  return (
    <div className="custom-background-form custom-talent-form-container">
      <div className="form-group">
        <label className="field-label" htmlFor="custom-talent-name">
          Heroic Talent Name <span className="required-star">*</span>
        </label>
        <input
          id="custom-talent-name"
          type="text"
          className={showValidation && !customName.trim() ? 'input-error' : ''}
          placeholder="examples: Shadow Step, Iron Resolve, Arcane Surge..."
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

      <div className="form-row-two-col">
        <div className="form-group flex-1">
          <label className="field-label" htmlFor="custom-talent-set">Talent Set / Archetype</label>
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
              <option key={set} value={set}>{set}</option>
            ))}
            <option value="NEW">[+ New Type]</option>
          </select>
        </div>

        {isNewSet && (
          <div className="form-group flex-1">
            <label className="field-label" htmlFor="custom-new-set-input">New Set Name</label>
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

      <div className="form-group">
        <label className="field-label" htmlFor="custom-talent-desc">Description & Rules Text</label>
        <textarea
          id="custom-talent-desc"
          className="form-textarea"
          rows={3}
          placeholder="Describe your heroic talent mechanics..."
          value={customDescription}
          onChange={(e) => setCustomDescription(e.target.value)}
        />
        <p className="benefit-help-text">
          Examples: Advantage on saves for specific hazards, free tactical reactions when enemies move or cast spell, free action, unique combat maneuvers, or social/sensory aptitudes. Special ability might be [HL] times per long rest.
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
                <input
                  type="radio"
                  name="hpValue"
                  checked={hpBonusValue === 1}
                  onChange={() => setHpBonusValue(1)}
                /> +1 HP / Level
              </label>
              <label className="radio-sub-label">
                <input
                  type="radio"
                  name="hpValue"
                  checked={hpBonusValue === 2}
                  onChange={() => setHpBonusValue(2)}
                /> +2 HP / Level
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
              <select
                className="slots-dropdown-select"
                value={itemSlotValue}
                onChange={(e) => setItemSlotValue(Number(e.target.value))}
              >
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
                <input
                  type="radio"
                  name="acValue"
                  checked={acBonusValue === 1}
                  onChange={() => setAcBonusValue(1)}
                /> +1 AC
              </label>
              <label className="radio-sub-label">
                <input
                  type="radio"
                  name="acValue"
                  checked={acBonusValue === 2}
                  onChange={() => setAcBonusValue(2)}
                /> +2 AC
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
            <strong>Hidden / Zero-Slot Item</strong>
          </label>
          {mechanicalEffect === 'item' && (
            <div className="sub-radio-indent">
              <input
                type="text"
                placeholder="examples: Hidden Dagger, Poison Ring"
                value={hiddenItemName}
                onChange={(e) => setHiddenItemName(e.target.value)}
              />
            </div>
          )}

        </div>
      </div>

      <div className="custom-form-actions">
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="button" className="btn-primary" onClick={handleSubmit}>
          {initialTalent ? 'Save Changes' : 'Use Custom Talent'}
        </button>
      </div>
    </div>
  );
};