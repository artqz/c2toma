import { Npc, NpcDrop } from "../result/types";

export function loadShortNpcs(deps: { npcs: Map<number, Npc> }) {
  const npcMap = new Map<
    number,
    { id: number; name: string; level: number | null; dropList: NpcDrop[] }
  >();
  for (const npc of deps.npcs.values()) {
    npcMap.set(npc.id, {
      id: npc.id,
      name: npc.name.en,
      level: npc.level,
      dropList: npc.dropList,
    });
  }
  return npcMap;
}
