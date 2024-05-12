import Fs from "fs";
import { loadNpcPosC1 } from "../datapack/c1/npcpos";
import { NpcPos, Territory } from "./schemas/npcpos";
import { Builder } from "../lib/build";

export function npcpos() {
  const spawnMap = new Map<string, NpcPos["spawn"]>();

  for (const entry of loadNpcPosC1()) {
    if (entry.t === "territory") {
      const minZ = entry.$[1].$[0].$[2];
      const maxZ =
        typeof entry.$[1].$[0].$[3] === "number"
          ? entry.$[1].$[0].$[3]
          : minZ + 300;
      const spawn = spawnMap.get(entry.$[0]);

      if (!spawn) {
        spawnMap.set(entry.$[0], {
          territories: {
            territory: [
              {
                $: { name: entry.$[0], minZ, maxZ },
                node: entry.$[1].$.map((x) => {
                  return {
                    $: { x: x.$[0], y: x.$[1] },
                  };
                }),
              },
            ],
          },
          npc: [],
        });
      } else {
        const territory = spawn.territories.territory;
        territory.push({
          $: { name: entry.$[0], minZ, maxZ },
          node: entry.$[1].$.map((x) => {
            return {
              $: { x: x.$[0], y: x.$[1] },
            };
          }),
        });
        spawnMap.set(entry.$[0], {
          ...spawn,
          territories: {
            territory,
          },
        });
      }
    } else if (entry.t === "npcmaker" || entry.t === "npcmaker_ex") {
      const [terrIds, ...spawns] = entry.$;

      for (const spawn of spawns) {
        const pos = spawn.pos;

        if (pos === "anywhere") {
          for (const terrId of terrIds) {
            const _spawn = spawnMap.get(terrId);
            if (_spawn) {
              if (typeof spawn.respawn !== "string") {
                const npc = _spawn.npc;
                npc.push({
                  $: {
                    id: spawn.$[0],
                    count: spawn.total ?? 1,
                    respawnTime: spawn.respawn.value + spawn.respawn.unit,
                  },
                });
                spawnMap.set(terrId, { ..._spawn, npc });
              }
            }
          }
        }
      }
    }
    // console.log(territories);

    // if (entry.t === "territory") {
    //   terrMap.set(entry.$[0], {
    //     shape: entry.$[1].$.map((x) => [x.$[0], x.$[1], x.$[2]]),
    //   });
    // } else if (entry.t === "npcmaker" || entry.t === "npcmaker_ex") {
    //   const [terrIds, ...spawns] = entry.$;

    //   for (const spawn of spawns) {
    //     const posArr: Array<Array<{ x: number; y: number; z: number }>> = [];

    //     const pos = spawn.pos;

    //     if (pos === "anywhere") {
    //       for (const terrId of terrIds) {
    //         const terr = terrMap.get(terrId);
    //         if (terr) {
    //           posArr.push(terr.shape.map((p) => ({ x: p[0], y: p[1], z: 0 })));
    //         }
    //       }
    //     } else if (pos) {
    //       for (const subPos of pos.$) {
    //         posArr.push([{ x: subPos.$[0], y: subPos.$[1], z: 0 }]);
    //       }
    //     }
    //     const npcName = spawn.$[0];

    //     for (const pos of posArr) {
    //       const spawn = {
    //         pos,
    //       };
    //       console.log(npcName, spawn);

    //       // const npc = npcsByName.get(npcName);
    //       // if (npc) {
    //       //   npc.spawns.push(spawn);
    //       // }
    //     }
    //   }
    // }
  }

  // const npcpos: NpcPos = NpcPos.parse(
  //   Array.from(spawnMap.values()).map((s): NpcPos => {
  //     return { spawn: { npc: s.npc, territories: s.territories } };
  //   })
  // );

  // NpcPos.array().parse({})
  // var builder = new xml2js.Builder();
  const builder = new Builder({
    attrkey: "$",
    charkey: "_",
    rootName: "list",
    cdata: true,
    com: "_com",
    // Другие параметры...
  });

  const list = {
    $: {
      "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
      "xsi:noNamespaceSchemaLocation": "../../../xsd/npcs.xsd",
    },
  };

  // var xml = builder.buildObject(npcpos);

  Fs.writeFileSync(
    "./result/server/c1/npcspos.json",
    JSON.stringify(Array.from(spawnMap.values()), null, 2)
  );
  console.log("Npcpos saved.");
}
