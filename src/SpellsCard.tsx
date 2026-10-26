import { useState } from 'react';

export interface Spell {
  id: number;
  name: string;
  range: string | null;
  save?: string;
  description: string;
}

export interface ContainerSlot {
  slotId: string;
  sourceTalentName: string;
  containerType: string;
  itemSlots: number;
}

interface SpellsCardProps {
  spellsCatalog: Spell[];
  grantedContainers: ContainerSlot[];
  assignedSpells: Record<string, number>; // slotId -> spellId
  onAssignSpell: (slotId: string, spellId: number) => void;
  willpowerBonus: number;
}

export function SpellsCard({
  spellsCatalog,
  grantedContainers,
  assignedSpells,
  onAssignSpell,
  willpowerBonus,
}: SpellsCardProps) {
  if (grantedContainers.length === 0) {
    return null; // Do not display if no container-granting talents are selected
  }

  const rollRandomSpell = (slotId: string) => {
    if (!spellsCatalog.length) return;
    const randomSpell = spellsCatalog[Math.floor(Math.random() * spellsCatalog.length)];
    onAssignSpell(slotId, randomSpell.id);
  };

  return (
    <div className="card-panel">
      {/* Header with WIL Bonus badge integrated */}
      <div className="panel-heading-row">
        <h3 className="panel-heading">Spells & Magic Containers</h3>
        <span className="level-bonus-badge">
          WIL Bonus: {willpowerBonus >= 0 ? `+${willpowerBonus}` : willpowerBonus}
        </span>
      </div>

      <p className="instruction-text" style={{ marginBottom: '16px' }}>
        Spells are living, sentient fragments of chaos bound to containers. Assign a spell to each unlocked container slot.
      </p>

      {/* Container Slots Stack */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {grantedContainers.map((container, idx) => {
          const currentSpellId = assignedSpells[container.slotId];
          const selectedSpell = spellsCatalog.find((s) => s.id === currentSpellId);

          return (
            <div
              key={container.slotId}
              style={{
                border: '1px solid var(--border)',
                padding: '12px 14px',
                borderRadius: '6px',
                backgroundColor: '#f9f9f9',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px',
                }}
              >
                <div>
                  <label className="field-label" style={{ marginBottom: 0 }}>
                    {container.containerType} #{idx + 1}
                  </label>
                  <span style={{ fontSize: '12px', color: '#666', fontStyle: 'italic' }}>
                    Granted by {container.sourceTalentName} ({container.itemSlots} Slot{container.itemSlots !== 1 ? 's' : ''})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => rollRandomSpell(container.slotId)}
                  className="talent-roll-btn"
                >
                  🎲 Roll Random Spell
                </button>
              </div>

              <select
                value={currentSpellId || ''}
                onChange={(e) => onAssignSpell(container.slotId, Number(e.target.value))}
                className="form-select-spacing"
                style={{ marginBottom: selectedSpell ? '8px' : '0' }}
              >
                <option value="">-- Select a Spell --</option>
                {spellsCatalog.map((spell) => (
                  <option key={spell.id} value={spell.id}>
                    {spell.id}. {spell.name} {spell.range ? `(${spell.range})` : ''}
                  </option>
                ))}
              </select>

              {selectedSpell && (
                <div className="description-box" style={{ marginBottom: 0, fontSize: '13px' }}>
                  <strong>{selectedSpell.name}</strong>
                  {selectedSpell.range && <span> • Range: {selectedSpell.range}</span>}
                  {selectedSpell.save && <span> • Save: {selectedSpell.save}</span>}
                  <p style={{ marginTop: '4px', marginBottom: 0 }}>{selectedSpell.description}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SpellsCard;