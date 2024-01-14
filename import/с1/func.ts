import { CON_MOD } from "./mods/conMod";
import { INT_MOD } from "./mods/intMod";
import { LVL_MOD } from "./mods/lvlMod";
import { MEN_MOD } from "./mods/menMod";
import { STR_MOD } from "./mods/strMod";

export function calcHP(baseHP: number, CON: number) {
  return baseHP * CON_MOD[CON];
}

export function calcHPRegen(baseMP: number, CON: number, LVL: number) {
  return baseMP * LVL_MOD[LVL] * CON_MOD[CON];
}

export function calcMP(baseMP: number, MEN: number) {
  return baseMP * MEN_MOD[MEN];
}

export function calcMPRegen(baseMP: number, MEN: number, LVL: number) {
  return baseMP * LVL_MOD[LVL] * MEN_MOD[MEN];
}

export function calcPATK(basePhysicalAttack: number, STR: number, LVL: number) {
  return basePhysicalAttack * LVL_MOD[LVL] * STR_MOD[STR];
}

export function calcMATK(baseMagicAttack: number, INT: number, LVL: number) {
  return baseMagicAttack * LVL_MOD[LVL] * INT_MOD[INT];
}

export function calcPDEF(baseDefend: number, LVL: number) {
  return (4 + baseDefend) * LVL_MOD[LVL];
}

export function calcMDEF(baseMagicDefend: number, MEN: number, LVL: number) {
  return baseMagicDefend * LVL_MOD[LVL] * MEN_MOD[MEN];
}
