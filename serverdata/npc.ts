import Fs from "fs";
import { Builder } from "../lib/build";
import { Drop, Npc, Spoil } from "./schemas/npc";
import { loadNpcDataC1 } from "../datapack/c1/npcdata";
import { getClan, getDrop, getSpoil } from "./getters/npc";
import { itemdata } from "./items";
import { loadNpcNamesC1 } from "../datapack/c1/npcnames";
import slug from "slug";

export function npcdataC1() {
  const npcdata = loadNpcDataC1();
  const npcNameById = new Map(loadNpcNamesC1().map((n) => [n.id, n]));
  const { itemByName } = itemdata();

  const npc = Npc.array().parse(
    Array.from(npcdata).map((npc): Npc => {
      const npcClan = getClan(npc.clan);
      const drop = getDrop({
        list: npc.additional_make_multi_list,
        itemByName,
      });
      const spoil = getSpoil({
        list: npc.corpse_make_list,
        itemByName,
      });
      const id = npc.$[1];
      const npcName = slug(npc.$[2], "_");
      const { name, nick } = npcNameById.get(id) ?? { name: npcName };
      return {
        npc: {
          $: {
            id,
            level: npc.level ?? 1,
            type: "Monster",
            name,
            ...(nick && { title: nick }),
          },
          ai: {
            $: {
              clanHelpRange: npc.clan_help_range,
              aggroRange: npc.agro_range,
            },
            ...(npcClan && { clanList: { clan: npcClan } }),
          },
          collision: {
            radius: {
              $: {
                normal: npc.collision_radius.$[0],
                ...(npc.collision_radius.$[0] !== npc.collision_radius.$[1] && {
                  grown: npc.collision_radius.$[1],
                }),
              },
            },
            height: {
              $: {
                normal: npc.collision_height.$[0],
                ...(npc.collision_height.$[0] !== npc.collision_height.$[1] && {
                  grown: npc.collision_height.$[1],
                }),
              },
            },
          },
          ...(drop.group.length &&
            spoil.item.length && {
              dropLists: {
                ...(drop.group.length && { spoil }),
                ...(spoil.item.length && { spoil }),
              },
            }),
        },
      };
    })
  );

  // var builder = new xml2js.Builder();
  const builder = new Builder({
    attrkey: "$",
    charkey: "_",
    rootName: "root",
    cdata: true,
    com: "_com",
    // Другие параметры...
  });
  var xml = builder.buildObject(npc);

  Fs.writeFileSync("./result/server/c1/npcs.xml", xml);
  console.log("Npcdata saved.");
}
