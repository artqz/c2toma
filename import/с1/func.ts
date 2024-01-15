import { CON_MOD } from "./mods/conMod";
import { DEX_MOD } from './mods/dexMod';
import { INT_MOD } from "./mods/intMod";
import { LEVEL_BONUS } from './mods/lvlBonus';
import { LVL_MOD } from "./mods/lvlMod";
import { MEN_MOD } from "./mods/menMod";
import { STR_MOD } from "./mods/strMod";
import { WEAPON_CRIT } from './mods/weaponCrit';
import { WIT_MOD } from './mods/witMod';

export function calcHP(baseHP: number, CON: number) {
  return round(baseHP * CON_MOD[CON]);
}

export function calcHPRegen(baseMP: number, CON: number, LVL: number) {
  return round(baseMP * LVL_MOD[LVL] * CON_MOD[CON]);
}

export function calcMP(baseMP: number, MEN: number) {
  return round(baseMP * MEN_MOD[MEN]);
}

export function calcMPRegen(baseMP: number, MEN: number, LVL: number) {
  return round(baseMP * LVL_MOD[LVL] * MEN_MOD[MEN]);
}

export function calcPAtk(basePhysicalAttack: number, STR: number, LVL: number) {
  return round(basePhysicalAttack * LVL_MOD[LVL] * STR_MOD[STR]);
}

export function calcMATK(baseMagicAttack: number, INT: number, LVL: number) {
  return round(baseMagicAttack * LVL_MOD[LVL]^2 * INT_MOD[INT]^2);
}

export function calcPDEF(baseDefend: number, LVL: number) {
  return round((4 + baseDefend) * LVL_MOD[LVL]);
}

export function calcMDEF(baseMagicDefend: number, MEN: number, LVL: number) {
  return round(baseMagicDefend * LVL_MOD[LVL] * MEN_MOD[MEN]);
}

export function calcMSpd(WIT: number, LVL: number) {
  return 333
  return round(333 * LVL_MOD[LVL] * WIT_MOD[WIT]);
}

export function calcPSpd(baseAttackSpeed: number, DEX: number) {
  return baseAttackSpeed
  return round(baseAttackSpeed * DEX_MOD[DEX]);
}

export function calcPCritical(base_critical: number, DEX: number){
  return round(base_critical * DEX_MOD[DEX] * 10)
}

export function calcAccuracy (DEX: number, LVL: number) {
  return round(Math.sqrt(DEX) * 6 + LEVEL_BONUS(LVL))
}

export function calcEvasion (DEX: number, LVL: number) {
  return round(Math.sqrt(DEX) * 6 + LEVEL_BONUS(LVL)) 
}

function round (int: number) {
  return Math.round(int) 
}