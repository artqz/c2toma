import Fs from "fs";
import { Builder } from "../lib/build";
import { Drop, Npc, Spoil } from "./schemas/npc";
import { loadNpcDataC1 } from "../datapack/c1/npcdata";
import { getClan, getDrop } from "./getters/npc";
import { itemdata } from "./items";

export function npcdataC1() {
  const npcdata = loadNpcDataC1();
  const { itemByName } = itemdata();

  // function spoil(list: NpcDrop[]): Spoil {
  //   return {
  //     item: (list ?? []).map((i) => {
  //       return {
  //         _com: i.itemName,
  //         $: {
  //           id: i.itemId,
  //           min: i.countMin,
  //           max: i.countMax,
  //           chance: i.chance,
  //         },
  //       };
  //     }),
  //   };
  // }

  const npc = Npc.array().parse(
    Array.from(npcdata).map((npc): Npc => {
      const npcClan = getClan(npc.clan);
      const drop = getDrop({
        list: npc.additional_make_multi_list,
        itemByName,
      });
      return {
        npc: {
          $: {
            id: npc.$[1],
            level: npc.level ?? 1,
            type: "Monster",
            name: "npc.name.en",
            // ...(npc.nick.en !== "" && { title: npc.nick.en }),
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
          dropLists: {
            ...(drop.group.length && { drop }),
            // spoil: spoil(npc.corpse_make_list),
          },
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
