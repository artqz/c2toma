import { loadNpcPosC4 } from "../datapack/c4/npcpos";
import { Npc, NpcSpawn } from "../result/types";

export function loadNpcSeaLevel(deps: { npcs: Map<number, Npc> }) {
  const zPos = getZpos();

  for (const npc of deps.npcs.values()) {
    const seaLevel = zPos.get(npc.npcName);
    if (seaLevel) {
      const npcSpawn: NpcSpawn[] = npc.spawns.map((spawn) => {
        return {
          pos: spawn.pos.map((p) => {
            return { ...p, z: seaLevel };
          }),
        };
      });
      npc.spawns = npcSpawn  
    }
  }
  console.log("NPCs Sea Level added.");
}

function getZpos() {
  const npcposC4 = loadNpcPosC4();
  const terrMap = new Map<string, { shape: Array<[number, number, number]> }>();
  const posZ = new Map<string, number>();
  for (const entry of npcposC4) {
    if (entry.t === "territory") {
      terrMap.set(entry.$[0], {
        shape: entry.$[1].$.map((x) => [x.$[0], x.$[1], x.$[2]]),
      });
    } else if (entry.t === "npcmaker" || entry.t === "npcmaker_ex") {
      const [terrIds, ...spawns] = entry.$;

      for (const spawn of spawns) {
        const npcName = spawn.$[0];
        const pos = spawn.pos;

        if (pos === "anywhere") {
          for (const terrId of terrIds) {
            const terr = terrMap.get(terrId);
            if (terr) {
              terr.shape.map((p) => posZ.set(npcName, p[2]));
            }
          }
        } else if (pos) {
          for (const subPos of pos.$) {
            posZ.set(npcName, subPos.$[2]);
          }
        }
      }
    }
  }
  return posZ;
}
