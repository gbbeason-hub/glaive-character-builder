import { useState, useEffect } from 'react';
import { ItemCard } from './ItemCard';
import { AncestryCard } from './AncestryCard';
import { TalentsCard } from './TalentsCard';

// ==========================================
// 1. DATA SCHEMA TYPES & INTERFACES
// ==========================================
interface Abilities {
  strength: number;
  dexterity: number;
  willpower: number;
  wisdom: number;
}

interface Item {
  id: string;
  name: string;
  type: string;
  slots: number;
  damage?: string;
  defense?: number;
  cost?: number;
  details: string;
}

interface CharacterTraits {
  gender: string;
  hair: string;
  looks: string;
  skin: string;
  speech: string;
}

interface BackgroundEntry {
  min: number;
  max: number;
  name: string;
  text: string;
}

interface NameDatabase {
  names: string[];
  sobriquets: string[];
}

// Map of concise attribute descriptions
const attributeDescriptions: Record<keyof Abilities, string> = {
  strength: 'Melee attacks, physical saves, & bonus to most weapon damage',
  dexterity: 'delicate tasks, moving silently, saves for poise, speed, or grace, bonus to AC.',
  willpower: 'resolve, stubbornness, mental endurance, & use to wield & resist magic.',
  wisdom: 'ranged attacks, knowledge, insight, saves for intuition, obscure knowledge, or keen eyes.'
};

