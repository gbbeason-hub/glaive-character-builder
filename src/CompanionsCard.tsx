export interface CompanionSlot {
  slotId: string;
  sourceTalentName: string;
  companionType: string;
}

interface CompanionsCardProps {
  grantedCompanions: CompanionSlot[];
  companionNames: Record<string, string>;
  onUpdateCompanionName: (slotId: string, name: string) => void;
}

export function CompanionsCard({
  grantedCompanions,
  companionNames,
  onUpdateCompanionName,
}: CompanionsCardProps) {
  if (grantedCompanions.length === 0) return null;

  return (
    <div className="card-panel">
      <h3 className="panel-heading">Companions & Summons</h3>
      <p className="instruction-text">Manage your loyal animal companions or summoned entities (occupy 0 inventory slots):</p>

      <div className="companions-stack">
        {grantedCompanions.map((comp) => (
          <div key={comp.slotId} className="companion-item" style={{ marginTop: '12px' }}>
            <label className="field-label">
              {comp.companionType} — <span style={{ fontWeight: 'normal', fontStyle: 'italic' }}>{comp.sourceTalentName}</span>
            </label>
            <input
              type="text"
              placeholder="Give your companion a name..."
              value={companionNames[comp.slotId] || ''}
              onChange={(e) => onUpdateCompanionName(comp.slotId, e.target.value)}
              className="form-select-spacing"
            />
          </div>
        ))}
      </div>
    </div>
  );
}