import { useState, useEffect } from 'react';

export interface Mutation {
  id: number;
  name: string;
  description: string;
}

interface MutationsCardProps {
  mutationsCatalog: Mutation[];
  selectedMutations: string[];
  onMutationsCountChange: (count: number) => void;
  onMutationChange: (index: number, mutationId: string) => void;
}

export function MutationsCard({
  mutationsCatalog,
  selectedMutations,
  onMutationsCountChange,
  onMutationChange,
}: MutationsCardProps) {
  const [localCount, setLocalCount] = useState<number>(selectedMutations.length);

  useEffect(() => {
    setLocalCount(selectedMutations.length);
  }, [selectedMutations]);

  const handleCountChange = (newCount: number) => {
    setLocalCount(newCount);
    onMutationsCountChange(newCount);
  };

  const rollMutation = (idx: number) => {
    if (!mutationsCatalog.length) return;
    const randomMutation = mutationsCatalog[Math.floor(Math.random() * mutationsCatalog.length)];
    onMutationChange(idx, String(randomMutation.id));
  };

  return (
    <div className="card-panel">
      <h3 className="panel-heading">MUTATIONS</h3>
      <p className="instruction-text">
        Characters typically don't start with mutations. But if you have a higher-level character, you might have them.
      </p>

      {/* Mutations Count Selector Row - Centered Alignment Fixed */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
        <label className="field-label" style={{ marginBottom: 0 }}>Mutations</label>
        <div style={{ width: '110px' }}>
          <select
            value={localCount}
            onChange={(e) => handleCountChange(Number(e.target.value))}
            className="form-select-spacing"
            style={{ marginBottom: 0 }}
          >
            {[0, 1, 2, 3, 4, 5, 6].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Mutation Slots Stack */}
      {localCount > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {Array.from({ length: localCount }).map((_, index) => {
            const currentId = selectedMutations[index] || '';
            const selected = mutationsCatalog.find((m) => String(m.id) === currentId);

            return (
              <div key={index} style={{ border: '1px solid var(--border)', padding: '14px', borderRadius: '6px', backgroundColor: '#f9f9f9' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label className="field-label" style={{ marginBottom: 0 }}>Mutation {index + 1}</label>
                  <button
                    type="button"
                    onClick={() => rollMutation(index)}
                    className="talent-roll-btn"
                  >
                    🎲 Roll Random
                  </button>
                </div>

                <select
                  value={currentId}
                  onChange={(e) => onMutationChange(index, e.target.value)}
                  className="form-select-spacing"
                  style={{ marginBottom: selected ? '10px' : '0' }}
                >
                  <option value="">-- Select a Mutation --</option>
                  {mutationsCatalog.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.id}. {m.name}
                    </option>
                  ))}
                </select>

                {selected && (
                  <div className="description-box" style={{ marginBottom: 0, fontSize: '13px' }}>
                    <strong>{selected.name}:</strong> {selected.description}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MutationsCard;