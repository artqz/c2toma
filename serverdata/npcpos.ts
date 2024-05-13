import Fs from "fs";
import { loadNpcPosC1 } from "../datapack/c1/npcpos";
import { NpcPos, Territory } from "./schemas/npcpos";
import { Builder } from "../lib/build";
import { npcdata } from "./npcdata";
import slug from "slug";

export function npcpos() {
  const { npcByName } = npcdata();
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
        const npcdata = npcByName.get(slug(spawn.$[0], "_"));
        if (npcdata) {
          for (const terrId of terrIds) {
            const _spawn = spawnMap.get(terrId);
            if (_spawn) {
              const npc = _spawn.npc;
              if (pos === "anywhere") {
                if (typeof spawn.respawn !== "string") {
                  npc.push({
                    _com: npcdata.$[2],
                    $: {
                      id: npcdata.$[1]!,
                      count: spawn.total ?? 1,
                      respawnTime: spawn.respawn.value + spawn.respawn.unit,
                    },
                  });
                }
              } else if (pos) {
                if (typeof spawn.respawn !== "string") {
                  for (const subPos of pos.$) {
                    npc.push({
                      _com: npcdata.$[2],
                      $: {
                        id: npcdata.$[1]!,
                        count: spawn.total ?? 1,
                        x: subPos.$[0],
                        y: subPos.$[1],
                        z: subPos.$[2],
                        heading: subPos.$[3],
                        respawnTime: spawn.respawn.value + spawn.respawn.unit,
                      },
                    });
                  }
                }
              }
              spawnMap.set(terrId, { ..._spawn, npc });
            }
          }
        }
      }
    }
  }

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
      "xsi:noNamespaceSchemaLocation": "../../../xsd/spawns.xsd",
    },
  };

  const spawns = NpcPos.array().parse(
    Array.from(spawnMap.values()).map((s): NpcPos => {
      return { spawn: { npc: s.npc, territories: s.territories } };
    })
  );

  var xml = builder.buildObject(spawns);

  Fs.writeFileSync("./result/server/c1/npcspos.xml", xml);
  console.log("Npcpos saved.");
}
