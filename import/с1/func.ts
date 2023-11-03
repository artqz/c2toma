import { CON_MOD } from './mods/conMod';

export function calcHp(baseHP: number, CON: number) {
  return baseHP + (CON_MOD[CON]*baseHP)
}