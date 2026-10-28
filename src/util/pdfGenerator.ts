import { calculateWeaponCombatStats } from './combatCalculations';
import type { WeaponItem, CharacterStats } from './combatCalculations';

export interface CharacterSheetData {
  name: string;
  ancestry: string;
  class: string;
  level: number;
  stats: CharacterStats;
  inventory: Array<WeaponItem & { isEquipped?: boolean }>;
  conditions?: string[];
  fatigue?: number;
  encumbrance?: { current: number; max: number };
}

export const generateCharacterPdf = async (character: CharacterSheetData) => {
  // Filter for equipped weapons (or display all weapons tagged as type 'Weapon')
  const weapons = character.inventory.filter((item) => item.type === 'Weapon');

  // Map weapons to include calculated attack & damage strings for PDF rendering
  const printableWeapons = weapons.map((weapon) => {
    const combatStats = calculateWeaponCombatStats(weapon, character.stats);
    return {
      name: weapon.name,
      subtype: weapon.subtype || 'melee',
      range: weapon.range || 'R0',
      damageDisplay: combatStats.damageDisplay,
      attackBonusDisplay: combatStats.attackBonusDisplay,
      details: weapon.details || '',
    };
  });

  const pdfWeaponRows = printableWeapons.map((w) => [
    w.name,
    w.range,
    w.attackBonusDisplay,
    w.damageDisplay,
    w.details,
  ]);

  console.log('Prepared PDF Weapon Table Data:', pdfWeaponRows);
};