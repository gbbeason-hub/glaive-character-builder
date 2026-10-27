import { useState, useEffect } from 'react';
import type { Talent } from './TalentsCard';

interface TalentSubOptionBoxProps {
  talent: Talent;
  selectedSubOptionId?: string;
  onSubOptionChange?: (subOptionId: string) => void;
}

export function TalentSubOptionBox({
  talent,
  selectedSubOptionId,
  onSubOptionChange,
}: TalentSubOptionBoxProps) {
  const [internalSubOptionId, setInternalSubOptionId] = useState<string>('');
  const activeSubOptionId = selectedSubOptionId ?? internalSubOptionId;

  useEffect(() => {
    if (talent?.subOptions && talent.subOptions.length > 0) {
      const defaultSubId = talent.subOptions[0].id;
      setInternalSubOptionId(defaultSubId);
      if (onSubOptionChange) onSubOptionChange(defaultSubId);
    } else {
      setInternalSubOptionId('');
      if (onSubOptionChange) onSubOptionChange('');
    }
  }, [talent]);

  const handleSubOptionSelect = (subId: string) => {
    setInternalSubOptionId(subId);
    if (onSubOptionChange) onSubOptionChange(subId);
  };

  if (!talent?.subOptions || talent.subOptions.length === 0) {
    return null;
  }

  const currentSubOption = talent.subOptions.find((sub) => sub.id === activeSubOptionId);

  return (
    <div className="sub-option-panel" style={{ marginTop: '8px' }}>
      <label className="field-label">{talent.name} Choice</label>
      <select
        value={activeSubOptionId}
        onChange={(e) => handleSubOptionSelect(e.target.value)}
        className="form-select-spacing"
      >
        {talent.subOptions.map((sub) => (
          <option key={sub.id} value={sub.id}>
            {sub.name}
          </option>
        ))}
      </select>
      <p className="sub-option-description" style={{ fontSize: '13px', color: '#555', marginTop: '4px' }}>
        {currentSubOption ? currentSubOption.description : 'Select an option.'}
      </p>
    </div>
  );
}