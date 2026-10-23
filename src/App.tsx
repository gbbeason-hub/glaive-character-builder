import { useState, useEffect } from 'react';
import { ItemCard } from './ItemCard';
import { AncestryCard } from './AncestryCard';

// ==========================================
// 1. DATA SCHEMA TYPES & INTERFACES
// ==========================================
interface Attributes {
  strength: number;
  dexterity: number;
  constitution: number;
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

export function App() {
  // ==========================================
  // 2. APPLICATION REACT STATE STORAGE
  // ==========================================
  const [characterName, setCharacterName] = useState('Glaive Hero');
  const [level, setLevel] = useState(1);
  const [stats, setStats] = useState<Attributes>({ strength: 3, dexterity: 2, constitution: 1, wisdom: 0 });
  const [silver, setSilver] = useState<number>(50);

  const [itemCatalog, setItemCatalog] = useState<Item[]>([]); 
  const [inventory, setInventory] = useState<Item[]>([]);     
  const [importString, setImportString] = useState('');
  const [exportMessage, setExportMessage] = useState('');

  const [traitDatabase, setTraitDatabase] = useState<any>(null);

  const [traits, setTraits] = useState<CharacterTraits>({
    gender: 'Masculine',
    hair: 'Bald',
    looks: 'Athletic',
    skin: 'Pale',
    speech: 'Formal'
  });

  const [bond, setBond] = useState<string>('Roll a bond with the PC to your left...');

  const [backgroundDatabase, setBackgroundDatabase] = useState<BackgroundEntry[] | null>(null);
  const [background, setBackground] = useState<string>('Roll or write a character background...');
  
  // Ancestries
  const [ancestriesCatalog, setAncestriesCatalog] = useState<any[]>([]);
  const [talentsCatalog, setTalentsCatalog] = useState<any[]>([]);
  const [selectedAncestryId, setSelectedAncestryId] = useState<string>('demi_ogre');
  const [selectedAncestryTalentId, setSelectedAncestryTalentId] = useState<string>('anc_brick_outhouse');

  // ==========================================
  // 3. ASYNCHRONOUS DATABASE FETCH
  // ==========================================
  useEffect(() => {
    Promise.all([
      fetch('/items.json').then(res => res.json()),
      fetch('/traits.json').then(res => res.json()),
      fetch('/backgrounds.json').then(res => res.json()),
      fetch('/ancestries.json').then(res => res.json()),
      fetch('/talents.json').then(res => res.json())       
    ])
    .then(([items, traitsData, backgroundData, ancestriesData, talentsData]) => {
      setItemCatalog(items);
      setTraitDatabase(traitsData);
      setBackgroundDatabase(backgroundData);
      setAncestriesCatalog(ancestriesData);
      setTalentsCatalog(talentsData);       
    })
    .catch(err => console.error("Error initializing background data layers:", err));
  }, []);

  // ==========================================
  // 4. SYNCHRONOUS REAL-TIME EQUATIONS (DERIVED STATS)
  // ==========================================
  const maxStatBonus = Math.min(5, level + 2);
  const dynamicAttributeChoices = Array.from({ length: maxStatBonus + 1 }, (_, i) => maxStatBonus - i);
  const totalSlotsUsed = inventory.reduce((total, item) => total + item.slots, 0);
  const maxCarryingCapacity = 10 + stats.strength;
  const hitPoints = 10 + stats.strength; 
  
  const armorBonus = inventory
    .filter(item => item.type === 'Armor' && item.defense)
    .reduce((sum, item) => sum + Number(item.defense), 0);
  const armorClass = 10 + stats.dexterity + armorBonus;

  // ==========================================
  // 5. HELPER ACTION FUNCTIONS
  // ==========================================
  const handleStatChange = (statName: keyof Attributes, value: number) => {
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
    const resultBond = traitDatabase.bonds[rollColumn][rollRow];
    setBond(resultBond);
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
      setBackground(decoded.background || 'Roll or write a character background...');
      
      if (decoded.selectedAncestryId) setSelectedAncestryId(decoded.selectedAncestryId);
      if (decoded.selectedAncestryTalentId) setSelectedAncestryTalentId(decoded.selectedAncestryTalentId);

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
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '760px', margin: '0 auto' }}>
      
      {/* Interactive App-Only Builder Container View */}
      <div className="builder-interface-view">
        <h1 style={{ textAlign: 'center' }}>Glaive v3 Character Builder</h1>
        <hr style={{ marginBottom: '20px' }} />
        
