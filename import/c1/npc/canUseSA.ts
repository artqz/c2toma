import { mobsCanUseSA } from "../../../datapack/sa_mobs";

export function canUseSA(npc: { $: [string, number, string]; level: number }) {
  if (!mobsCanUseSA.has(npc.$[2])) {
    return undefined;
  }

  if (npc.level <= 43) {
    return 2;
  }

  if (npc.level >= 44 && npc.level <= 46) {
    return 3;
  }

  if (npc.level >= 47 && npc.level <= 49) {
    return 4;
  }

  if (npc.level >= 50 && npc.level <= 52) {
    return 5;
  }

  if (npc.level >= 53 && npc.level <= 56) {
    return 6;
  }

  if (npc.level >= 57 && npc.level <= 58) {
    return 7;
  }

  if (npc.level >= 59 && npc.level <= 60) {
    return 8;
  }

  if (npc.level >= 61 && npc.level <= 62) {
    return 9;
  }

  if (npc.level >= 63) {
    return 10;
  }
}
