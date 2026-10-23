import { useState, useEffect } from 'react';

export interface SubOption {
  id: string;
  name: string;
  description: string;
}

export interface Ancestry {
  id: string;
  name: string;
  fixedTalentIds: string[];
  bonusTalentCount: number;
  summaryText: string;
}

export interface Talent {
  id: string;
  name: string;
  type: string;
  set: string;
  description: string;
  subOptions?: SubOption[];
  effects?: Array<{
    type: string;
    target: string;
    mode: string;
    value: number | string;
  }>;
}

interface AncestryCardProps {
  ancestries: Ancestry[];
  talents: Talent[];
  selectedAncestryId: string;
  selectedAncestryTalentId: string;
  selectedSubOptionId?: string;
  onAncestryChange: (ancestryId: string) => void;
  onAncestryTalentChange: (talentId: string) => void;
  onSubOptionChange?: (subOptionId: string) => void;
}

export function AncestryCard({
  ancestries,
  talents,
  selectedAncestryId,
  selectedAncestryTalentId,
  selectedSubOptionId,
  onAncestryChange,
  onAncestryTalentChange,
  onSubOptionChange,
}: AncestryCardProps) {
  const currentAncestry = ancestries.find((a) => a.id === selectedAncestryId) || ancestries[0];
  const currentTalent = talents.find((t) => t.id === selectedAncestryTalentId);

  const availableAncestryTalents = currentAncestry?.id === 'human'
    ? talents
    : talents.filter((t) => t.set?.toLowerCase() === currentAncestry?.name?.toLowerCase());

  const [internalSubOptionId, setInternalSubOptionId] = useState<string>('');
  const activeSubOptionId = selectedSubOptionId ?? internalSubOptionId;

  useEffect(() => {
    if (currentTalent?.subOptions && currentTalent.subOptions.length > 0) {
      const defaultSubId = currentTalent.subOptions[0].id;
      setInternalSubOptionId(defaultSubId);
      if (onSubOptionChange) onSubOptionChange(defaultSubId);
    } else {
      setInternalSubOptionId('');
      if (onSubOptionChange) onSubOptionChange('');
    }
  }, [currentTalent]);

  const handleSubOptionSelect = (subId: string) => {
    setInternalSubOptionId(subId);
    if (onSubOptionChange) onSubOptionChange(subId);
  };

  const currentSubOption = currentTalent?.subOptions?.find((sub) => sub.id === activeSubOptionId);

  const handleRollAncestry = () => {
    if (!ancestries.length) return;
    const randomIndex = Math.floor(Math.random() * ancestries.length);
    const randomAncestry = ancestries[randomIndex];
    onAncestryChange(randomAncestry.id);
  };

  return (
    <div style={{ border: '1px solid var(--border)', padding: '20px', borderRadius: '8px', marginBottom: '20px', backgroundColor: '#fff', textAlign: 'left', boxShadow: 'var(--shadow)' }}>
      <h3 style={{ margin: '0 0 16px 0', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>Ancestry</h3>

      {/* Row 1: Ancestry Select & Summary stacked */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px', color: 'var(--text-h)' }}>
          Choose Ancestry
        </label>
        <select
          value={selectedAncestryId}
          onChange={(e) => onAncestryChange(e.target.value)}
        >
          {ancestries.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
        <div style={{ fontSize: '14px', color: '#555', marginTop: '6px', lineHeight: '1.4' }}>
          {currentAncestry?.summaryText}
        </div>
      </div>

      {/* Row 2: Ancestry Talent Select & Description stacked */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px', color: 'var(--text-h)' }}>
          Ancestry Talent
        </label>
        <select
          value={selectedAncestryTalentId}
          onChange={(e) => onAncestryTalentChange(e.target.value)}
        >
          {availableAncestryTalents.length === 0 ? (
            <option value="">None</option>
          ) : (
            availableAncestryTalents.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))
          )}
        </select>
        <div style={{ fontSize: '14px', color: '#555', marginTop: '6px', lineHeight: '1.4' }}>
          {currentTalent ? currentTalent.description : 'No talent selected.'}
        </div>
      </div>

      {/* Row 3: Sub-Option Selector stacked */}
      {currentTalent?.subOptions && currentTalent.subOptions.length > 0 && (
        <div style={{ marginBottom: '16px', padding: '14px', backgroundColor: 'var(--bg)', borderRadius: '6px', border: '1px solid var(--border)' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 'bold', marginBottom: '6px', color: 'var(--text-h)' }}>
            {currentTalent.name} Choice
          </label>
          <select
            value={activeSubOptionId}
            onChange={(e) => handleSubOptionSelect(e.target.value)}
          >
            {currentTalent.subOptions.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
              </option>
            ))}
          </select>
          <div style={{ fontSize: '14px', color: '#444', marginTop: '6px', lineHeight: '1.4', fontWeight: '500' }}>
            {currentSubOption ? currentSubOption.description : 'Select an option.'}
          </div>
        </div>
      )}

      <div>
        <button
          onClick={handleRollAncestry}
          style={{ backgroundColor: 'var(--accent)', color: '#fff', padding: '8px 14px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}
        >
          🎲 Roll Ancestry
        </button>
      </div>
    </div>
  );
}