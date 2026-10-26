import { useState } from 'react';
import { TalentSelectorModal } from './TalentSelectorModal';

export interface Talent {
  id: string;
  name: string;
  type: string;
  set: string;
  description: string;
  repeatable?: boolean;
}

interface TalentsCardProps {
  talents: Talent[];
  selectedTalents: string[];
  maxTalentSlots: number;
  onTalentChange: (index: number, val: string) => void;
}

export function TalentsCard({
  talents,
  selectedTalents,
  maxTalentSlots,
  onTalentChange,
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
      {/* Header & Status */}
      <div className="talents-header-row">
        <h3 className="panel-heading">Talents</h3>
        <span className={`talents-status-badge ${isFull ? 'full' : 'incomplete'}`}>
          {filledCount} / {maxTalentSlots} Talents Selected
        </span>
      </div>

      {/* Instructions */}
      <p className="talents-instructions">
        Select or roll additional heroic talents, veteran tricks, or uncanny aptitudes:
      </p>

      {/* Slots Stack */}
      <div className="talents-slots-stack">
        {Array.from({ length: maxTalentSlots }).map((_, index) => {
          const currentId = selectedTalents[index] || '';
          const selected = talents.find((t) => t.id === currentId);

          return (
            <div key={index} className="talent-slot-item">
              {/* Slot Row */}
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

              {/* Trigger Button to Open Modal */}
              <button
                type="button"
                className={`talent-selector-trigger ${selected ? 'has-selection' : ''}`}
                onClick={() => setActiveModalIndex(index)}
              >
                {selected ? `[${selected.set}] ${selected.name}` : '-- Select a Talent --'}
              </button>

              {/* Description preview if selected */}
              {selected && (
                <div className="talent-description-box">
                  <strong>{selected.name}:</strong> {selected.description}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal Popup */}
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