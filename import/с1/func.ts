import { CON_MOD } from './mods/conMod';
import { LVL_MOD } from './mods/lvlMod';
import { MEN_MOD } from './mods/menMod';

export function calcHP(baseHP: number, CON: number) {
  return baseHP * CON_MOD[CON]
}

export function calcHPRegen(baseMP: number, CON: number, LVL: number) {
  return baseMP * LVL_MOD[LVL] * CON_MOD[CON]
}

export function calcMP(baseMP: number, MEN: number) {
  return baseMP * MEN_MOD[MEN]
}

export function calcMPRegen(baseMP: number, MEN: number, LVL: number) {
  return baseMP * LVL_MOD[LVL] * MEN_MOD[MEN]
}