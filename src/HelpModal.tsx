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
         <div className="modal-stats-bar">
            <span><b>Build:</b> October 28, 2026</span>
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
            <p>For summaries of improvements & fixes, see <a href="#updates">What’s New</a>.</p>
            
          </div>  

        <div className="help-section">
            <h4>Key Features</h4>
            <p>
              <b>2-Page Printable Layout:</b> 8.5" x 11" portrait printing with front/back sections:
            </p>
                <ul><li>
                        Page 1 (Core & Combat): Stat blocks, conditions tracker, equipped weapon cards, and a 9-row talent write-in table.
                    </li>
                    <li>
                        Page 2 (Logistics & Inventory): Active bound spells list, 10 spell write-in slots, starting gear summary, and an 18-slot inventory grid.
                    </li>
                    </ul>
            <p>
              <b>Pencil-Friendly Progression:</b>
            </p>
                <ul><li>
                        Unearned/locked inventory slots have a dashed border. As characters gain Strength or unlock slots, simply outline the dotted slots.
                    </li>
                    <li>
                        Dedicated write-in rows for additional weapons, spells, and talents.
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
              Your base carrying capacity is 10 plus your Strength modifier (and some talents give extra item slot ). Exceeding your maximum slots results in being <strong>Encumbered</strong>. And that means rolling with disadvantage and gaining fatigue each round in a dungeon. 
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
                    <b>Builder vs Online Character Sheet:</b> The focus is on a character builder. It's not an online character sheet that's saved online so you can use & update as you play at the table. The character sheet meant to be printed. But you can save the JSON for your build, load it, and update it. 

                </li>
                <li>
                    <b>No Optional Simple Quantum Gear:</b> This option for gear isn't supported at this time. I currently don't have plans for it, but I'll consider it. 
                </li>
                <li>
                    <b>Core Items, Spells, Traits, Talents:</b> Glaive is great to customize. But I didn't build that ability into this version. (It'd be cool to include homebrewed content and give players an option to use it . . . but that's out of scope for now.)

                </li>
            </ul>
          </div>
          

          <div className="help-section">
            <h4 id="updates">What’s New</h4>
            <h5>Nov 15, 2026</h5>
            <ul>
              <li>
                <b>Background now has a dialog!</b> The dropdown list was long and tedious. I used thematic groups to organize them. 
              </li>
              <li>
                <b>Talents are limited to 6.</b> In the PDF, the number of blank talent lines are dynamically determined based on how many talents you select in the Builder, and they're capped to be no more than a total of 6 talents. 
              </li>
              <li><b>You can now create custom features!</b> They're only saved for your browser session and not to the standard lists. They're included in the copied or downloaded JSON so you can load them with the character. 
                <br/>
                <br/>For giving benefits, the custom talents and backgrounds follow the patterns of the standard ones -- bonuses to HP, AC, slots, inventory, and companions. Use the description for gameplay benefits, such as advantage on checks or saves in specific conditions.
              </li>
              <ul>
                <li>
                  <b>Custom Talents</b> - In the Select Talent dialog, click <b>+ Custom</b> to create a new talent. 
                </li>
                <li>
                  <b>Custom Ancestries</b> - Add both a custom ancestry with description and a custom starting talent for the ancestry. Select + Custom from the list of ancestries. In the Select Talent (Ancestry) dialog, click <b>+ Custom</b> to create a new talent. 
                </li>
                <li>
                  <b>Custom Backgrounds</b> - In the Select Background dialog, click <b>+ Custom</b> to create a new talent. 
                </li>
                <li>
                  <b>Custom Bonds</b> - Select + Custom from the list of bonds. 
                </li>
              </ul>
              <li>
                Fixed issues & inconsistencies with labels, inline help text, & PDF labels. 
              </li>
              <li>
                Added text to define Fatigue & Encumbered states.
              </li>
            </ul>
          </div>
        </div>


        <div className="help-section">

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