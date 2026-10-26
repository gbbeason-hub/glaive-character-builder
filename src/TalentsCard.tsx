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

              {/* Dropdown */}
              <select
                value={currentId}
                onChange={(e) => onTalentChange(index, e.target.value)}
                className={`talent-select ${selected ? 'has-selection' : ''}`}
              >
                <option value="">-- Select a Talent --</option>
                {talents
                  .filter((t) => {
                    if (t.repeatable || t.id === currentId) return true;
                    return !selectedTalents.some((selectedId, idx) => idx !== index && selectedId === t.id);
                  })
                  .map((t) => (
                    <option key={t.id} value={t.id}>
                      [{t.set}] {t.name} {t.repeatable ? '(Repeatable)' : ''}
                    </option>
                  ))}
              </select>

              {/* Description */}
              {selected && (
                <div className="talent-description-box">
                  <strong>{selected.name}:</strong> {selected.description}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}