import { useState, useEffect } from 'react';
import { AncestryCard } from './AncestryCard';
import { TalentsCard } from './TalentsCard';
import { SilverAndGearCard } from './SilverAndGearCard';
import type { InventoryItem } from './SilverAndGearCard';
import { ItemShopModal } from './ItemShopModal';
import type { CatalogItem } from './ItemShopModal';
import { MutationsCard } from './MutationsCard';
import { SpellsCard } from './SpellsCard';
import type { Spell, ContainerSlot } from './SpellsCard';
import { CompanionsCard } from './CompanionsCard';
import type { CompanionSlot } from './CompanionsCard';
import { calculateWeaponCombatStats } from './utils/combatCalculations';
import conditionsData from '../public/conditions.json';

// ==========================================
// 1. DATA SCHEMA TYPES & INTERFACES
// ==========================================
interface Abilities {
  strength: number;
  dexterity: number;
  willpower: number;
  wisdom: number;
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
  grantedTalentIds?: string[];
  grantedItems?: Array<{
    id: string;
    name?: string;
    type?: string;
    slots?: number;
    cost_sp?: number;
    cost_cp?: number;
    details?: string;
    quantity: number;
  }>;
  grantedSilver?: number;
  grantedFreeGear?: string;
  grantedCompanions?: Array<{ type: string }>;
  notes?: string;
}

interface NameDatabase {
  names: string[];
  sobriquets: string[];
}

const attributeDescriptions: Record<keyof Abilities, string> = {
  strength: 'Melee attacks, physical saves, & bonus to most weapon damage',
  dexterity: 'delicate tasks, moving silently, saves for poise, speed, or grace, bonus to AC.',
  willpower: 'resolve, stubbornness, mental endurance, & use to wield & resist magic.',
  wisdom: 'ranged attacks, knowledge, insight, saves for intuition, obscure knowledge, or keen eyes.',
};

