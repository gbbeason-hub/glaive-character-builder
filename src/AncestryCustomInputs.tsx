import React from 'react';

interface AncestryCustomInputsProps {
  customAncestryName: string;
  onCustomAncestryNameChange: (name: string) => void;
  customAncestrySummary: string;
  onCustomAncestrySummaryChange: (summary: string) => void;
  onReset: () => void;
}

export const AncestryCustomInputs: React.FC<AncestryCustomInputsProps> = ({
  customAncestryName,
  onCustomAncestryNameChange,
  customAncestrySummary,
  onCustomAncestrySummaryChange,
  onReset,
}) => (
  <div className="ancestry-custom-inputs-wrapper">
    <div className="ancestry-custom-row">
      <input
        type="text"
        placeholder="Custom ancestry name (e.g. Celestial, Minotaur)..."
        value={customAncestryName}
        onChange={(e) => onCustomAncestryNameChange(e.target.value)}
        className="ancestry-name-input"
        autoFocus
      />
      <button
        type="button"
        className="btn-secondary"
        onClick={onReset}
        title="Back to standard ancestries"
      >
        ✕
      </button>
    </div>
    <input
      type="text"
      placeholder="Short summary / description..."
      value={customAncestrySummary}
      onChange={(e) => onCustomAncestrySummaryChange(e.target.value)}
    />
  </div>
);