        {/* Single Column Flow Container */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Profile Header Details */}
          <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', backgroundColor: '#fff' }}>
            <h3 style={{ margin: '0 0 12px 0' }}>Character Details</h3>
            <div style={{ display: 'flex', gap: '20px' }}>
              <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontWeight: 'bold', fontSize: '13px' }}>Character Name: </label>
                <input type="text" value={characterName} onChange={(e) => setCharacterName(e.target.value)} style={{ padding: '8px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc', width: '100%', boxSizing: 'border-box' }} />
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ fontWeight: 'bold', fontSize: '13px' }}>PC Level: </label>
                <input type="number" min={1} max={20} value={level} onChange={(e) => setLevel(Math.max(1, Number(e.target.value)))} style={{ padding: '8px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc', width: '100%', boxSizing: 'border-box' }} />
              </div>
            </div>
          </div>

          {/* 1. Character Background Card */}
          <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', backgroundColor: '#fff' }}>
            <h3 style={{ margin: '0 0 10px 0' }}>Character Background</h3>
            <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '8px' }}>
              Select or roll your hero's origins, past training, and formative experiences:
            </label>
            
            <select 
              value={background} 
              onChange={e => setBackground(e.target.value)}
              style={{ width: '100%', padding: '8px', fontSize: '14px', borderRadius: '4px', border: '1px solid #ccc', marginBottom: '10px' }}
            >
              <option value="">-- Select a Background --</option>
              {backgroundDatabase && backgroundDatabase.map((b, idx) => (
                <option key={idx} value={b.text}>
                  {b.name}
                </option>
              ))}
            </select>

            {/* Display full description box if a background is selected */}
            {background && (
              <div style={{ fontSize: '14px', color: '#333', backgroundColor: '#f9f9f9', padding: '10px', borderRadius: '6px', border: '1px solid #eee', marginBottom: '10px', lineHeight: '1.4' }}>
                {background}
              </div>
            )}

            <button onClick={rollCharacterBackground} style={{ backgroundColor: '#4a5568', color: '#fff', padding: '8px 12px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', width: '100%', fontWeight: '500' }}>
              🎲 Roll d100 Character Background
            </button>
          </div>

          {/* 2. Attributes Card */}
          <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', backgroundColor: '#fff' }}>
            <h3 style={{ margin: '0 0 12px 0' }}>Attributes</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', backgroundColor: '#f5f5f5', padding: '15px', borderRadius: '8px' }}>
              {(Object.keys(stats) as Array<keyof Attributes>).map(s => (
                <div key={s} style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  <label style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>{s}</label>
                  <select value={stats[s]} onChange={e => handleStatChange(s, Number(e.target.value))}>
                    {dynamicAttributeChoices.map(v => <option key={v} value={v}>+{v}</option>)}
                  </select>
                </div>
              ))}
            </div>
          </div>
          
          {/* 3. Ancestry Card */}
          <div>
            <AncestryCard 
              ancestries={ancestriesCatalog}
              talents={talentsCatalog}
              selectedAncestryId={selectedAncestryId}
              selectedAncestryTalentId={selectedAncestryTalentId}
              onAncestryChange={handleAncestryChange}
              onAncestryTalentChange={setSelectedAncestryTalentId}
            />
          </div>

          {/* [4. Talents Card will go here] */}

          {/* 5. Traits Card */}
          <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', backgroundColor: '#fff' }}>
            <h3 style={{ margin: '0 0 10px 0' }}>Traits</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
              {(Object.keys(traits) as Array<keyof CharacterTraits>).map(t => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                  <label style={{ fontWeight: 'bold', textTransform: 'capitalize', fontSize: '14px', width: '70px' }}>{t}:</label>
                  <input 
                    type="text" 
                    value={traits[t]} 
                    onChange={e => handleTraitChange(t, e.target.value)}
                    style={{ flex: 1, padding: '5px', borderRadius: '4px', border: '1px solid #ccc' }} 
                  />
                </div>
              ))}
            </div>
            <button onClick={rollAllTraits} style={{ backgroundColor: '#2b6cb0', color: '#fff', padding: '8px 12px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', width: '100%', fontWeight: '500' }}>
              🎲 Randomize All Physical Traits
            </button>
          </div>

          {/* 6. Character Bond Card */}
          <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', backgroundColor: '#fff' }}>
            <h3 style={{ margin: '0 0 10px 0' }}>Character Bond</h3>
            <label style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '8px' }}>
              Relationship with the Player Character sitting to your left:
            </label>
            <textarea 
              value={bond} 
              onChange={e => setBond(e.target.value)}
              style={{ width: '100%', minHeight: '50px', padding: '8px', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc', fontFamily: 'sans-serif', fontSize: '14px', marginBottom: '10px', resize: 'vertical' }} 
            />
            <button onClick={rollCharacterBond} style={{ backgroundColor: '#718096', color: '#fff', padding: '8px 12px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', width: '100%', fontWeight: '500' }}>
              🎲 Roll 2d6 Character Bond Matrix
            </button>
          </div>

          {/* 7. Starting Silver Panel */}
          <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', backgroundColor: '#fff' }}>
            <label style={{ fontSize: '0.85rem', color: '#666', display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>WALLETS & COINAGE</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <input 
                type="number" 
                value={silver} 
                onChange={(e) => setSilver(Math.max(0, parseInt(e.target.value) || 0))}
                style={{ width: '90px', padding: '6px', fontSize: '16px', fontWeight: 'bold' }} 
              />
              <span style={{ fontWeight: 'bold', marginRight: '10px' }}>SP</span>
              <button onClick={() => adjustSilver(1)} style={{ padding: '6px 10px' }}>+1</button>
              <button onClick={() => adjustSilver(-1)} style={{ padding: '6px 10px' }}>-1</button>
              <button onClick={() => adjustSilver(10)} style={{ padding: '6px 10px' }}>+10</button>
              <button onClick={() => adjustSilver(-10)} style={{ padding: '6px 10px' }}>-10</button>
            </div>
            <button onClick={rollStartingSilver} style={{ backgroundColor: '#4A5568', color: '#fff', padding: '8px 12px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', width: '100%', fontWeight: '500', marginTop: '5px' }}>
              🎲 Roll Starting Wealth (1d20 Tier Table)
            </button>
          </div>

          {/* 8. Character Dynamic Status Dashboard Card */}
          <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', backgroundColor: totalSlotsUsed > maxCarryingCapacity ? '#fff0f0' : '#fff' }}>
            <h3 style={{ margin: '0 0 10px 0' }}>Character Status</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div><strong>Hit Points:</strong> {hitPoints} HP</div>
              <div>
                <strong>Armor Class:</strong> {armorClass} AC 
                {armorBonus > 0 && <span style={{ fontSize: '11px', color: 'green', display: 'block' }}>(+{armorBonus} from gear)</span>}
              </div>
            </div>
            <p style={{ margin: '5px 0 0 0' }}><strong>Burden:</strong> <span style={{ color: totalSlotsUsed > maxCarryingCapacity ? 'red' : 'green', fontWeight: 'bold' }}>{totalSlotsUsed} / {maxCarryingCapacity} Slots</span></p>
          </div>

          {/* 9. Equipped Inventory & Catalogs Section */}
          <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', backgroundColor: '#fff' }}>
            <h3 style={{ margin: '0 0 10px 0' }}>Equipped Inventory</h3>
            
            <div style={{ backgroundColor: '#ebf8ff', borderLeft: '4px solid #3182ce', padding: '10px', borderRadius: '4px', marginBottom: '12px', fontSize: '13px', lineHeight: '1.4' }}>
              💼 <strong>Free Starter Gear:</strong> You are permanently equipped with a <em>Backpack</em>, <em>Flint & Steel</em>, worn travel clothing, and tiny trinkets. These items do not consume inventory slots.
            </div>

            <div style={{ border: '1px solid #ddd', minHeight: '80px', padding: '10px', marginBottom: '20px', backgroundColor: '#fafafa', borderRadius: '6px' }}>
              {inventory.length === 0 ? <p style={{ color: '#888', fontStyle: 'italic', margin: 0 }}>No additional items equipped.</p> : inventory.map((item, idx) => (
                <ItemCard key={idx} item={item} buttonText="Drop" buttonColor="#ff4d4d" onButtonClick={() => setInventory(prev => prev.filter((_, i) => i !== idx))} />
              ))}
            </div>

            <h3 style={{ margin: '15px 0 10px 0' }}>Equipment Catalog</h3>
            
            {/* SECTION A: WEAPONS CATALOG LIST */}
            <h4 style={{ margin: '15px 0 5px 0', textTransform: 'uppercase', color: '#4a5568', fontSize: '14px', letterSpacing: '0.5px' }}>⚔️ Weapons</h4>
            <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #eee', padding: '10px', marginBottom: '15px', backgroundColor: '#fff', borderRadius: '6px' }}>
              {itemCatalog.filter(item => item.type === 'Weapon').length === 0 ? (
                <p style={{ color: '#888', fontStyle: 'italic', fontSize: '13px' }}>Loading weapons...</p>
              ) : (
                itemCatalog.filter(item => item.type === 'Weapon').map((item, index) => (
                  <ItemCard key={`weapon-${item.id}-${index}`} item={item} buttonText="Equip" buttonColor="#4CAF50" onButtonClick={() => setInventory(prev => [...prev, item])} />
                ))
              )}
            </div>

            {/* SECTION B: ARMOR CATALOG LIST */}
            <h4 style={{ margin: '15px 0 5px 0', textTransform: 'uppercase', color: '#4a5568', fontSize: '14px', letterSpacing: '0.5px' }}>🛡️ Armor & Shields</h4>
            <div style={{ maxHeight: '150px', overflowY: 'auto', border: '1px solid #eee', padding: '10px', marginBottom: '15px', backgroundColor: '#fff', borderRadius: '6px' }}>
              {itemCatalog.filter(item => item.type === 'Armor').length === 0 ? (
                <p style={{ color: '#888', fontStyle: 'italic', fontSize: '13px' }}>Loading armor...</p>
              ) : (
                itemCatalog.filter(item => item.type === 'Armor').map((item, index) => (
                  <ItemCard key={`armor-${item.id}-${index}`} item={item} buttonText="Equip" buttonColor="#4CAF50" onButtonClick={() => setInventory(prev => [...prev, item])} />
                ))
              )}
            </div>

            {/* SECTION C: GENERAL GEAR CATALOG LIST */}
            <h4 style={{ margin: '15px 0 5px 0', textTransform: 'uppercase', color: '#4a5568', fontSize: '14px', letterSpacing: '0.5px' }}>🎒 General Equipment</h4>
            <div style={{ maxHeight: '250px', overflowY: 'auto', border: '1px solid #eee', padding: '10px', backgroundColor: '#fff', borderRadius: '6px' }}>
              {itemCatalog.filter(item => item.type === 'Equipment' || item.type === 'Ammunition').length === 0 ? (
                <p style={{ color: '#888', fontStyle: 'italic', fontSize: '13px' }}>Loading general gear...</p>
              ) : (
                itemCatalog.filter(item => item.type === 'Equipment' || item.type === 'Ammunition').map((item, index) => (
                  <ItemCard key={`gear-${item.id}-${index}`} item={item} buttonText="Equip" buttonColor="#4CAF50" onButtonClick={() => setInventory(prev => [...prev, item])} />
                ))
              )}
            </div>
          </div>

          {/* 10. Save / Load Clipboard System */}
          <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', backgroundColor: '#fafafa' }}>
            <h3 style={{ margin: '0 0 12px 0' }}>Save / Load Tools</h3>
            <button onClick={exportCharacter} style={{ backgroundColor: '#008CBA', color: 'white', border: 'none', borderRadius: '6px', padding: '10px', fontWeight: 'bold', cursor: 'pointer', width: '100%', marginBottom: '10px' }}>📁 Copy Save Code</button>
            <button onClick={() => window.print()} style={{ backgroundColor: '#1A202C', color: 'white', border: 'none', borderRadius: '6px', padding: '10px', fontWeight: 'bold', cursor: 'pointer', width: '100%', marginBottom: '10px' }}>🖨️ Export PDF / Print Character Sheet</button>
            {exportMessage && <p style={{ fontSize: '13px', color: 'green', textAlign: 'center' }}>{exportMessage}</p>}
            <input type="text" placeholder="Paste save code..." value={importString} onChange={e => setImportString(e.target.value)} style={{ padding: '8px', width: '100%', boxSizing: 'border-box', marginBottom: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
            <button onClick={importCharacter} style={{ backgroundColor: '#555', color: 'white', border: 'none', borderRadius: '6px', padding: '8px', cursor: 'pointer', width: '100%' }}>📥 Load Save Code</button>
          </div>

        </div> {/* Closes single column flex stack wrapper */}
      </div> {/* Closes builder-interface-view wrapper */}

      {/* ========================================================= */}
      {/* PRINT/PDF EXPORT LAYOUT BLUEPRINT (HIDDEN BY DEFAULT)     */}
      {/* ========================================================= */}
      <div className="printable-character-sheet">
        {/* Header Block Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '20px' }}>
          <div style={{ flex: 1, borderBottom: '2px solid #000', paddingBottom: '2px' }}>
            <span style={{ fontWeight: 'bold', fontSize: '18px' }}>Name:</span> <span style={{ fontSize: '18px' }}>{characterName}</span>
          </div>
          <div style={{ width: '150px', borderBottom: '2px solid #000', marginLeft: '20px', paddingBottom: '2px' }}>
            <span style={{ fontWeight: 'bold' }}>Silver:</span> <span>{silver}</span>
          </div>
        </div>

        {/* Two-Column Grid Setup mirroring physical handout paper page */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.5fr', gap: '30px' }}>
          
          {/* PRINT LEFT SECTION: STATS & DESCRIPTORS */}
          <div>
            {/* Core Stats Block Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '25px' }}>
              <div style={{ borderBottom: '2px solid #000', paddingBottom: '2px' }}><b>STR:</b> +{stats.strength}</div>
              <div style={{ borderBottom: '2px solid #000', paddingBottom: '2px' }}><b>HP:</b> {hitPoints}</div>
              <div style={{ borderBottom: '2px solid #000', paddingBottom: '2px' }}><b>DEX:</b> +{stats.dexterity}</div>
              <div style={{ borderBottom: '2px solid #000', paddingBottom: '2px' }}><b>AC:</b> {armorClass}</div>
              <div style={{ borderBottom: '2px solid #000', paddingBottom: '2px' }}><b>CON:</b> +{stats.constitution}</div>
              <div style={{ borderBottom: '2px solid #000', paddingBottom: '2px' }}><b>Level:</b> {level}</div>
              <div style={{ borderBottom: '2px solid #000', paddingBottom: '2px' }}><b>WIS:</b> +{stats.wisdom}</div>
              <div style={{ borderBottom: '2px solid #000', paddingBottom: '2px' }}><b>XP:</b> ——</div>
            </div>

            {/* Descriptors List Stack */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 15px', marginBottom: '25px', fontSize: '14px' }}>
              <div><strong>Gender:</strong> {traits.gender}</div>
              <div><strong>Hair:</strong> {traits.hair}</div>
              <div><strong>Looks:</strong> {traits.looks}</div>
              <div><strong>Skin:</strong> {traits.skin}</div>
              <div style={{ gridColumn: 'span 2' }}><strong>Speech:</strong> {traits.speech}</div>
            </div>

            {/* Narratives Card Blocks Section */}
            <div style={{ marginBottom: '25px', fontSize: '14px' }}>
              <div style={{ marginBottom: '10px' }}><strong>Bond:</strong> {bond}</div>
              <div><strong>Background:</strong> {background}</div>
            </div>
          </div>

          {/* PRINT RIGHT SECTION: WEAPONS ROWS & INVENTORY TRACKS */}
          <div>
            <h4 style={{ margin: '0 0 10px 0', borderBottom: '2px solid #000', paddingBottom: '3px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Weapons & Combat Attacks</h4>
            {inventory.filter(i => i.type === 'Weapon').length === 0 ? (
              <div style={{ color: '#666', fontStyle: 'italic', marginBottom: '20px', fontSize: '13px' }}>No weapons equipped. Unarmed Strike: 1d4 damage.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                {inventory.filter(i => i.type === 'Weapon').map((w, idx) => (
                  <div key={idx} style={{ padding: '6px', borderBottom: '1px dashed #000', fontSize: '13px' }}>
                    ⚔️ <strong>{w.name}</strong> — Damage: <span style={{ textDecoration: 'underline' }}>{w.damage || '1d6'}</span> | Tags: <em>{w.details}</em>
                  </div>
                ))}
              </div>
            )}

            {/* Numbered inventory slots */}
            <h4 style={{ margin: '0 0 5px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Inventory (Capacity: {maxCarryingCapacity} Slots)</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', border: '2px solid #000', borderRadius: '4px', fontSize: '13px' }}>
              {Array.from({ length: 18 }).map((_, i) => {
                const item = inventory[i];
                return (
                  <div key={i} style={{ display: 'flex', borderBottom: '1px solid #000', borderRight: i % 2 === 0 ? '1px solid #000' : 'none', padding: '5px', minHeight: '24px', alignItems: 'center', backgroundColor: i >= maxCarryingCapacity ? '#f0f0f0' : 'transparent' }}>
                    <span style={{ fontWeight: 'bold', width: '22px', color: '#666' }}>{i + 1}</span>
                    <span style={{ textDecoration: i >= maxCarryingCapacity ? 'line-through' : 'none', color: i >= maxCarryingCapacity ? '#999' : '#000' }}>
                      {item ? `${item.name} (${item.slots} slot)` : i >= maxCarryingCapacity ? '[Locked Slot]' : ''}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div> {/* Closes print sheet layout split columns wrapper */}
      </div> {/* Closes printable-character-sheet parent container */}
    </div> /* Closes top master parent padding div return loop container */
  );
}

export default App;