export function App() {
  // ==========================================
  // 2. APPLICATION REACT STATE STORAGE
  // ==========================================
  const [characterName, setCharacterName] = useState('Glaive Hero');
  const [level, setLevel] = useState(1);
  const [stats, setStats] = useState<Abilities>({ strength: 3, dexterity: 2, willpower: 1, wisdom: 0 });

  // Currency States
  const [silver, setSilver] = useState<number>(50);
  const [copper, setCopper] = useState<number>(0);
  const [hasRolledSilver, setHasRolledSilver] = useState<boolean>(false);

  // Inventory & Shop States
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [freeGearText, setFreeGearText] = useState<string>('Backpack, Flint & Steel, worn travel clothing, tiny trinkets');

  // Modal State
  const [isShopOpen, setIsShopOpen] = useState<boolean>(false);
  const [shopCategory, setShopCategory] = useState<'Weapon' | 'Armor' | 'Equipment' | 'Magic' | null>(null);

  const [importString, setImportString] = useState('');
  const [exportMessage, setExportMessage] = useState('');

  const [traitDatabase, setTraitDatabase] = useState<any>(null);
  const [nameDatabase, setNameDatabase] = useState<NameDatabase | null>(null);


  const [traits, setTraits] = useState<CharacterTraits>({
    gender: 'Masculine',
    hair: 'Bald',
    looks: 'Athletic',
    skin: 'Pale',
    speech: 'Formal',
  });

  const [bond, setBond] = useState<string>('');
  const [bondPcName, setBondPcName] = useState<string>('');

  // Backgrounds
  const [backgroundDatabase, setBackgroundDatabase] = useState<BackgroundEntry[] | null>(null);
  const [background, setBackground] = useState<string>('');
  const [prevBackground, setPrevBackground] = useState<string>(''); 

  // Ancestries & Talents
  const [ancestriesCatalog, setAncestriesCatalog] = useState<any[]>([]);
  const [talentsCatalog, setTalentsCatalog] = useState<any[]>([]);
  const [itemsCatalog, setItemsCatalog] = useState<CatalogItem[]>([]);
  const [selectedAncestryId, setSelectedAncestryId] = useState<string>('demi_ogre');
  const [selectedAncestryTalentId, setSelectedAncestryTalentId] = useState<string>('anc_brick_outhouse');

  const [selectedTalents, setSelectedTalents] = useState<string[]>(['']);
  const [maxTalentSlots, setMaxTalentSlots] = useState<number>(1);

  // Mutations State
  const [mutationsCatalog, setMutationsCatalog] = useState<any[]>([]);
  const [selectedMutations, setSelectedMutations] = useState<string[]>([]);

  // Spells State
  const [spellsCatalog, setSpellsCatalog] = useState<Spell[]>([]);
  const [assignedSpells, setAssignedSpells] = useState<Record<string, number>>({});

  // Companions State
  const [companionNames, setCompanionNames] = useState<Record<string, string>>({});

  // Sync logic: calculates max talent slots based on Ancestry and Level
  useEffect(() => {
    const isHuman = selectedAncestryId === 'human';
    const baseTalents = isHuman ? 2 : 1;
    const calculatedMax = Math.min(6, baseTalents + (level - 1));

    setMaxTalentSlots(calculatedMax);

    setSelectedTalents((prev) => {
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
      fetch('/traits.json').then((res) => res.json()),
      fetch('/backgrounds.json').then((res) => res.json()),
      fetch('/ancestries.json').then((res) => res.json()),
      fetch('/talents.json').then((res) => res.json()),
      fetch('/names.json').then((res) => res.json()),
      fetch('/mutations.json').then((res) => res.json()),
      fetch('/spells.json').then((res) => res.json()),
      fetch('/items.json').then((res) => res.json()),
    ])
      .then(([traitsData, backgroundData, ancestriesData, talentsData, namesData, mutationsData, spellsData, itemsData]) => {
        setTraitDatabase(traitsData);
        setBackgroundDatabase(backgroundData);
        setAncestriesCatalog(ancestriesData);
        setTalentsCatalog(talentsData);
        setNameDatabase(namesData);
        setMutationsCatalog(mutationsData);
        setSpellsCatalog(spellsData);
        setItemsCatalog(itemsData);
      })
      .catch((err) => console.error('Error initializing background data layers:', err));
  }, []);

  // ==========================================
  // 3.1. BACKGROUND AUTO-REWARD HANDLER
  // ==========================================
  useEffect(() => {
    if (!backgroundDatabase) return;

    // 1. CLEAN UP PREVIOUS BACKGROUND REWARDS
    if (prevBackground && prevBackground !== background) {
      const oldBg = backgroundDatabase.find((b) => b.text === prevBackground);
      if (oldBg) {
        // Remove old silver
        if (oldBg.grantedSilver) {
          setSilver((prev) => Math.max(0, prev - oldBg.grantedSilver!));
        }

        // Remove old free gear text
        if (oldBg.grantedFreeGear) {
          setFreeGearText((prev) => {
            const escaped = oldBg.grantedFreeGear!.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(`(,\\s*${escaped}|${escaped},\\s*|${escaped})`, 'g');
            return prev.replace(regex, '').trim();
          });
        }

        // Remove old granted inventory items
        if (oldBg.grantedItems && oldBg.grantedItems.length > 0) {
          setInventory((prevInventory) => {
            let updated = [...prevInventory];
            oldBg.grantedItems!.forEach((grant) => {
              const existingIndex = updated.findIndex((i) => i.id === grant.id);
              if (existingIndex > -1) {
                const currentQty = updated[existingIndex].quantity;
                if (currentQty <= grant.quantity) {
                  updated.splice(existingIndex, 1);
                } else {
                  updated[existingIndex] = {
                    ...updated[existingIndex],
                    quantity: currentQty - grant.quantity,
                  };
                }
              }
            });
            return updated;
          });
        }
      }
    }

    // Update the reference tracker
    setPrevBackground(background);

    if (!background) return;
    const currentBg = backgroundDatabase.find((b) => b.text === background);
    if (!currentBg) return;

    // 2. GRANT NEW BACKGROUND REWARDS
    if (currentBg.grantedSilver) {
      setSilver((prev) => prev + currentBg.grantedSilver!);
    }

    if (currentBg.grantedFreeGear) {
      setFreeGearText((prev) => {
        if (prev.includes(currentBg.grantedFreeGear!)) return prev;
        return prev ? `${prev}, ${currentBg.grantedFreeGear}` : currentBg.grantedFreeGear!;
      });
    }

    if (currentBg.grantedItems && currentBg.grantedItems.length > 0) {
      currentBg.grantedItems.forEach((grant) => {
        const catalogMatch = itemsCatalog.find((item) => item.id === grant.id);

        setInventory((prev) => {
          const existingIndex = prev.findIndex((i) => i.id === grant.id);
          if (existingIndex > -1) {
            const updated = [...prev];
            updated[existingIndex] = {
              ...updated[existingIndex],
              quantity: updated[existingIndex].quantity + grant.quantity,
            };
            return updated;
          }

          if (catalogMatch) {
            return [
              ...prev,
              {
                id: catalogMatch.id,
                name: grant.name || catalogMatch.name,
                type: catalogMatch.type as any,
                slots: grant.slots !== undefined ? grant.slots : catalogMatch.slots,
                cost_sp: catalogMatch.cost_sp,
                cost_cp: catalogMatch.cost_cp,
                details: catalogMatch.details,
                quantity: grant.quantity,
              },
            ];
          }

          if (grant.name && grant.type) {
            return [
              ...prev,
              {
                id: grant.id,
                name: grant.name,
                type: grant.type as any,
                slots: grant.slots ?? 1,
                cost_sp: grant.cost_sp ?? 0,
                cost_cp: grant.cost_cp ?? 0,
                details: grant.details ?? '',
                quantity: grant.quantity,
              },
            ];
          }

          return prev;
        });
      });
    }
  }, [background, backgroundDatabase, itemsCatalog]);

  // ==========================================
  // 3.25. ACTIVE TALENTS AGGREGATOR
  // ==========================================
  const backgroundGrantedTalentIds: string[] = [];
  if (backgroundDatabase && background) {
    const currentBg = backgroundDatabase.find((b) => b.text === background);
    if (currentBg && currentBg.grantedTalentIds) {
      backgroundGrantedTalentIds.push(...currentBg.grantedTalentIds);
    }
  }

  const allActiveTalentIds = [
    ...selectedTalents.filter(Boolean),
    ...backgroundGrantedTalentIds,
  ];

  // ==========================================
  // 3.5. TALENT EFFECTS HELPER
  // ==========================================
  const getEffectSum = (targetName: string) => {
    let total = 0;

    allActiveTalentIds.forEach((talentId) => {
      const talentObj = talentsCatalog.find((t) => t.id === talentId);
      if (talentObj && talentObj.effects) {
        talentObj.effects.forEach((eff: any) => {
          if (eff.target === targetName && eff.mode === 'add') {
            total += eff.value;
          }
        });
      }
    });

    return total;
  };

  const hpPerLevelBonus = getEffectSum('hp_per_level_bonus');
  const extraItemSlotsBonus = getEffectSum('extra_item_slots');

  // ==========================================
  // 4. CONTAINER, SPELLBOOK & DUAL-STATE WEAPON SYNC
  // ==========================================
  const grantedContainers: ContainerSlot[] = [];
  allActiveTalentIds.forEach((talentId, talentIndex) => {
    const talentObj = talentsCatalog.find((t) => t.id === talentId);
    if (talentObj && talentObj.containerGrant) {
      const grant = talentObj.containerGrant;
      for (let c = 0; c < grant.count; c++) {
        const isWeaponContainer = (talentObj as any).weaponStats !== undefined;
        grantedContainers.push({
          slotId: `container_${talentIndex}_${c}`,
          sourceTalentName: talentObj.name,
          containerType: grant.type,
          itemSlots: grant.itemSlots,
          weaponProfile: isWeaponContainer ? (talentObj as any).weaponStats : undefined,
        } as any);
      }
    }
  });

  useEffect(() => {
    setInventory((prev) => {
      const nonContainerItems = prev.filter((item) => !item.id.startsWith('spell_container_'));
      const containerItems: InventoryItem[] = [];

      grantedContainers.forEach((container: any) => {
        if (container.itemSlots === 0) return;

        const assignedSpellId = assignedSpells[container.slotId];
        const spell = spellsCatalog.find((s) => s.id === assignedSpellId);
        const spellName = spell ? spell.name : 'Empty';
        
        const itemName = container.weaponProfile 
          ? `${spellName !== 'Empty' ? `${spellName} ` : ''}${container.weaponProfile.name}`
          : `${spellName} ${container.containerType.toLowerCase()}`;

        containerItems.push({
          id: `spell_container_${container.slotId}`,
          name: itemName,
          type: container.weaponProfile ? 'Weapon' : 'Equipment',
          slots: container.itemSlots,
          cost_sp: container.weaponProfile ? container.weaponProfile.cost_sp : 0,
          cost_cp: 0,
          details: spell ? spell.description : `Houses a ${container.containerType.toLowerCase()} spell. ${container.weaponProfile ? 'Melee weapon (1d8 damage).' : ''}`,
          quantity: 1,
          damage: container.weaponProfile ? container.weaponProfile.damage : undefined,
          range: container.weaponProfile ? container.weaponProfile.range : undefined,
          bonus: container.weaponProfile ? container.weaponProfile.bonus : undefined,
        });
      });

      return [...nonContainerItems, ...containerItems];
    });
  }, [selectedTalents, background, assignedSpells, spellsCatalog, talentsCatalog]);

  // ==========================================
  // 4.6. GENERIC HIDDEN ITEM / WEAPON SYNC
  // ==========================================
  useEffect(() => {
    setInventory((prev) => {
      const filteredInventory = prev.filter((item) => !item.id.startsWith('talent_hidden_'));
      const dynamicHiddenGrants: InventoryItem[] = [];

      allActiveTalentIds.forEach((talentId, index) => {
        const talentObj = talentsCatalog.find((t) => t.id === talentId);
        if (talentObj && (talentObj as any).hiddenItemGrant) {
          const grant = (talentObj as any).hiddenItemGrant;
          dynamicHiddenGrants.push({
            id: `talent_hidden_${index}_${talentId}`,
            name: grant.name,
            type: grant.type || 'Equipment',
            slots: grant.slots ?? 0,
            cost_sp: grant.cost_sp ?? 0,
            cost_cp: grant.cost_cp ?? 0,
            details: grant.details || '',
            quantity: 1,
            damage: grant.damage,
            range: grant.range,
          });
        }
      });

      return [...filteredInventory, ...dynamicHiddenGrants];
    });
  }, [selectedTalents, background, talentsCatalog]);

  // ==========================================
  // 4.5. COMPANIONS SYNC
  // ==========================================
  const grantedCompanions: CompanionSlot[] = [];
  allActiveTalentIds.forEach((talentId, index) => {
    const talentObj = talentsCatalog.find((t) => t.id === talentId);
    if (talentObj && (talentObj as any).companionGrant) {
      const grant = (talentObj as any).companionGrant;
      grantedCompanions.push({
        slotId: `companion_${index}_${talentObj.id}`,
        sourceTalentName: talentObj.name,
        companionType: grant.type,
      });
    }
  });

  if (backgroundDatabase && background) {
    const currentBg = backgroundDatabase.find((b) => b.text === background);
    if (currentBg && currentBg.grantedCompanions) {
      currentBg.grantedCompanions.forEach((grant, idx) => {
        grantedCompanions.push({
          slotId: `bg_companion_${idx}`,
          sourceTalentName: currentBg.name,
          companionType: grant.type,
        });
      });
    }
  }

  // ==========================================
  // 5. SYNCHRONOUS REAL-TIME EQUATIONS
  // ==========================================
  const maxStatBonus = Math.min(5, level + 2);
  const dynamicAttributeChoices = Array.from({ length: maxStatBonus + 1 }, (_, i) => maxStatBonus - i);

  const totalUsedSlots = inventory.reduce((total, item) => total + item.slots * item.quantity, 0);
  const maxCarryingCapacity = 10 + stats.strength + extraItemSlotsBonus;
  const hitPoints = 10 + stats.strength + (level - 1) * (5 + hpPerLevelBonus);

  const armorBonus = inventory
    .filter((item) => item.type === 'Armor')
    .reduce((sum, item) => sum + item.quantity * 2, 0);
  const armorClass = 10 + stats.dexterity + armorBonus;

  const expectedTotalPoints = 6 + (level - 1);
  const spentPoints = stats.strength + stats.dexterity + stats.willpower + stats.wisdom;
  const unspentPoints = expectedTotalPoints - spentPoints;

  // Flattened bonds array for dropdown selection
  const allAvailableBonds = traitDatabase && traitDatabase.bonds 
    ? traitDatabase.bonds.flat() 
    : [];

  // ==========================================
  // 6. HELPER ACTION FUNCTIONS
  // ==========================================
  const handleStatChange = (statName: keyof Abilities, value: number) => {
    setStats((prev) => ({ ...prev, [statName]: value }));
  };

  const handleAssignSpell = (slotId: string, spellId: number) => {
    setAssignedSpells((prev) => ({ ...prev, [slotId]: spellId }));
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
    setHasRolledSilver(true);
  };

  const handleBuyItem = (catalogItem: CatalogItem) => {
    const totalCopperWealth = silver * 10 + copper;
    const itemCostInCopper = catalogItem.cost_sp * 10 + catalogItem.cost_cp;

    if (totalCopperWealth < itemCostInCopper) return;

    let newCopper = copper - catalogItem.cost_cp;
    let newSilver = silver - catalogItem.cost_sp;
    if (newCopper < 0) {
      newSilver -= 1;
      newCopper += 10;
    }

    setSilver(Math.max(0, newSilver));
    setCopper(Math.max(0, newCopper));

    setInventory((prev) => {
      const existingIndex = prev.findIndex((i) => i.id === catalogItem.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + 1,
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            id: catalogItem.id,
            name: catalogItem.name,
            type: catalogItem.type,
            slots: catalogItem.slots,
            cost_sp: catalogItem.cost_sp,
            cost_cp: catalogItem.cost_cp,
            details: catalogItem.details,
            quantity: 1,
            // PRESERVE WEAPON PROPERTIES FROM CATALOG:
            damage: (catalogItem as any).damage,
            subtype: (catalogItem as any).subtype,
            range: (catalogItem as any).range,
            bonus: (catalogItem as any).bonus,
          },
        ];
      }
    });
  };

  const handleSellItem = (itemId: string) => {
    const itemToSell = inventory.find((i) => i.id === itemId);
    if (!itemToSell) return;

    setSilver((prev) => prev + itemToSell.cost_sp);
    setCopper((prev) => prev + itemToSell.cost_cp);

    setInventory((prev) => {
      const existing = prev.find((i) => i.id === itemId);
      if (!existing) return prev;

      if (existing.quantity > 1) {
        return prev.map((i) => (i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i));
      } else {
        return prev.filter((i) => i.id !== itemId);
      }
    });
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
      wisdom: values[3],
    });
  };

  const rollRandomName = () => {
    if (!nameDatabase) return;
    const { names, sobriquets } = nameDatabase;
    const getRandom = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
    const useSobriquet = Math.random() < 0.5;

    if (useSobriquet) {
      setCharacterName(`${getRandom(names)} the ${getRandom(sobriquets)}`);
    } else {
      let first = getRandom(names);
      let last = getRandom(names);
      while (last === first) last = getRandom(names);
      setCharacterName(`${first} ${last}`);
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
      speech: traitDatabase.speech ? traitDatabase.speech[rollDice(20)] : 'Formal',
    });
  };

  const rollCharacterBond = () => {
    if (!traitDatabase || !traitDatabase.bonds) return;
    const row = traitDatabase.bonds[Math.floor(Math.random() * traitDatabase.bonds.length)];
    const randomBond = row[Math.floor(Math.random() * row.length)];
    setBond(randomBond);
  };

  const rollCharacterBackground = () => {
    if (!backgroundDatabase) return;
    const roll = Math.floor(Math.random() * 100) + 1;
    const match = backgroundDatabase.find((b) => roll >= b.min && roll <= b.max);
    if (match) setBackground(match.text);
  };

  const handleAncestryChange = (ancestryId: string) => {
    setSelectedAncestryId(ancestryId);
    const foundAncestry = ancestriesCatalog.find((a) => a.id === ancestryId);
    if (foundAncestry && foundAncestry.fixedTalentIds?.length > 0) {
      setSelectedAncestryTalentId(foundAncestry.fixedTalentIds[0]);
    } else {
      setSelectedAncestryTalentId('');
    }
  };

  const handleMutationsCountChange = (count: number) => {
    setSelectedMutations((prev) => {
      if (prev.length < count) {
        return [...prev, ...Array(count - prev.length).fill('')];
      } else {
        return prev.slice(0, count);
      }
    });
  };

  const handleMutationChange = (index: number, mutationId: string) => {
    setSelectedMutations((prev) => {
      const next = [...prev];
      next[index] = mutationId;
      return next;
    });
  };

  const getCharacterSaveObject = () => ({
    name: characterName,
    level,
    stats,
    silver,
    copper,
    traits,
    bond,
    bondPcName,
    background,
    selectedAncestryId,
    selectedAncestryTalentId,
    selectedTalents,
    selectedMutations,
    assignedSpells,
    freeGearText,
    inventory,
  });

  const exportCharacterClipboard = () => {
    const saveJson = JSON.stringify(getCharacterSaveObject(), null, 2);
    navigator.clipboard.writeText(saveJson);
    setExportMessage('Character JSON copied to clipboard!');
    setTimeout(() => setExportMessage(''), 3000);
  };

  const downloadCharacterFile = () => {
    const saveJson = JSON.stringify(getCharacterSaveObject(), null, 2);
    const blob = new Blob([saveJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const safeName = (characterName || 'Character').replace(/[^a-z0-9]/gi, '_').toLowerCase();
    link.download = `${safeName}_level_${level}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setExportMessage('Character JSON file downloaded!');
    setTimeout(() => setExportMessage(''), 3000);
  };

  const importCharacter = () => {
    try {
      const decoded = JSON.parse(importString.trim());
      setCharacterName(decoded.name || 'Glaive Hero');
      setLevel(decoded.level || 1);
      setStats(decoded.stats || { strength: 3, dexterity: 2, willpower: 1, wisdom: 0 });
      setSilver(decoded.silver ?? 50);
      setCopper(decoded.copper ?? 0);
      setHasRolledSilver(true);
      setTraits(decoded.traits || traits);
      setBond(decoded.bond || '');
      setBondPcName(decoded.bondPcName || '');
      setBackground(decoded.background || '');
      setFreeGearText(decoded.freeGearText || freeGearText);

      if (decoded.selectedAncestryId) setSelectedAncestryId(decoded.selectedAncestryId);
      if (decoded.selectedAncestryTalentId) setSelectedAncestryTalentId(decoded.selectedAncestryTalentId);
      if (decoded.selectedTalents) setSelectedTalents(decoded.selectedTalents);
      if (decoded.selectedMutations) setSelectedMutations(decoded.selectedMutations);
      if (decoded.assignedSpells) setAssignedSpells(decoded.assignedSpells);
      if (decoded.inventory) setInventory(decoded.inventory);

      setImportString('');
      setExportMessage('Character successfully loaded!');
      setTimeout(() => setExportMessage(''), 3000);
    } catch {
      alert('Error loading character code. Ensure it is valid JSON.');
    }
  };

  const activeSpellsList = grantedContainers
    .map((container) => {
      const spellId = assignedSpells[container.slotId];
      return spellsCatalog.find((s) => s.id === spellId);
    })
    .filter(Boolean) as Spell[];

  // Aggregate Ancestry Talent + Selected Heroic Talents + Background-granted Talents
  const ancestryTalent = talentsCatalog.find((t) => t.id === selectedAncestryTalentId);
  const activeTalentObjects = [
    ancestryTalent,
    ...allActiveTalentIds
      .map((tId) => talentsCatalog.find((t) => t.id === tId))
      .filter(Boolean),
  ].filter((talent, index, self) => 
    talent && self.findIndex((t) => t?.id === talent.id) === index
  );

  // ==========================================
  // 7. RENDER INTERFACE STRUCTURAL LAYOUT
  // ==========================================
  return (
    <div className="app-container">
      <div className="builder-interface-view">
        <h1 className="main-title">Glaive v3 Character Builder</h1>

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
                <button type="button" onClick={rollRandomName} className="btn-primary full-width">
                  🎲 Roll Name
                </button>
              </div>
              <div className="form-group flex-1">
                <label className="field-label">PC Level</label>
                <select value={level} onChange={(e) => setLevel(Number(e.target.value))}>
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
            <p className="instruction-text">Select or roll your hero's origins and formative experiences:</p>
            <select
              value={background}
              onChange={(e) => setBackground(e.target.value)}
              className="form-select-spacing"
            >
              <option value="">-- Select a Background --</option>
              {backgroundDatabase &&
                backgroundDatabase.map((b, idx) => (
                  <option key={idx} value={b.text}>
                    {b.name}
                  </option>
                ))}
            </select>
            {background && <div className="description-box">{background}</div>}
            <button type="button" onClick={rollCharacterBackground} className="btn-primary full-width">
              🎲 Roll Character Background
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
              <p className="instruction-text">At Level 1, distribute starting bonuses:</p>
              <div className="bonus-badge-group">
                <span className="bonus-badge">+3</span>
                <span className="bonus-badge">+2</span>
                <span className="bonus-badge">+1</span>
                <span className="bonus-badge">+0</span>
              </div>
            </div>

            <div className="attributes-grid">
              {(Object.keys(stats) as Array<keyof Abilities>).map((s) => (
                <div key={s} className="attribute-field">
                  <label className="attribute-label">{s}</label>
                  <span className="attribute-desc">{attributeDescriptions[s]}</span>
                  <select value={stats[s]} onChange={(e) => handleStatChange(s, Number(e.target.value))}>
                    {dynamicAttributeChoices.map((v) => (
                      <option key={v} value={v}>
                        +{v}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
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
              setSelectedTalents((prev) => {
                const next = [...prev];
                next[index] = val;
                return next;
              });
            }}
            backgroundGrantedTalentIds={backgroundGrantedTalentIds}
          />

          {/* 5. Spells & Magic Containers Module */}
          <SpellsCard
            spellsCatalog={spellsCatalog}
            grantedContainers={grantedContainers}
            assignedSpells={assignedSpells}
            onAssignSpell={handleAssignSpell}
            willpowerBonus={stats.willpower}
          />

          {/* 6. Traits Card */}
          <div className="card-panel">
            <h3 className="panel-heading">Traits</h3>
            <div className="traits-grid">
              {(Object.keys(traits) as Array<keyof CharacterTraits>).map((t) => (
                <div key={t} className="form-group">
                  <label className="field-label uppercase-label">{t}</label>
                  <select
                    value={traits[t]}
                    onChange={(e) => setTraits((prev) => ({ ...prev, [t]: e.target.value }))}
                    className="form-select-spacing"
                  >
                    {traitDatabase && traitDatabase[t] ? (
                      traitDatabase[t].map((val: string, idx: number) => (
                        <option key={idx} value={val}>
                          {val}
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

          {/* 7. Character Bond Card */}
          <div className="card-panel">
            <h3 className="panel-heading">Bond</h3>
            <p className="instruction-text">Relationship with PC to your left:</p>
            <div className="bond-input-row mb-2">
              <input
                type="text"
                placeholder="PC Name"
                value={bondPcName}
                onChange={(e) => setBondPcName(e.target.value)}
                className="bond-pc-input"
              />
              <select
                value={bond}
                onChange={(e) => setBond(e.target.value)}
                className="bond-select-input"
              >
                <option value="">-- Select a Bond --</option>
                {allAvailableBonds.map((bText: string, idx: number) => (
                  <option key={idx} value={bText}>
                    {bText}
                  </option>
                ))}
              </select>
            </div>
            <button type="button" onClick={rollCharacterBond} className="btn-primary full-width">
              🎲 Roll Character Bond
            </button>
          </div>

          {/* 8. Silver & Gear Card */}
          <SilverAndGearCard
            silver={silver}
            copper={copper}
            onUpdateSilver={setSilver}
            onUpdateCopper={setCopper}
            hasRolledSilver={hasRolledSilver}
            onRollStartingSilver={rollStartingSilver}
            freeGearText={freeGearText}
            onUpdateFreeGear={setFreeGearText}
            inventory={inventory}
            maxSlots={maxCarryingCapacity}
            onOpenShop={(category) => {
              setShopCategory(category);
              setIsShopOpen(true);
            }}
            onSellItem={handleSellItem}
          />

          {/* 8b. Companions Card */}
          <CompanionsCard
            grantedCompanions={grantedCompanions}
            companionNames={companionNames}
            onUpdateCompanionName={(slotId: string, name: string) => {
              setCompanionNames((prev) => ({ ...prev, [slotId]: name }));
            }}
          />

          {/* 9. Mutations Card */}
          <MutationsCard
            mutationsCatalog={mutationsCatalog}
            selectedMutations={selectedMutations}
            onMutationsCountChange={handleMutationsCountChange}
            onMutationChange={handleMutationChange}
          />

          {/* 10. Character Dynamic Status Dashboard Card */}
          <div className={`card-panel status-card ${totalUsedSlots > maxCarryingCapacity ? 'overencumbered' : ''}`}>
            <h3 className="panel-heading">Character Status</h3>
            <div className="status-grid">
              <div>
                <strong className="vital-label">Hit Points:</strong> {hitPoints} HP
              </div>
              <div>
                <strong className="vital-label">Armor Class:</strong> {armorClass} AC
              </div>
            </div>
            <p className="burden-text">
              <strong>Burden:</strong>{' '}
              <span className={`burden-badge ${totalUsedSlots > maxCarryingCapacity ? 'exceeded' : 'normal'}`}>
                {totalUsedSlots} / {maxCarryingCapacity} Slots
              </span>
            </p>
          </div>

          {/* 11. Save / Load / Export Tools */}
          <div className="card-panel save-load-panel">
            <h3 className="panel-heading">Save / Load Tools</h3>
            <button type="button" onClick={exportCharacterClipboard} className="btn-primary full-width mb-2">
              📋 Copy JSON to Clipboard
            </button>
            <button type="button" onClick={downloadCharacterFile} className="btn-primary full-width mb-2">
              💾 Download Character (.json)
            </button>
            <button 
              type="button" 
              onClick={() => window.print()} 
              className="btn-primary full-width mb-2"
            >
              🖨️ Export PDF / Print Character Sheet
            </button>
            {exportMessage && <p className="success-message">{exportMessage}</p>}
            <input
              type="text"
              placeholder="Paste raw JSON save code..."
              value={importString}
              onChange={(e) => setImportString(e.target.value)}
              className="import-input mb-2"
            />
            <button type="button" onClick={importCharacter} className="btn-primary full-width">
              📥 Load Save Code
            </button>
          </div>
        </div>
      </div>

      {/* Reusable Item Shop Modal */}
      <ItemShopModal
        isOpen={isShopOpen}
        categoryType={shopCategory}
        onClose={() => setIsShopOpen(false)}
        silver={silver}
        copper={copper}
        usedSlots={totalUsedSlots}
        maxSlots={maxCarryingCapacity}
        inventory={inventory}
        onBuyItem={handleBuyItem}
        onSellItem={handleSellItem}
      />

      {/* PRINT/PDF EXPORT LAYOUT BLUEPRINT */}
      <div className="printable-character-sheet">
        {/* ==================== PAGE 1 (CORE & COMBAT) ==================== */}
        <div className="print-header-row">
          <div className="print-header-field flex-1">
            <span className="print-label">Name:</span> <span>{characterName}</span>
          </div>
          <div className="print-header-field print-silver-width">
            <span className="print-label">Silver:</span>{' '}
            <span>
              <span className="print-coin-write-box">{silver}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> sp{' '}
              <span className="print-coin-write-box">{copper}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span> cp
            </span>
          </div>
        </div>

        <div className="print-grid">
          {/* PAGE 1 LEFT COLUMN */}
          <div>
            <div className="print-stats-grid">
              <div className="print-stat-item print-attribute-box">
                <b className="print-stat-label-font">STR:</b> <span className="print-stat-value-font">+{stats.strength}</span>
              </div>
              <div className="print-stat-item print-vital-box">
                <b className="print-stat-label-font">HP:</b> <span className="print-stat-value-font">{hitPoints}</span>
              </div>
              <div className="print-stat-item print-attribute-box">
                <b className="print-stat-label-font">DEX:</b> <span className="print-stat-value-font">+{stats.dexterity}</span>
              </div>
              <div className="print-stat-item print-vital-box">
                <b className="print-stat-label-font">AC:</b> <span className="print-stat-value-font">{armorClass}</span>
              </div>
              <div className="print-stat-item print-attribute-box">
                <b className="print-stat-label-font">WIL:</b> <span className="print-stat-value-font">+{stats.willpower}</span>
              </div>
              <div className="print-stat-item print-vital-box">
                <b className="print-stat-label-font">Level:</b> <span className="print-stat-value-font">{level}</span>
              </div>
              <div className="print-stat-item print-attribute-box">
                <b className="print-stat-label-font">WIS:</b> <span className="print-stat-value-font">+{stats.wisdom}</span>
              </div>
              <div className="print-stat-item print-vital-box">
                <b className="print-stat-label-font">XP:</b> <span className="print-stat-value-font">——</span>
              </div>
            </div>

            <div className="print-traits-grid">
              <div><strong>Gender:</strong> {traits.gender}</div>
              <div><strong>Hair:</strong> {traits.hair}</div>
              <div><strong>Looks:</strong> {traits.looks}</div>
              <div><strong>Skin:</strong> {traits.skin}</div>
              <div className="span-2"><strong>Speech:</strong> {traits.speech}</div>
            </div>

            <div className="print-narrative-block">
              <div className="mb-2">
                <strong>Bond {bondPcName ? `with ${bondPcName}` : ''}:</strong> {bond}
              </div>
              <div>
                <strong>Background:</strong> {background}
              </div>
            </div>

            {/* MECHANICAL TRACKERS */}
            <div className="print-trackers-section" style={{ marginTop: '12px' }}>
              <h4 className="print-section-title">Conditions</h4>
              <div className="print-conditions-grid">
                {conditionsData.map((cond) => (
                  <label key={cond.name} className="print-condition-item" title={cond.effects}>
                    <input type="checkbox" className="print-condition-checkbox" /> {cond.name}
                  </label>
                ))}
              </div>

              <h4 className="print-section-title">Fatigue & Status</h4>
              <div style={{ display: 'flex', gap: '12px', marginTop: '6px' }}>
                <div style={{ flex: 1, border: '1px solid #000', padding: '6px', fontSize: '12px' }}>
                  <strong>Fatigue Level:</strong> <span style={{ display: 'inline-block', width: '30px', borderBottom: '1px solid #000', textAlign: 'center' }}></span>
                </div>
                <div style={{ flex: 1, border: '1px solid #000', padding: '6px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <input type="checkbox" style={{ width: '13px', height: '13px', margin: 0 }} />
                  <strong>Encumbered</strong>
                </div>
              </div>
            </div>
          </div>

          {/* PAGE 1 RIGHT COLUMN */}
          <div>
            <h4 className="print-section-title">Weapons & Combat Attacks</h4>
            <div className="print-weapons-list">
              {/* EQUIPPED WEAPONS */}
              {inventory.filter((i) => i.type === 'Weapon').map((w, idx) => {
                const combatStats = calculateWeaponCombatStats(w, {
                  strength: stats.strength,
                  wisdom: stats.wisdom,
                  dexterity: stats.dexterity,
                });

                return (
                  <div key={idx} className="print-weapon-card">
                    <div className="print-weapon-top">
                      <strong>Weapon:</strong> <span>{w.name} {w.quantity > 1 ? `(${w.quantity})` : ''}</span>
                    </div>
                    <div className="print-weapon-stats">
                      <div>
                        <div>{combatStats.attackBonusDisplay}</div>
                        <div className="print-weapon-stat-label">Attack</div>
                      </div>
                      <div>
                        <div>{combatStats.damageDisplay}</div>
                        <div className="print-weapon-stat-label">Damage</div>
                      </div>
                      <div>
                        <div>{w.range || 'R0'}</div>
                        <div className="print-weapon-stat-label">Range</div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* 2 PERMANENT BLANK WRITE-IN WEAPON SLOTS */}
              {Array.from({ length: 2 }).map((_, idx) => (
                <div key={`blank-weapon-${idx}`} className="print-weapon-card blank-weapon-slot">
                  <div className="print-weapon-top">
                    <strong>Weapon:</strong> <span className="print-writein-line"></span>
                  </div>
                  <div className="print-weapon-stats">
                    <div>
                      <div className="print-writein-box"></div>
                      <div className="print-weapon-stat-label">Attack</div>
                    </div>
                    <div>
                      <div className="print-writein-box"></div>
                      <div className="print-weapon-stat-label">Damage</div>
                    </div>
                    <div>
                      <div className="print-writein-box"></div>
                      <div className="print-weapon-stat-label">Range</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* TALENTS & SPECIAL ABILITIES */}
            <h4 className="print-section-title">Talents & Special Abilities</h4>
            {activeTalentObjects.length === 0 ? (
              <div className="print-no-weapons">No talents selected.</div>
            ) : (
              <div className="print-talents-list">
                {activeTalentObjects.map((talent, idx) => (
                  <div key={idx} className="print-talent-row">
                    <strong>{talent.name}:</strong> {talent.description || talent.details}
                  </div>
                ))}
              </div>
            )}

            {/* WRITE-IN TALENT SLOTS (1 TO 9) */}
            <div className="print-talent-writein-grid">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="print-talent-writein-slot">
                  <span className="print-slot-number">{i + 1}</span>
                  <span className="print-writein-line"></span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ==================== PAGE 2 (LOGISTICS & INVENTORY) ==================== */}
        <div className="print-page-break">
          <div className="print-grid">
            
            {/* PAGE 2 LEFT COLUMN: SPELLS & MAGIC */}
            <div>
              <h4 className="print-section-title">Spells & Magic Items</h4>
              
              {/* 1. RENDER ACTIVE BOUND SPELLS FIRST */}
            {activeSpellsList.length === 0 ? (
              <div className="print-no-spells">No spells bound.</div>
            ) : (
              <div className="print-spells-list">
                {activeSpellsList.map((spell, idx) => (
                  <div key={idx} className="print-spell-row">
                    ✨ <strong>{spell.name}</strong> {spell.range ? `(${spell.range})` : ''}: {spell.description}
                  </div>
                ))}
              </div>
            )}

              {/* 2. RENDER 10 BLANK WRITE-IN SPELL SLOTS BELOW */}
              <div className="print-spell-writein-grid">
                {Array.from({ length: 11 }).map((_, i) => (
                  <div key={i} className="print-spell-writein-slot">
                    <span className="print-slot-number">{i + 1}</span>
                    <span className="print-writein-line"></span>
                  </div>
                ))}
              </div>
            </div>

            {/* PAGE 2 RIGHT COLUMN: INVENTORY */}
            <div>
              <h4 className="print-section-title">Inventory (Capacity: {maxCarryingCapacity} Slots)</h4>
              
              <div className="print-freegear-block">
                <strong>Starting Gear:</strong> {freeGearText}
              </div>

              <div className="print-inventory-grid">
  {Array.from({ length: 18 }).map((_, i) => {
    const slotNumber = i + 1;
    const item = inventory[i];
    const isLocked = slotNumber > maxCarryingCapacity;

    return (
      <div
        key={i}
        className={`print-inventory-slot ${i % 2 === 0 ? 'border-right' : ''} ${
          isLocked ? 'is-locked-slot' : ''
        }`}
      >
        <span className="print-slot-number">{slotNumber}</span>
        <span>
          {item ? `${item.name} (x${item.quantity})` : ''}
        </span>
      </div>
    );
  })}
</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;