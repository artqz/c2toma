import { loadNpcPosC1 } from "../datapack/c1/npcpos";

export function npcpos() {
  const terrMap = new Map<string, { shape: Array<[number, number, number]> }>();
  for (const entry of loadNpcPosC1()) {
    if (entry.t === "territory") {
      terrMap.set(entry.$[0], {
        shape: entry.$[1].$.map((x) => [x.$[0], x.$[1], x.$[2]]),
      });
    } else if (entry.t === "npcmaker" || entry.t === "npcmaker_ex") {
      const [terrIds, ...spawns] = entry.$;

      for (const spawn of spawns) {
        const posArr: Array<Array<{ x: number; y: number; z: number }>> = [];

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
          // const spawn: NpcSpawn = {
          //   pos,
          // };
          // const npc = npcsByName.get(npcName);
          // if (npc) {
          //   npc.spawns.push(spawn);
          // }
        }
      }
    }
  }
}
