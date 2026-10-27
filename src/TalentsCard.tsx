import { useState } from 'react';
import { TalentSelectorModal } from './TalentSelectorModal';
import { TalentSubOptionBox } from './TalentSubOptionBox';

export interface SubOption {
  id: string;
  name: string;
  description: string;
}

export interface Talent {
  id: string;
  name: string;
  type: string;
  set: string;
  description: string;
  repeatable?: boolean;
  subOptions?: SubOption[];
}

interface TalentsCardProps {
  talents: Talent[];
  selectedTalents: string[];
  maxTalentSlots: number;
  onTalentChange: (index: number, val: string) => void;
  selectedTalentSubOptions?: Record<number, string>;
  onTalentSubOptionChange?: (index: number, subId: string) => void;
  backgroundGrantedTalentIds?: string[];
}

export function TalentsCard({
  talents,
  selectedTalents,
  maxTalentSlots,
  onTalentChange,
  selectedTalentSubOptions = {},
  onTalentSubOptionChange,
  backgroundGrantedTalentIds = [],
}: TalentsCardProps) {
  const [activeModalIndex, setActiveModalIndex] = useState<number | null>(null);

  const filledCount = selectedTalents.filter(Boolean).length;
  const isFull = filledCount === maxTalentSlots && maxTalentSlots > 0;

  const rollTalent = (idx: number) => {
    if (!talents.length) return;
    
    const availablePool = talents.filter((t) => {
      if (t.repeatable || t.id === selectedTalents[idx]) return true;
      return !selectedTalents.some((selectedId, i) => i !== idx && selectedId === t.id);
    });

    if (!availablePool.length) return;
    const rand = availablePool[Math.floor(Math.random() * availablePool.length)];
    onTalentChange(idx, rand.id);
  };

  return (
    <div className="talents-card">
      <div className="talents-header-row">
        <h3 className="panel-heading">Talents</h3>
        <span className={`talents-status-badge ${isFull ? 'full' : 'incomplete'}`}>
          {filledCount} / {maxTalentSlots} Talents Selected
        </span>
      </div>

      <p className="talents-instructions">
        Select or roll additional heroic talents, veteran tricks, or uncanny aptitudes:
      </p>

      <div className="talents-slots-stack">
        {/* 1. Render Regular Selectable Talent Slots */}
        {Array.from({ length: maxTalentSlots }).map((_, index) => {
          const currentId = selectedTalents[index] || '';
          const selected = talents.find((t) => t.id === currentId);

          return (
            <div key={index} className="talent-slot-item" style={{ marginBottom: '16px' }}>
              <div className="talent-slot-row">
                <label className="talent-slot-label">Talent Slot {index + 1}</label>
                <button 
                  type="button" 
                  onClick={() => rollTalent(index)} 
                  className="talent-roll-btn"
                >
                  🎲 Roll Random
                </button>
              </div>

              <button
                type="button"
                className={`talent-selector-trigger ${selected ? 'has-selection' : ''}`}
                onClick={() => setActiveModalIndex(index)}
              >
                {selected ? `[${selected.set}] ${selected.name}` : '-- Select a Talent --'}
              </button>

              {selected && (
                <div className="talent-description-box" style={{ marginTop: '6px' }}>
                  <strong>{selected.name}:</strong> {selected.description}
                </div>
              )}

              {selected && (
                <TalentSubOptionBox
                  talent={selected}
                  selectedSubOptionId={selectedTalentSubOptions[index]}
                  onSubOptionChange={(subId) => {
                    if (onTalentSubOptionChange) onTalentSubOptionChange(index, subId);
                  }}
                />
              )}
            </div>
          );
        })}

        {/* 2. Render Background-Granted Read-Only Talents Right Inline */}
        {backgroundGrantedTalentIds.map((grantedId) => {
          const grantedTalent = talents.find((t) => t.id === grantedId);
          if (!grantedTalent) return null;

          return (
            <div key={grantedId} className="talent-slot-item granted-talent-box" style={{ marginBottom: '16px', background: '#f8fafc', padding: '14px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
              <div className="talent-slot-row">
                <label className="talent-slot-label" style={{ fontWeight: 'bold', color: '#334155' }}>
                  [{grantedTalent.set}] {grantedTalent.name} <span style={{ fontSize: '0.8rem', fontWeight: 'normal', color: '#0284c7', fontStyle: 'italic' }}>(Derived from Background)</span>
                </label>
              </div>
              <div className="talent-description-box" style={{ marginTop: '6px', background: '#ffffff' }}>
                <strong>{grantedTalent.name}:</strong> {grantedTalent.description}
              </div>
            </div>
          );
        })}
      </div>

      {activeModalIndex !== null && (
        <TalentSelectorModal
          isOpen={activeModalIndex !== null}
          onClose={() => setActiveModalIndex(null)}
          talents={talents}
          selectedTalents={selectedTalents}
          currentIndex={activeModalIndex}
          onSelectTalent={(talentId) => onTalentChange(activeModalIndex, talentId)}
        />
      )}
    </div>
  );
}