import React from 'react';
import { CustomTalentForm } from './CustomTalentForm';
import type { CustomTalent } from './CustomTalentForm';
import type { ItemCatalogEntry } from './BackgroundSelectorModal';

interface AncestryTalentModalProps {
  isOpen: boolean;
  ancestryName: string;
  initialTalent?: CustomTalent | null;
  itemsCatalog?: ItemCatalogEntry[];
  onClose: () => void;
  onAddCustomTalent?: (customTalent: CustomTalent) => void;
  onAncestryTalentChange: (talentId: string) => void;
}

export const AncestryTalentModal: React.FC<AncestryTalentModalProps> = ({
  isOpen,
  ancestryName,
  initialTalent,
  itemsCatalog = [],
  onClose,
  onAddCustomTalent,
  onAncestryTalentChange,
}) => {
  if (!isOpen) return null;

  const effectiveName = ancestryName && ancestryName !== 'Custom' ? ancestryName : 'Ancestry';
  const isEditing = Boolean(initialTalent);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card talent-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-row">
            <h3>{isEditing ? `Edit Custom Talent (${effectiveName})` : `Custom Talent (${effectiveName})`}</h3>
            <button type="button" className="modal-close-btn" onClick={onClose}>
              ✕
            </button>
          </div>
        </div>
        
        <div className="modal-body-content">
          <CustomTalentForm
            initialTalent={
              initialTalent || {
                id: `ancestry_talent_${Date.now()}`,
                name: '',
                type: 'ancestry',
                set: effectiveName,
                description: '',
                isCustom: true,
              }
            }
            itemsCatalog={itemsCatalog}
            hideSetSelection={true}
            submitButtonText={isEditing ? 'Save Changes' : 'Use Custom Talent'}
            onCancel={onClose}
            onSubmitCustomTalent={(newTalent) => {
              const forcedAncestryTalent = {
                ...newTalent,
                type: 'ancestry',
                set: effectiveName,
              };
              if (onAddCustomTalent) {
                onAddCustomTalent(forcedAncestryTalent);
              }
              onAncestryTalentChange(forcedAncestryTalent.id);
              onClose();
            }}
          />
        </div>
      </div>
    </div>
  );
};