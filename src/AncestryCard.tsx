import { TalentSubOptionBox } from './TalentSubOptionBox';

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

  const availableAncestryTalents = talents.filter(
    (t) => t.set?.toLowerCase() === currentAncestry?.name?.toLowerCase()
  );

  const handleRollAncestry = () => {
    if (!ancestries.length) return;
    const randomIndex = Math.floor(Math.random() * ancestries.length);
    const randomAncestry = ancestries[randomIndex];
    onAncestryChange(randomAncestry.id);
  };

  return (
    <div className="card-panel">
      <h3 className="panel-heading">Ancestry</h3>

      <div className="form-group">
        <label className="field-label">Choose Ancestry</label>
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
        <p className="card-description">{currentAncestry?.summaryText}</p>
      </div>

      {selectedAncestryId !== 'human' && (
        <div className="form-group">
          <label className="field-label">Ancestry Talent</label>
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
          <p className="card-description">
            {currentTalent ? currentTalent.description : 'No talent selected.'}
          </p>
        </div>
      )}

      {/* Reusable Sub-Option Component */}
      {selectedAncestryId !== 'human' && currentTalent && (
        <TalentSubOptionBox
          talent={currentTalent}
          selectedSubOptionId={selectedSubOptionId}
          onSubOptionChange={onSubOptionChange}
        />
      )}

      <div className="card-actions">
        <button type="button" onClick={handleRollAncestry} className="btn-primary full-width">
          🎲 Roll Ancestry
        </button>
      </div>
    </div>
  );
}