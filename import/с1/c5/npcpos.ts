import _ from 'lodash';
import { loadNpcDataC4 } from '../../../datapack/c4/npcdata';
import { loadNpcPosC4 } from '../../../datapack/c4/npcpos';
import { loadNpcDataGF } from '../../../datapack/gf/npcdata';
import { loadNpcPosGF } from '../../../datapack/gf/npcpos';
import { NpcPosEntry } from '../../../datapack/types';
import { Npc, NpcSpawn, Point } from '../../../result/types';

export function generateNpcposC5 (deps: { npcs: Map<number, Npc>;}) {   
  const npcposC4 = getPos(loadNpcPosC4())
  const npcposGF = getPos(loadNpcPosGF())
  const npcByIdC4 = new Map(loadNpcDataC4().map(n=> [n.$[1], n]))
  const npcByIdGF = new Map(loadNpcDataGF().map(n=> [n.$[1], n]))

  for (const npc of deps.npcs.values()) {    
    // const npcC4 = npcByIdC4.get(npc.id)
    
    // if (npcC4) {
    //   const posC4 = npcposC4.get(npc.npcName)
    //   if (posC4) {
    //    for (const pos of posC4) {
    //     npc.spawns.push(pos);
    //    }
      
      
    //   }
      
    // } else {      
    //   const npcGF = npcByIdGF.get(npc.id)
    //   if (npcGF) {
    //     const posGF = npcposGF.get(npc.npcName)
    //     if (posGF) {
    //       for (const pos of posGF) {
    //     npc.spawns.push(pos);
    //    }
    //     }
        
    //   }
    // }
  }
}

function getPos(npcPosData: NpcPosEntry[]) {
  const npcpos: {npcName: string, spawn:NpcSpawn}[] = []
  const terrMap = new Map<string, { shape: Array<[number, number, number]> }>();
  for (const entry of npcPosData) {
    if (entry.t === "territory") {
      terrMap.set(entry.$[0], {
        shape: entry.$[1].$.map((x) => [x.$[0], x.$[1], x.$[2]]),
      });
    } else if (entry.t === "npcmaker" || entry.t === "npcmaker_ex") {
      const [terrIds, ...spawns] = entry.$;


      for (const spawn of spawns) {
        const posArr: Array<Array<Point>> = [];

        const pos = spawn.pos;

        if (pos === "anywhere") {
          for (const terrId of terrIds) {
            const terr = terrMap.get(terrId);
            if (terr) {
              posArr.push(terr.shape.map((p) => ({ x: p[0], y: p[1], z: 0 })));
            }
          }
        } else if (pos) {
          for (const subPos of pos.$) {
            posArr.push([{ x: subPos.$[0], y: subPos.$[1], z: 0 }]);
          }
        }
        const npcName = spawn.$[0];

        
        for (const pos of posArr) {
          const spawn: NpcSpawn = {
            pos,
          };

          npcpos.push({npcName, spawn})
          // const npc = npcsByName.get(npcName);
          // if (npc) {
          //   npc.spawns.push(spawn);
          // }
        }
      }
    }

    const arr = _.groupBy(npcpos, (d) => d.npcName)
    console.log(arr);
    
    return npcpos
  }
  //
}