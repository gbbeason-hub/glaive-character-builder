interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HelpModal({ isOpen, onClose }: HelpModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        
        <div className="modal-header">
          <div className="modal-title-row">
            <h3>📖 Glaive Character Builder Help</h3>
            <button type="button" onClick={onClose} className="modal-close-btn">×</button>
          </div>
         
        </div>

        <div className="modal-item-list help-modal-body">

          <div className="help-section">
            <h4>Glaive RPG</h4>
            <p>
                 by Scott Wegener 
                 </p>
            <p><a href="https://lonely-adventurer.itch.io/glaivev2" target="_blank">Glaive v3 Rules on Itchio</a></p>  

            <p>
                <br/>Create Glaive characters online and generate a print-ready 8.5" x 11" PDF character sheet for tabletop play.
            </p>  
            
          </div>  

        <div className="help-section">
            <h4>Key Features</h4>
            <ul>
                <li>
                    <b>2-Page Printable Layout:</b> 8.5" x 11" portrait printing with front/back sections:
                    <ul><li>
                        Page 1 (Core & Combat): Stat blocks, conditions tracker, equipped weapon cards, and a 9-row talent write-in table.
                    </li>
                    <li>
                        Page 2 (Logistics & Inventory): Active bound spells list, 10 spell write-in slots, starting gear summary, and an 18-slot inventory grid.
                    </li>
                    </ul>
                </li>
                <li>
                    <b>Pencil-Friendly Progression Design:</b> 
                    <ul><li>
                        Unearned/locked inventory slots render with a subtle dashed border. As characters gain Strength or unlock slots, simply outline the dotted slots.
                    </li>
                    <li>
                        Dedicated write-in rows for additional weapons, spells, and talents acquired mid-session.
                    </li>
                    </ul>
                </li>
               
            </ul>
          </div>



          <div className="help-section">
            <h4>Character Creation Steps</h4>
            <p>
              Start with creating your hero's name and selecting their PC level. Pick your character's Ancestry, Background, Traits, Talents, and core Abilities.
            </p>
            <p>
                You can pick each or roll for a random selection. 
            </p>
          </div>

          <div className="help-section">
            <h4>Carrying Capacity & Burden</h4>
            <p>
              Your base carrying capacity is 10 plus your Strength modifier (and some talents give extra item slot ). Exceeding your maximum slots results in being <strong>Encumbered</strong> . . . and that means rolling with disadvantage and gaining fatigue each round in a dungeon.
            </p>
          </div>

          <div className="help-section">
            <h4>Magic & Spells</h4>
            <p>
              Spells are housed in spell containers. So, each spell is a slot in your inventory.
            </p>
          </div>

        <div className="help-section">
            <h4>Limits & Scope</h4>
            
            <ul>
                <li>
                    <b>Builder vs Online Character Sheet:</b> The focus is on a character builder. It's not intended to be an online character sheet you can use & update as you play at the table. It's meant to be printed. But you can save the JSON for your build, load it, and update it. 

                </li>
                <li>
                    <b>No Optional Simple Quantum Gear:</b> This option for gear isn't supported at this time. I currently don't have plans for it, but I'll consider it. 
                </li>
                <li>
                    <b>Core Items, Spells, Traits, Talents:</b> Glaive is great to customize. But I didn't build that ability into this version. (It'd be cool to include homebrewed content and give players an option to use it . . . but that's out of scope for now.)

                </li>
            </ul>
          </div>
          

        </div>

        <div className="modal-footer-row">
          <button type="button" onClick={onClose} className="btn-primary">
            Got It
          </button>
        </div>

      </div>
    </div>
  );
}