export function App() {
  // ==========================================
  // 2. APPLICATION REACT STATE STORAGE
  // ==========================================
  const [characterName, setCharacterName] = useState('Glaive Hero');
  const [level, setLevel] = useState(1);
  const [stats, setStats] = useState<Abilities>({ strength: 3, dexterity: 2, willpower: 1, wisdom: 0 });
  const [silver, setSilver] = useState<number>(50);

  const [itemCatalog, setItemCatalog] = useState<Item[]>([]);
  const [inventory, setInventory] = useState<Item[]>([]);
  const [importString, setImportString] = useState('');
  const [exportMessage, setExportMessage] = useState('');

  const [traitDatabase, setTraitDatabase] = useState<any>(null);
  const [nameDatabase, setNameDatabase] = useState<NameDatabase | null>(null);

  const [traits, setTraits] = useState<CharacterTraits>({
    gender: 'Masculine',
    hair: 'Bald',
    looks: 'Athletic',
    skin: 'Pale',
    speech: 'Formal'
  });

  const [bond, setBond] = useState<string>('Roll a bond with the PC to your left...');

  const [backgroundDatabase, setBackgroundDatabase] = useState<BackgroundEntry[] | null>(null);
  const [background, setBackground] = useState<string>('');

  // Ancestries
  const [ancestriesCatalog, setAncestriesCatalog] = useState<any[]>([]);
  const [talentsCatalog, setTalentsCatalog] = useState<any[]>([]);
  const [selectedAncestryId, setSelectedAncestryId] = useState<string>('demi_ogre');
  const [selectedAncestryTalentId, setSelectedAncestryTalentId] = useState<string>('anc_brick_outhouse');

  const [selectedTalents, setSelectedTalents] = useState<string[]>(['']);
  const [maxTalentSlots, setMaxTalentSlots] = useState<number>(1);

  // Sync logic: calculates max talent slots based on Ancestry and Level
  useEffect(() => {
    const isHuman = selectedAncestryId === 'human';
    const baseTalents = isHuman ? 2 : 1;
    const calculatedMax = Math.min(6, baseTalents + (level - 1));

    setMaxTalentSlots(calculatedMax);

    setSelectedTalents(prev => {
      if (prev.length < calculatedMax) {
        return [...prev, ...Array(calculatedMax - prev.length).fill('')];
      } else {
        return prev.slice(0, calculatedMax);
      }
    });
  }, [selectedAncestryId, level]);

  // ==========================================
  // 3. ASYNCHRONOUS DATABASE FETCH
  // ==========================================
  useEffect(() => {
    Promise.all([
      fetch('/items.json').then(res => res.json()),
      fetch('/traits.json').then(res => res.json()),
      fetch('/backgrounds.json').then(res => res.json()),
      fetch('/ancestries.json').then(res => res.json()),
      fetch('/talents.json').then(res => res.json()),
      fetch('/names.json').then(res => res.json())
    ])
      .then(([items, traitsData, backgroundData, ancestriesData, talentsData, namesData]) => {
        setItemCatalog(items);
        setTraitDatabase(traitsData);
        setBackgroundDatabase(backgroundData);
        setAncestriesCatalog(ancestriesData);
        setTalentsCatalog(talentsData);
        setNameDatabase(namesData);
      })
      .catch(err => console.error("Error initializing background data layers:", err));
  }, []);

  // ==========================================
  // 4. SYNCHRONOUS REAL-TIME EQUATIONS
  // ==========================================
  const maxStatBonus = Math.min(5, level + 2);
  const dynamicAttributeChoices = Array.from({ length: maxStatBonus + 1 }, (_, i) => maxStatBonus - i);
  const totalSlotsUsed = inventory.reduce((total, item) => total + item.slots, 0);
  const maxCarryingCapacity = 10 + stats.strength;
  const hitPoints = 10 + stats.strength + ((level - 1) * 5);

  const armorBonus = inventory
    .filter(item => item.type === 'Armor' && item.defense)
    .reduce((sum, item) => sum + Number(item.defense), 0);
  const armorClass = 10 + stats.dexterity + armorBonus;

  const expectedTotalPoints = 6 + (level - 1);
  const spentPoints = stats.strength + stats.dexterity + stats.willpower + stats.wisdom;
  const unspentPoints = expectedTotalPoints - spentPoints;

  // ==========================================
  // 5. HELPER ACTION FUNCTIONS
  // ==========================================
  const handleStatChange = (statName: keyof Abilities, value: number) => {
    setStats(prev => ({ ...prev, [statName]: value }));
  };

  const adjustSilver = (amount: number) => {
    setSilver(prev => Math.max(0, prev + amount));
  };

  const handleTraitChange = (traitName: keyof CharacterTraits, value: string) => {
    setTraits(prev => ({ ...prev, [traitName]: value }));
  };

  const rollStartingSilver = () => {
    const d20 = Math.floor(Math.random() * 20) + 1;
    const d6 = () => Math.floor(Math.random() * 6) + 1;
    let totalSilver = 0;

    if (d20 >= 1 && d20 <= 3) {
      totalSilver = 0;
    } else if (d20 >= 4 && d20 <= 17) {
      totalSilver = (d6() + d6()) * 10;
    } else if (d20 >= 18 && d20 <= 20) {
      totalSilver = (d6() + d6() + d6()) * 10;
    }

    setSilver(totalSilver);
  };

  const rollRandomAbilities = () => {
    const values = [3, 2, 1, 0];
    for (let i = values.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [values[i], values[j]] = [values[j], values[i]];
    }
    setStats({
      strength: values[0],
      dexterity: values[1],
      willpower: values[2],
      wisdom: values[3]
    });
  };

  const rollRandomName = () => {
    if (!nameDatabase) return;
    const { names, sobriquets } = nameDatabase;
    const getRandom = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

    const useSobriquet = Math.random() < 0.5;

    if (useSobriquet) {
      const firstName = getRandom(names);
      const sobriquet = getRandom(sobriquets);
      setCharacterName(`${firstName} the ${sobriquet}`);
    } else {
      const firstName = getRandom(names);
      let lastName = getRandom(names);
      while (lastName === firstName) {
        lastName = getRandom(names);
      }
      setCharacterName(`${firstName} ${lastName}`);
    }
  };

  const rollAllTraits = () => {
    if (!traitDatabase) return;
    const rollDice = (sides: number) => Math.floor(Math.random() * sides);

    setTraits({
      gender: traitDatabase.gender ? traitDatabase.gender[rollDice(6)] : 'Masculine',
      hair: traitDatabase.hair ? traitDatabase.hair[rollDice(20)] : 'Bald',
      looks: traitDatabase.looks ? traitDatabase.looks[rollDice(20)] : 'Athletic',
      skin: traitDatabase.skin ? traitDatabase.skin[rollDice(20)] : 'Pale',
      speech: traitDatabase.speech ? traitDatabase.speech[rollDice(20)] : 'Formal'
    });
  };

  const rollCharacterBond = () => {
    if (!traitDatabase || !traitDatabase.bonds) return;
    const rollColumn = Math.floor(Math.random() * 6);
    const rollRow = Math.floor(Math.random() * 6);
    setBond(traitDatabase.bonds[rollColumn][rollRow]);
  };

  const rollCharacterBackground = () => {
    if (!backgroundDatabase) return;
    const roll = Math.floor(Math.random() * 100) + 1;
    const match = backgroundDatabase.find(b => roll >= b.min && roll <= b.max);
    if (match) {
      setBackground(match.text);
    }
  };

  const handleAncestryChange = (ancestryId: string) => {
    setSelectedAncestryId(ancestryId);
    const foundAncestry = ancestriesCatalog.find(a => a.id === ancestryId);
    if (foundAncestry) {
      if (foundAncestry.fixedTalentIds && foundAncestry.fixedTalentIds.length > 0) {
        setSelectedAncestryTalentId(foundAncestry.fixedTalentIds[0]);
      } else {
        setSelectedAncestryTalentId('');
      }
    }
  };

  const exportCharacter = () => {
    const save = {
      name: characterName,
      level,
      stats,
      silver,
      traits,
      bond,
      background,
      selectedAncestryId,
      selectedAncestryTalentId,
      selectedTalents,
      inventoryIds: inventory.map(i => i.id)
    };
    navigator.clipboard.writeText(btoa(JSON.stringify(save)));
    setExportMessage('Character code copied to clipboard!');
    setTimeout(() => setExportMessage(''), 3000);
  };

  const importCharacter = () => {
    try {
      const decoded = JSON.parse(atob(importString.trim()));
      setCharacterName(decoded.name);
      setLevel(decoded.level || 1);
      setStats(decoded.stats);
      setSilver(decoded.silver ?? 50);
      setTraits(decoded.traits || { gender: 'Masculine', hair: 'Bald', looks: 'Athletic', skin: 'Pale', speech: 'Formal' });
      setBond(decoded.bond || 'Roll a bond with the PC to your left...');
      setBackground(decoded.background || decoded.backgroundText || '');

      if (decoded.selectedAncestryId) setSelectedAncestryId(decoded.selectedAncestryId);
      if (decoded.selectedAncestryTalentId) setSelectedAncestryTalentId(decoded.selectedAncestryTalentId);
      if (decoded.selectedTalents) setSelectedTalents(decoded.selectedTalents);

      setInventory(decoded.inventoryIds.map((id: string) => itemCatalog.find(idMatch => idMatch.id === id)).filter(Boolean));
      importString && setImportString('');
    } catch {
      alert('Error loading character code.');
    }
  };

  // ==========================================
  // 6. RENDER INTERFACE STRUCTURAL LAYOUT
  // ==========================================
  return (
    <div className="app-container">
      {/* Interactive App-Only Builder Container View */}
      <div className="builder-interface-view">
        <h1 className="main-title">Glaive v3 Character Builder</h1>

        {/* Single Column Flow Container */}
        <div className="card-stack">

          {/* Profile Header Details */}
          <div className="card-panel">
            <h3 className="panel-heading">Character Details</h3>
            <div className="form-row-two-col">
              <div className="form-group flex-2">
                <label className="field-label">Name</label>
                <input
                  type="text"
                  value={characterName}
                  onChange={(e) => setCharacterName(e.target.value)}
                  className="mb-2"
                />
                <button 
                  type="button" 
                  onClick={rollRandomName} 
                  className="btn-primary full-width"
                >
                  🎲 Roll Name
                </button>
              </div>
              <div className="form-group flex-1">
                <label className="field-label">PC Level</label>
                <select
                  value={level}
                  onChange={(e) => setLevel(Number(e.target.value))}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((lvl) => (
                    <option key={lvl} value={lvl}>
                      Level {lvl}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 1. Character Background Card */}
          <div className="card-panel">
            <h3 className="panel-heading">Background</h3>
            <p className="instruction-text">
              Select or roll your hero's origins, past training, and formative experiences:
            </p>

            <select
              value={background}
              onChange={e => setBackground(e.target.value)}
              className="form-select-spacing"
            >
              <option value="">-- Select a Background --</option>
              {backgroundDatabase && backgroundDatabase.map((b, idx) => (
                <option key={idx} value={b.text}>
                  {b.name}
                </option>
              ))}
            </select>

            {background && (
              <div className="description-box">
                {background}
              </div>
            )}

            <button type="button" onClick={rollCharacterBackground} className="btn-primary full-width">
              🎲 Roll d100 Character Background
            </button>
          </div>

          {/* 2. Abilities Card */}
          <div className="card-panel">
            <div className="panel-heading-row">
              <h3 className="panel-heading">Abilities</h3>
              {unspentPoints > 0 && (
                <span className="level-bonus-badge">
                  {unspentPoints} {unspentPoints === 1 ? 'Point' : 'Points'} Available
                </span>
              )}
            </div>
            <div className="instruction-block">
              <p className="instruction-text">
                At Level 1, distribute these starting bonuses across your abilities:
              </p>
              <div className="bonus-badge-group">
                <span className="bonus-badge">+3</span>
                <span className="bonus-badge">+2</span>
                <span className="bonus-badge">+1</span>
                <span className="bonus-badge">+0</span>
              </div>
              <p className="instruction-subtext">(Maximum ability score is +5)</p>
            </div>

            <div className="attributes-grid">
              {(Object.keys(stats) as Array<keyof Abilities>).map((s) => {
                const statKey = s as keyof Abilities;
                return (
                  <div key={statKey} className="attribute-field">
                    <label className="attribute-label">{statKey}</label>
                    <span className="attribute-desc">{attributeDescriptions[statKey]}</span>
                    <select 
                      value={stats[statKey]} 
                      onChange={e => handleStatChange(statKey, Number(e.target.value))}
                    >
                      {dynamicAttributeChoices.map(v => (
                        <option key={v} value={v}>+{v}</option>
                      ))}
                    </select>
                  </div>
                );
              })}
            </div>

            <button type="button" onClick={rollRandomAbilities} className="btn-primary full-width mt-3">
              🎲 Roll Ability Scores
            </button>
          </div>

          {/* 3. Ancestry Card */}
          <AncestryCard
            ancestries={ancestriesCatalog}
            talents={talentsCatalog}
            selectedAncestryId={selectedAncestryId}
            selectedAncestryTalentId={selectedAncestryTalentId}
            onAncestryChange={handleAncestryChange}
            onAncestryTalentChange={setSelectedAncestryTalentId}
          />

          {/* 4. Talents Card */}
          <TalentsCard
            talents={talentsCatalog}
            selectedTalents={selectedTalents}
            maxTalentSlots={maxTalentSlots}
            onTalentChange={(index, val) => {
              setSelectedTalents(prev => {
                const next = [...prev];
                next[index] = val;
                return next;
              });
            }}
          />

          {/* 5. Traits Card */}
          <div className="card-panel">
            <h3 className="panel-heading">Traits</h3>
            
            <div className="traits-grid">
              {(Object.keys(traits) as Array<keyof CharacterTraits>).map(t => (
                <div key={t} className="form-group">
                  <label className="field-label uppercase-label">{t}</label>
                  <select
                    value={traits[t]}
                    onChange={e => handleTraitChange(t, e.target.value)}
                    className="form-select-spacing"
                  >
                    {traitDatabase && traitDatabase[t] ? (
                      traitDatabase[t].map((optionValue: string, idx: number) => (
                        <option key={idx} value={optionValue}>
                          {optionValue}
                        </option>
                      ))
                    ) : (
                      <option value={traits[t]}>{traits[t]}</option>
                    )}
                  </select>
                </div>
              ))}
            </div>

            <button type="button" onClick={rollAllTraits} className="btn-primary full-width mt-3">
              🎲 Roll All Physical Traits
            </button>
          </div>

          {/* 6. Character Bond Card */}
          <div className="card-panel">
            <h3 className="panel-heading">Bond</h3>
            <p className="instruction-text">
              Relationship with the Player Character sitting to your left:
            </p>
            <textarea
              value={bond}
              onChange={e => setBond(e.target.value)}
              className="bond-textarea"
            />
            <button type="button" onClick={rollCharacterBond} className="btn-primary full-width">
              🎲 Roll Character Bond
            </button>
          </div>

          {/* 7. Starting Silver Panel */}
          <div className="card-panel">
            <label className="field-label-small">WALLETS & COINAGE</label>
            <div className="wallet-row">
              <input
                type="number"
                value={silver}
                onChange={(e) => setSilver(Math.max(0, parseInt(e.target.value) || 0))}
                className="silver-input"
              />
              <span className="currency-label">SP</span>
              <button type="button" onClick={() => adjustSilver(1)} className="btn-stepper">+1</button>
              <button type="button" onClick={() => adjustSilver(-1)} className="btn-stepper">-1</button>
              <button type="button" onClick={() => adjustSilver(10)} className="btn-stepper">+10</button>
              <button type="button" onClick={() => adjustSilver(-10)} className="btn-stepper">-10</button>
            </div>
            <button type="button" onClick={rollStartingSilver} className="btn-primary full-width">
              🎲 Roll Starting Wealth
            </button>
          </div>

          {/* 8. Character Dynamic Status Dashboard Card */}
          <div className={`card-panel status-card ${totalSlotsUsed > maxCarryingCapacity ? 'overencumbered' : ''}`}>
            <h3 className="panel-heading">Character Status</h3>
            <div className="status-grid">
              <div><strong className="vital-label">Hit Points:</strong> {hitPoints} HP</div>
              <div>
                <strong className="vital-label">Armor Class:</strong> {armorClass} AC
                {armorBonus > 0 && <span className="armor-bonus-subtext">(+{armorBonus} from gear)</span>}
              </div>
            </div>
            <p className="burden-text">
              <strong>Burden:</strong>{' '}
              <span className={`burden-badge ${totalSlotsUsed > maxCarryingCapacity ? 'exceeded' : 'normal'}`}>
                {totalSlotsUsed} / {maxCarryingCapacity} Slots
              </span>
            </p>
          </div>

          {/* 9. Equipped Inventory & Catalogs Section */}
          <div className="card-panel">
            <h3 className="panel-heading">Equipped Inventory</h3>

            <div className="starter-gear-notice">
              💼 <strong>Free Starter Gear:</strong> You are permanently equipped with a <em>Backpack</em>, <em>Flint & Steel</em>, worn travel clothing, and tiny trinkets. These items do not consume inventory slots.
            </div>

            <div className="inventory-drop-zone">
              {inventory.length === 0 ? (
                <p className="empty-inventory-text">No additional items equipped.</p>
              ) : (
                inventory.map((item, idx) => (
                  <ItemCard
                    key={idx}
                    item={item}
                    buttonText="Drop"
                    buttonColor="#c62828"
                    onButtonClick={() => setInventory(prev => prev.filter((_, i) => i !== idx))}
                  />
                ))
              )}
            </div>

            <h3 className="panel-heading section-spacer">Equipment Catalog</h3>

            {/* SECTION A: WEAPONS CATALOG LIST */}
            <h4 className="catalog-section-header">⚔️ Weapons</h4>
            <div className="catalog-scroll-box">
              {itemCatalog.filter(item => item.type === 'Weapon').length === 0 ? (
                <p className="empty-inventory-text">Loading weapons...</p>
              ) : (
                itemCatalog.filter(item => item.type === 'Weapon').map((item, index) => (
                  <ItemCard
                    key={`weapon-${item.id}-${index}`}
                    item={item}
                    buttonText="Equip"
                    buttonColor="#2e7d32"
                    onButtonClick={() => setInventory(prev => [...prev, item])}
                  />
                ))
              )}
            </div>

            {/* SECTION B: ARMOR CATALOG LIST */}
            <h4 className="catalog-section-header">🛡️ Armor & Shields</h4>
            <div className="catalog-scroll-box short">
              {itemCatalog.filter(item => item.type === 'Armor').length === 0 ? (
                <p className="empty-inventory-text">Loading armor...</p>
              ) : (
                itemCatalog.filter(item => item.type === 'Armor').map((item, index) => (
                  <ItemCard
                    key={`armor-${item.id}-${index}`}
                    item={item}
                    buttonText="Equip"
                    buttonColor="#2e7d32"
                    onButtonClick={() => setInventory(prev => [...prev, item])}
                  />
                ))
              )}
            </div>

            {/* SECTION C: GENERAL GEAR CATALOG LIST */}
            <h4 className="catalog-section-header">🎒 General Equipment</h4>
            <div className="catalog-scroll-box tall">
              {itemCatalog.filter(item => item.type === 'Equipment' || item.type === 'Ammunition').length === 0 ? (
                <p className="empty-inventory-text">Loading general gear...</p>
              ) : (
                itemCatalog.filter(item => item.type === 'Equipment' || item.type === 'Ammunition').map((item, index) => (
                  <ItemCard
                    key={`gear-${item.id}-${index}`}
                    item={item}
                    buttonText="Equip"
                    buttonColor="#2e7d32"
                    onButtonClick={() => setInventory(prev => [...prev, item])}
                  />
                ))
              )}
            </div>
          </div>

          {/* 10. Save / Load Clipboard System */}
          <div className="card-panel save-load-panel">
            <h3 className="panel-heading">Save / Load Tools</h3>
            <button type="button" onClick={exportCharacter} className="btn-primary full-width mb-2">
              📁 Copy Save Code
            </button>
            <button type="button" onClick={() => window.print()} className="btn-dark full-width mb-2">
              🖨️ Export PDF / Print Character Sheet
            </button>
            {exportMessage && <p className="success-message">{exportMessage}</p>}
            <input
              type="text"
              placeholder="Paste save code..."
              value={importString}
              onChange={e => setImportString(e.target.value)}
              className="import-input mb-2"
            />
            <button type="button" onClick={importCharacter} className="btn-secondary full-width">
              📥 Load Save Code
            </button>
          </div>

        </div>
      </div>

      {/* ========================================================= */}
      {/* PRINT/PDF EXPORT LAYOUT BLUEPRINT                         */}
      {/* ========================================================= */}
      <div className="printable-character-sheet">
        <div className="print-header-row">
          <div className="print-header-field flex-1">
            <span className="print-label">Name:</span> <span>{characterName}</span>
          </div>
          <div className="print-header-field print-silver-width">
            <span className="print-label">Silver:</span> <span>{silver}</span>
          </div>
        </div>

        <div className="print-grid">
          <div>
            <div className="print-stats-grid">
              <div className="print-stat-item"><b>STR:</b> +{stats.strength}</div>
              <div className="print-stat-item"><b>HP:</b> {hitPoints}</div>
              <div className="print-stat-item"><b>DEX:</b> +{stats.dexterity}</div>
              <div className="print-stat-item"><b>AC:</b> {armorClass}</div>
              <div className="print-stat-item"><b>WIL:</b> +{stats.willpower}</div>
              <div className="print-stat-item"><b>Level:</b> {level}</div>
              <div className="print-stat-item"><b>WIS:</b> +{stats.wisdom}</div>
              <div className="print-stat-item"><b>XP:</b> ——</div>
            </div>

            <div className="print-traits-grid">
              <div><strong>Gender:</strong> {traits.gender}</div>
              <div><strong>Hair:</strong> {traits.hair}</div>
              <div><strong>Looks:</strong> {traits.looks}</div>
              <div><strong>Skin:</strong> {traits.skin}</div>
              <div className="span-2"><strong>Speech:</strong> {traits.speech}</div>
            </div>

            <div className="print-narrative-block">
              <div className="mb-2"><strong>Bond:</strong> {bond}</div>
              <div><strong>Background:</strong> {background}</div>
            </div>
          </div>

          <div>
            <h4 className="print-section-title">Weapons & Combat Attacks</h4>
            {inventory.filter(i => i.type === 'Weapon').length === 0 ? (
              <div className="print-no-weapons">
                No weapons equipped. Unarmed Strike: 1d4 damage.
              </div>
            ) : (
              <div className="print-weapons-list">
                {inventory.filter(i => i.type === 'Weapon').map((w, idx) => (
                  <div key={idx} className="print-weapon-row">
                    ⚔️ <strong>{w.name}</strong> — Damage: <span className="underline">{w.damage || '1d6'}</span> | Tags: <em>{w.details}</em>
                  </div>
                ))}
              </div>
            )}

            <h4 className="print-section-title">Inventory (Capacity: {maxCarryingCapacity} Slots)</h4>
            <div className="print-inventory-grid">
              {Array.from({ length: 18 }).map((_, i) => {
                const item = inventory[i];
                return (
                  <div
                    key={i}
                    className={`print-inventory-slot ${i % 2 === 0 ? 'border-right' : ''} ${i >= maxCarryingCapacity ? 'locked' : ''}`}
                  >
                    <span className="print-slot-number">{i + 1}</span>
                    <span className={i >= maxCarryingCapacity ? 'strike-through' : ''}>
                      {item ? `${item.name} (${item.slots} slot)` : i >= maxCarryingCapacity ? '[Locked Slot]' : ''}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;