import { Npc, NpcSpawn, Point } from "./../result/types";
import { loadNpcPosC1 } from "../datapack/c1/npcpos";
import { loadFile } from "../utils/Fs";
import { z } from "zod";
import { loadNpcPosC4 } from "../datapack/c4/npcpos";

const MapDataEntry = z.object({
  map: z.string(),
});
type MapDataEntry = z.infer<typeof MapDataEntry>;

export function loadNpcPos(deps: { npcs: Map<number, Npc> }) {
  const mergedNpcPos = compareMaps(deps);

  return mergedNpcPos;
}

function compareMaps(deps: { npcs: Map<number, Npc> }) {
  const { npcs } = deps;
  let npcsC1 = new Map<string, Npc>();
  let npcsC4 = new Map<string, Npc>();
  let npcsC2 = new Map<string, Npc>();

  for (const npc of Array.from(npcs.values())) {
    const empty = MapDataEntry.parse(
      JSON.parse(loadFile(`maps/empty.json`))
    ).map;
    const mapC1 = MapDataEntry.parse(
      JSON.parse(loadFile(`maps/c1/${npc.id}.json`))
    ).map;
    const mapC2 = MapDataEntry.parse(
      JSON.parse(loadFile(`maps/c2/${npc.id}.json`))
    ).map;
    const mapC4 = MapDataEntry.parse(
      JSON.parse(loadFile(`maps/c4/${npc.id}.json`))
    ).map;

    if (mapC2 !== empty) {
      if (mapC2 === mapC4) {
        npcsC4.set(npc.npcName, npc);
      } else if (mapC2 === mapC1) {
        npcsC1.set(npc.npcName, npc);
      } else {
        npcsC2.set(npc.npcName, npc);
      }
    }
  }

  npcsC1 = addSpawn({ npcs: npcsC1, chronicle: "c1" });
  npcsC4 = addSpawn({ npcs: npcsC4, chronicle: "c4" });

  const arr = [npcsC1, npcsC4, npcsC2];
  const mergedNpcPos = new Map(arr.flatMap((e) => [...e]));

  return mergedNpcPos;
}

function addSpawn(deps: { npcs: Map<string, Npc>; chronicle: "c1" | "c4" }) {
  const npcPos = deps.chronicle === "c1" ? loadNpcPosC1() : loadNpcPosC4();

  const terrMap = new Map<string, { shape: Array<[number, number, number]> }>();
  for (const entry of npcPos) {
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

          const npc = deps.npcs.get(npcName);
          if (npc) {
            npc.spawns.push(spawn);
          }
        }
      }
    }
  }

  for (const npc of deps.npcs.values()) {
    if (!npc.spawns.length) {
      console.log("нет позиций:", npc.npcName);
    }
  }

  return deps.npcs;
}
