export interface CharacterStats {
  strength: number;
  wisdom: number;
  dexterity?: number;
}

export interface WeaponItem {
  id: string;
  name: string;
  type: string;
  subtype?: 'melee' | 'bow' | 'mechanical';
  throwable?: boolean;
  damage?: string;
  bonus?: string | number;
  range?: string;
  details?: string;
}

export interface CombatStatsResult {
  attackBonusDisplay: string;
  damageDisplay: string;
}

export const calculateWeaponCombatStats = (
  weapon: WeaponItem,
  stats: CharacterStats,
  isThrownMode: boolean = false
): CombatStatsResult => {
  const baseDamage = weapon.damage || '';

  if (weapon.type !== 'Weapon') {
    return { attackBonusDisplay: '-', damageDisplay: baseDamage };
  }

  let attackBonus = 0;
  let damageBonus = 0;

  const subtype = weapon.subtype || 'melee';
  const numericBonus = typeof weapon.bonus === 'number' ? weapon.bonus : 0;

  // 1. Attack Bonus Calculation
  if (subtype === 'melee' && !isThrownMode) {
    attackBonus = stats.strength;
  } else {
    attackBonus = stats.wisdom;
  }

  if (numericBonus) {
    attackBonus += numericBonus;
  }

  // 2. Damage Bonus Calculation
  if (subtype === 'melee' || subtype === 'bow') {
    damageBonus = stats.strength;
  }
  
  const totalDamageBonus = damageBonus + numericBonus;
  
  const formatMod = (val: number) => (val >= 0 ? `+${val}` : `${val}`);
  const attackBonusDisplay = formatMod(attackBonus);
  
  // FIXED: Fall back to baseDamage and correctly append modifier if present
  let damageDisplay = baseDamage || '—';

  if (baseDamage) {
    if (subtype !== 'mechanical') {
      damageDisplay = totalDamageBonus !== 0 
        ? `${baseDamage} ${formatMod(totalDamageBonus)}` 
        : baseDamage;
    } else if (numericBonus) {
      damageDisplay = `${baseDamage} ${formatMod(numericBonus)}`;
    }
  }

  return {
    attackBonusDisplay,
    damageDisplay,
  };
};