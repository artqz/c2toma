import { Npc, NpcSpawn } from "./../result/types";
import { loadNpcPosC1 } from "../datapack/c1/npcpos";
import { loadFile } from "../utils/Fs";
import { z } from "zod";
import { loadNpcPosC4 } from "../datapack/c4/npcpos";

const MapDataEntry = z.object({
  map: z.string(),
});
type MapDataEntry = z.infer<typeof MapDataEntry>;

export function loadNpcPos(deps: { npcs: Map<number, Npc> }) {
  compareMaps(deps);
  return [];
}

function compareMaps(deps: { npcs: Map<number, Npc> }) {
  const { npcs } = deps;
  const npcC1: string[] = [];
  const npcC4: string[] = [];
  const npcC2: string[] = [];

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
      if (mapC2 === mapC1) {
        npcC1.push(npc.npcName);
      } else if (mapC2 === mapC4) {
        npcC4.push(npc.npcName);
      } else {
        npcC2.push(npc.npcName);
      }
    }
  }

  const posC1 = getPos(npcC1, "c1");
  const posC4 = getPos(npcC4, "c4");
  const arr = [posC1, posC4]
  const merged = arr.flatMap(e => [...e])
  
  return merged;
}

const IGNORE_NPCS = new Set([""]);

function getPos(npcs: string[], chronicle: "c1" | "c4") {

    const npcPos = getAllPos(chronicle)
    const npcSpawns = new Map<string, NpcSpawn>()
    for (const npcName of npcs) {
      const npc = npcPos.get(npcName)
      if(npc) {
        npcSpawns.set(npcName, {...npc})
      }
      else {
        // console.log(npcName);
        
      }
    }

    return npcSpawns
    

}


function getAllPos(chronicle: "c1" | "c4") {
  const npcPos = chronicle === "c1" ? loadNpcPosC1() : loadNpcPosC4();

  const npcSpawns = new Map<string, NpcSpawn>()

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
            npcSpawns.set(npcName, { npcName, pos });          
        }
      }
    }
  }
  return npcSpawns
}