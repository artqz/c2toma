import Fs from "fs";
import { Builder } from "../lib/build";
import { Npc } from "./schemas/npc";
import { loadNpcDataC1 } from "../datapack/c1/npcdata";
import {
  getClan,
  getDrop,
  getSpoil,
  getType,
  getAggr,
  getSex,
  getRace,
  getId,
} from "./getters/npc";
import { itemdata } from "./items";
import { loadNpcNamesC1 } from "../datapack/c1/npcnames";
import slug from "slug";
import { loadAiDataC1 } from "../datapack/c1/ai";
import { round } from "lodash";
import { loadNpcDataGF } from "../datapack/gf/npcdata";
import { NpcNameEntry } from "../datapack/c1/npcnames";

export function npcdata() {
  const npcdata = loadNpcDataC1();
  const npcdataWithNewIds = [];
  const npcNewIdByName = new Map(
    loadNpcDataGF().map((n) => [slug(n.$[2], "_"), n])
  );
  const npcNameById = new Map(loadNpcNamesC1().map((n) => [n.id, n]));
  const npcNameByName = new Map<string, NpcNameEntry>();
  const npcAiByName = new Map(Object.entries(loadAiDataC1()));
  const { itemByName } = itemdata();

  for (const item of npcdata) {
    const npcName = npcNameById.get(item.$[1]);
    if (npcName) {
      npcNameByName.set(slug(item.$[2], "_"), npcName);
    }

    const newId = getId({ npcName: slug(item.$[2], "_"), npcNewIdByName });
    if (!item.$[2].startsWith("_")) {
      // Могут пропасть нужные НПЦ, необходима доп проверка
      if (newId) {
        const new$ = { ...item.$ };
        new$[1] = newId;
        new$[2] = slug(item.$[2], "_");

        npcdataWithNewIds.push({ ...item, $: new$ });
      }
    }
  }

  const npc = Npc.array().parse(
    npcdataWithNewIds.map((npc): Npc => {
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
      const npcType = npc.$[0];
      const npcName = slug(npc.$[2], "_");
      const { name, nick } = npcNameByName.get(npcName) ?? { name: npcName };
      const type = getType(npcType);
      const isAggressive = getAggr({ npcName, npcAiByName });

      return {
        npc: {
          $: {
            id,
            level: npc.level ?? 1,
            type,
            name: name.trim(),
            ...(nick && { title: nick.trim() }),
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
                hp: round(npc.org_hp, 3),
                hpRegen: round(npc.org_hp_regen, 3),
                mp: round(npc.org_mp, 3),
                mpRegen: round(npc.org_mp_regen, 3),
              },
            },
            attack: {
              $: {
                physical: npc.base_physical_attack,
                magical: npc.base_magic_attack,
                critical: npc.base_critical,
                ...(npc.base_reuse_delay && {
                  reuseDelay: npc.base_reuse_delay,
                }),
                attackSpeed: npc.base_attack_speed,
                type: npc.base_attack_type.toUpperCase(),
                random: npc.base_rand_dam,
                range: npc.base_attack_range,
              },
            },
            defence: {
              $: {
                physical: npc.base_defend,
                magical: npc.base_magic_defend,
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

  var xml = builder.buildObject(npc);

  Fs.writeFileSync("./result/server/c1/npcs.xml", xml);

  console.log("Npcdata saved.");
  return { npcByName: new Map(npcdataWithNewIds.map((n) => [n.$[2], n])) };
}
