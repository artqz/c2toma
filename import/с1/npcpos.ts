import { loadNpcPosC1 } from '../../datapack/c1/npcpos';
import { Npc, NpcSpawn } from '../../result/types';
import { Chronicle } from '../types';

export function loadNpcPos(deps: {
  chronicle: Chronicle;
  npcs: Map<number, Npc>;
}) {
  loadNpcPosData(deps);
  console.log("NPCs position loaded.");
}

function loadNpcPosData(deps: {
  chronicle: Chronicle;
  npcs: Map<number, Npc>;
}) {
  let npcPosData = [];
  switch (deps.chronicle) {
    case "c1":
      npcPosData = loadNpcPosC1();
      break;
    default:
      npcPosData = loadNpcPosC1();
      break;
  }
  const npcsByName = new Map(Array.from(deps.npcs.values()).map(n => [n.npcName, n]))

  const terrMap = new Map<string, { shape: Array<[number, number, number]> }>();
  for (const entry of npcPosData) {
    if (entry.t === "territory") {
      terrMap.set(entry.$[0], {
        shape: entry.$[1].$.map((x) => [x.$[0], x.$[1], x.$[2]]),
      });
    } else if (entry.t === "npcmaker" || entry.t === "npcmaker_ex") {
      const [terrIds, ...spawns] = entry.$;

      for (const spawn of spawns) {
        const posArr: Array<Array<{ x: number; y: number }>> = [];

        const pos = spawn.pos;

        if (pos === "anywhere") {
          for (const terrId of terrIds) {
            const terr = terrMap.get(terrId);
            if (terr) {
              posArr.push(terr.shape.map((p) => ({ x: p[0], y: p[1] })));
            }
          }
        } else if (pos) {
          for (const subPos of pos.$) {
            posArr.push([{ x: subPos.$[0], y: subPos.$[1] }]);
          }
        }
        const npcName = spawn.$[0];

        for (const pos of posArr) {
          const spawn: NpcSpawn = {
            npcName,
            pos,
          };

          const npc = npcsByName.get(npcName);
          if (npc) {
            npc.spawns.push(spawn);
          }
        }
      }
    }
  }
}