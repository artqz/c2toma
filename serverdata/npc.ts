import Fs from "fs";
import { Builder } from "../lib/build";
import { Drop, Npc, Spoil } from "./schemas/npc";
import { loadNpcDataC1 } from "../datapack/c1/npcdata";
import {
  getClan,
  getDrop,
  getSpoil,
  getType,
  getAggr,
  getSex,
  getRace,
} from "./getters/npc";
import { itemdata } from "./items";
import { loadNpcNamesC1 } from "../datapack/c1/npcnames";
import slug from "slug";
import { loadAiDataC1 } from "../datapack/c1/ai";
import _ from "lodash";

export function npcdataC1() {
  const npcdata = loadNpcDataC1();
  const npcNameById = new Map(loadNpcNamesC1().map((n) => [n.id, n]));
  const npcAiByName = new Map(Object.entries(loadAiDataC1()));
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
      const type = getType(npc.$[0]);
      const isAggressive = getAggr({ npcName, npcAiByName });

      return {
        npc: {
          $: {
            id,
            level: npc.level ?? 1,
            type,
            name,
            ...(nick && { title: nick }),
          },
          sex: getSex("male"),
          race: getRace(npc.race),
          acquire: {
            $: {
              exp: npc.acquire_exp_rate,
              sp: npc.acquire_sp,
            },
          },
          stats: {
            $: {
              con: npc.con,
              dex: npc.dex,
              int: npc.int,
              men: npc.men,
              str: npc.str,
              wit: npc.wit,
            },
            vitals: {
              $: {
                hp: _.round(npc.org_hp, 3),
                hpRegen: _.round(npc.org_hp_regen, 3),
                mp: _.round(npc.org_mp, 3),
                mpRegen: _.round(npc.org_mp_regen, 3),
              },
            },
          },
          ai: {
            $: {
              clanHelpRange: npc.clan_help_range,
              aggroRange: npc.agro_range,
              ...(isAggressive && { isAggressive }),
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
                ...(drop.group.length && { drop }),
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
