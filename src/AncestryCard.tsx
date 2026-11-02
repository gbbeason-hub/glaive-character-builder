import { useState, useEffect } from 'react';
import { TalentSubOptionBox } from './TalentSubOptionBox';
import { AncestryCustomInputs } from './AncestryCustomInputs';
import { AncestryTalentModal } from './AncestryTalentModal';
import type { CustomTalent } from './CustomTalentForm';
import type { ItemCatalogEntry } from './BackgroundSelectorModal';

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
  isCustom?: boolean;
}

export interface Talent {
  id: string;
  name: string;
  type: string;
  set: string;
  description: string;
  isCustom?: boolean;
  subOptions?: SubOption[];
  effects?: Array<{ type: string; target: string; mode: string; value: number | string }>;
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
  customAncestryName: string;
  onCustomAncestryNameChange: (name: string) => void;
  customAncestrySummary: string;
  onCustomAncestrySummaryChange: (summary: string) => void;
  onAddCustomTalent?: (customTalent: CustomTalent) => void;
  itemsCatalog?: ItemCatalogEntry[];
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
  customAncestryName,
  onCustomAncestryNameChange,
  customAncestrySummary,
  onCustomAncestrySummaryChange,
  onAddCustomTalent,
  itemsCatalog = [],
}: AncestryCardProps) {
  const [isCustomAncestry, setIsCustomAncestry] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (selectedAncestryId === 'custom_ancestry_option') setIsCustomAncestry(true);
  }, [selectedAncestryId]);

  const currentAncestry = ancestries.find((a) => a.id === selectedAncestryId);
  const effectiveAncestryName = isCustomAncestry ? customAncestryName : (currentAncestry?.name || '');
  const currentTalent = talents.find((t) => t.id === selectedAncestryTalentId);

  const handleRollAncestry = () => {
    if (!ancestries.length) return;
    setIsCustomAncestry(false);
    const standardAncestries = ancestries.filter((a) => a.id !== 'custom_ancestry_option');
    onAncestryChange(standardAncestries[Math.floor(Math.random() * standardAncestries.length)].id);
  };

  return (
    <div className="card-panel">
      <h3 className="panel-heading">Ancestry</h3>

      <div className="form-group">
        <label className="field-label">Choose Ancestry</label>
        {isCustomAncestry ? (
          <AncestryCustomInputs
            customAncestryName={customAncestryName}
            onCustomAncestryNameChange={onCustomAncestryNameChange}
            customAncestrySummary={customAncestrySummary}
            onCustomAncestrySummaryChange={onCustomAncestrySummaryChange}
            onReset={() => {
              setIsCustomAncestry(false);
              onAncestryChange('');
              onCustomAncestryNameChange('');
            }}
          />
        ) : (
          <select 
            value={selectedAncestryId} 
            onChange={(e) => {
              if (e.target.value === 'CUSTOM_OPTION') {
                setIsCustomAncestry(true);
                onAncestryChange('custom_ancestry_option');
              } else {
                onAncestryChange(e.target.value);
              }
            }}
          aria-label="Ancestry Selection"
          >
            <option value="" disabled>-- Select an ancestry --</option>
            <option value="CUSTOM_OPTION">+ Custom Ancestry...</option>
            {ancestries.map((anc) => (
              <option key={anc.id} value={anc.id}>{anc.name}</option>
            ))}
          </select>
        )}

        <p className="card-description">
          {isCustomAncestry ? customAncestrySummary : currentAncestry?.summaryText}
        </p>
      </div>

      {selectedAncestryId !== 'human' && selectedAncestryId !== '' && (
        <div className="form-group">
          <label className="field-label">Ancestry Talent</label>
          
          <button
            type="button"
            className={`talent-selector-trigger full-width mb-2 ${currentTalent ? 'has-selection' : ''}`}
            onClick={() => setIsModalOpen(true)}
          >
            <span>{currentTalent ? currentTalent.name : '-- Select ancestry talent --'}</span>
            <span>▼</span>
          </button>

          <p className="card-description">{currentTalent ? currentTalent.description : 'No talent selected.'}</p>
        </div>
      )}

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

      <AncestryTalentModal
        isOpen={isModalOpen}
        ancestryName={effectiveAncestryName}
        initialTalent={currentTalent?.isCustom ? (currentTalent as CustomTalent) : null}
        itemsCatalog={itemsCatalog}
        onClose={() => setIsModalOpen(false)}
        onAddCustomTalent={onAddCustomTalent}
        onAncestryTalentChange={onAncestryTalentChange}
      />
    </div>
  );
}