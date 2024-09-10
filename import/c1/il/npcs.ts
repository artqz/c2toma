import _ from "lodash";
import { loadNpcDataC4 } from "../../../datapack/c4/npcdata";
import { loadNpcDataGF } from "../../../datapack/gf/npcdata";
import { loadNpcGrpIL } from "../../../datapack/il/npcgrp";
import { loadNpcNamesIL } from "../../../datapack/il/npcnames";
import { NpcDataEntry, NpcNameEntry } from "../../../datapack/types";
import { Item, Npc, NpcDrop, Skill } from "../../../result/types";
import { tomaNpcsParser } from "../../../utils/tomaParser";
import {
  calcAccuracy,
  calcEvasion,
  calcHP,
  calcHPRegen,
  calcMAtk,
  calcMDef,
  calcMP,
  calcMPRegen,
  calcMSpd,
  calcPAtk,
  calcPCritical,
  calcPDef,
  calcPSpd,
  calcSpeed,
  getSkillMod,
} from "../func";
import { getClan } from "../npc/getters";
import { getSkills } from "../skills/npcGetSkill";
type NpcNameC6 = NpcNameEntry & {
  npcName: string;
};

export function generateNpcsIL(deps: {
  skills: Map<string, Skill>;
  items: Map<number, Item>;
  ignoreNpcList: Set<string>;
}) {
  const npcs = new Map<number, Npc>();
  const npcsNames = new Map<number, NpcNameC6>();

  const npcC4ByName = new Map(loadNpcDataC4().map((n) => [n.$[2], n]));
  const npcGFByName = new Map(loadNpcDataGF().map((n) => [n.$[2], n]));
  const npcGFById = new Map(loadNpcDataGF().map((n) => [n.$[1], n]));

  // Находим все игровые имена в грации
  for (const npcName of loadNpcNamesIL()) {
    const npcGF = npcGFById.get(npcName.id);
    if (npcGF) {
      npcsNames.set(npcName.id, { ...npcName, npcName: npcGF.$[2] });
    } else {
      npcsNames.set(npcName.id, {
        ...npcName,
        npcName: addNpcName.get(npcName.id) ?? "null",
      });
    }
  }

  for (const npcName of npcsNames.values()) {
    const npcGF = npcGFByName.get(npcName.npcName);
    if (npcGF) {
      //
      if (deps.ignoreNpcList.has(npcGF.$[2]) || npcGF.$[2].startsWith("_")) {
        continue;
      }
      //
      const { id, npc } = addNpc(npcGF, npcName, deps.skills);
      npcs.set(id, npc);
    } else {
      const npcC4 = npcC4ByName.get(npcName.npcName);
      if (npcC4) {
        //
        if (deps.ignoreNpcList.has(npcC4.$[2]) || npcC4.$[2].startsWith("_")) {
          continue;
        }
        //
        const { id, npc } = addNpc(npcC4, npcName, deps.skills);
        npcs.set(id, npc);
      }
    }
  }

  console.log(loadNpcNamesIL().length, Array.from(npcs.values()).length);
  // add skills
  addSkills({ ...deps, npcs });

  // add drop and spoil
  addDropAndSpoil({ ...deps, npcs });

  // add herbs
  addHerbs({ ...deps, npcs });

  // add stats
  addStats({ ...deps, npcs });

  return npcs;
}

function addNpc(
  npcData: NpcDataEntry,
  npcName: NpcNameC6,
  skills: Map<string, Skill>
) {
  const id = npcName.id;
  const npc: Npc = {
    id: npcName.id,
    npcName: npcData.$[2],
    name: npcName.name,
    nick: npcName.nick,
    nickColor: npcName.nickcolor,
    level: npcData.level,
    ai: npcData.npc_ai.$[0],
    agroRange: npcData.agro_range,
    baseAttackSpeed: npcData.base_attack_speed,
    baseCritical: npcData.base_critical,
    baseDefend: npcData.base_defend,
    baseMagicAttack: npcData.base_magic_attack,
    baseMagicDefend: npcData.base_magic_defend,
    basePhysicalAttack: npcData.base_physical_attack,
    baseReuseDelay: 0,
    baseMovingSpeed: [calcSpeed(npcData.ground_low.$[0], npcData.dex), calcSpeed(npcData.ground_high.$[0], npcData.dex)],
    exp: npcData.level ** 2 * npcData.acquire_exp_rate,
    sp: npcData.acquire_sp,
    magicUseSpeedModify: 0,
    orgHp: calcHP(
      getMaxHP(npcData.org_hp, npcData.skill_list.$ ?? []),
      npcData.con
    ),
    orgHpRegen: calcHPRegen(npcData.org_hp_regen, npcData.con, npcData.level), // нет данных у томы
    orgMp: calcMP(npcData.org_mp, npcData.men),
    orgMpRegen: calcMPRegen(npcData.org_mp_regen, npcData.men, npcData.level),
    physicalAvoidModify: npcData.physical_avoid_modify,
    physicalHitModify: npcData.physical_hit_modify,
    collisionHeight: npcData.collision_height.$,
    collisionRadius: npcData.collision_radius.$,
    clan: getClan(npcData.clan),
    clanHelpRange: npcData.clan_help_range,
    con: npcData.con,
    dex: npcData.dex,
    int: npcData.int,
    men: npcData.men,
    str: npcData.str,
    wit: npcData.wit,
    type: npcData.$[0],
    race: npcData.race,
    classes: [],
    dropList: [],
    spoilList: [],
    herbList: [],
    skillList: [],
    multisell: [],
    spawns: [],
  };

  return { id, npc };
}

// нпц которых не хватает грации и чьи ИД были изменены
const addNpcName = new Map([
  [21277, "kukaburo_c"],
  [21281, "antelope_c"],
  [21285, "bandersnatch_c"],
  [21289, "buffalo_c"],
  [21293, "grendel_c"],
  [25517, "anais_brilliance_master"],
  [25518, "brilliance_apostle"],
  [25519, "brilliance_follower"],
]);

function addSkills(deps: {
  npcs: Map<number, Npc>;
  skills: Map<string, Skill>;
}) {
  const npcGrp = new Map(loadNpcGrpIL().map((ng) => [ng.id, ng]));
  const npcC4ByName = new Map(loadNpcDataC4().map((n) => [n.$[2], n]));
  const npcGFByName = new Map(loadNpcDataGF().map((n) => [n.$[2], n]));
  const skillsByName = new Map(
    Array.from(deps.skills.values()).map((s) => [s.skillName, s])
  );
  const tomaNpcById = new Map(
    tomaNpcsParser({
      path: "import/c1/il/npcs",
    }).map((n) => [n.npc.npcClassId, n.npc.skillList])
  );

  for (const npc of deps.npcs.values()) {
    const skillList: string[] = [];
    const tomaNapcSkills = tomaNpcById.get(npc.id);
    if (tomaNapcSkills) {
      for (const tSkill of tomaNapcSkills) {
        const skill = deps.skills.get(tSkill.skillId + "_" + tSkill.skillLevel);
        if (skill) {
          skillList.push(skill.skillName.replace("@", ""));
        }
      }
    } else {
      const grp = npcGrp.get(npc.id);
      if (grp) {
        for (const skillIdLvl of grp.skillList) {
          const skill = deps.skills.get(skillIdLvl);
          if (skill) {
            skillList.push(skill.skillName.replace("@", ""));
          }
        }
      }
    }

    // const skillList = [];
    // const grp = npcGrp.get(npc.id);
    // if (grp) {
    //   for (const skillIdLvl of grp.skillList) {
    //     const skill = deps.skills.get(skillIdLvl);
    //     if (skill) {
    //       skillList.push(skill.skillName.replace("@", ""));
    //     }
    //   }
    // }
    const npcC4 = npcC4ByName.get(npc.npcName);
    if (npcC4) {
      npc.skillList = getSkills({
        ai: npcC4.npc_ai.$,
        list: skillList,
        skills: skillsByName,
      });
    } else {
      const npcGF = npcGFByName.get(npc.npcName);
      if (npcGF) {
        npc.skillList = getSkills({
          ai: npcGF.npc_ai.$,
          list: skillList,
          skills: skillsByName,
        });
      }
    }
  }
}

function addDropAndSpoil(deps: {
  npcs: Map<number, Npc>;
  items: Map<number, Item>;
}) {
  const npcGFByName = new Map(loadNpcDataGF().map((n) => [n.$[2], n]));
  const npcC4ById = new Map(loadNpcDataC4().map((n) => [n.$[1], n]));
  const itemByName = new Map(
    Array.from(deps.items.values()).map((i) => [i.itemName, i])
  );

  for (const npc of deps.npcs.values()) {
    const npcGF = npcGFByName.get(npc.npcName);
    if (npcGF) {
      addDrop({ dropList: npcGF.additional_make_multi_list, itemByName, npc });
      addSpoil({ spoilList: npcGF.corpse_make_list, itemByName, npc });
    } else {
      const npcC4 = npcC4ById.get(npc.id);
      if (npcC4) {
        addDrop({
          dropList: npcC4.additional_make_multi_list,
          itemByName,
          npc,
        });
        addSpoil({ spoilList: npcC4.corpse_make_list, itemByName, npc });
      }
    }
  }

  // добавляем недостающие предметы из базы томы
  const npcById = deps.npcs;
  const TOMA_NPCS = tomaNpcsParser({
    path: "import/c1/il/npcs",
  });

  for (const tomaNpc of TOMA_NPCS) {
    const npc = npcById.get(tomaNpc.npc.npcClassId);
    if (npc) {
      npc.dropList = checkTomaDrop({
        dropList: npc.dropList,
        tomaDropList: tomaNpc.npc.additionalMakeMultiList,
        itemById: deps.items,
      });
      npc.spoilList = checkTomaDrop({
        dropList: npc.spoilList,
        tomaDropList: tomaNpc.npc.corpseMakeList,
        itemById: deps.items,
      });
    }
  }
}

function checkTomaDrop(deps: {
  dropList: NpcDrop[];
  tomaDropList: {
    itemClassId: number;
    min: number;
    max: number;
    chance: number;
  }[];
  itemById: Map<number, Item>;
}) {
  // const tomaDropListMap = new Map<
  //   number,
  //   {
  //     itemClassId: number;
  //     min: number;
  //     max: number;
  //     chance: number;
  //   }
  // >(deps.tomaDropList.map((item) => [item.itemClassId, item]));

  // const filteredItemData = deps.dropList.filter((item) =>
  //   tomaDropListMap.has(item.itemId)
  // );

  // const filteredItemDataMap = new Map<number, NpcDrop>(
  //   filteredItemData.map((item) => [item.itemId, item])
  // );

  const drop: NpcDrop[] = [];

  deps.tomaDropList.forEach((_item) => {
    // if (!filteredItemDataMap.has(_item.itemClassId)) {
    const item = deps.itemById.get(_item.itemClassId);
    if (!item) {
      console.log(`--------------- нет предмета в базе ${_item.itemClassId}`);
    } else {
      const newItem: NpcDrop = {
        itemId: _item.itemClassId,
        itemName: item.itemName,
        countMin: _item.min,
        countMax: _item.max,
        chance: _item.chance,
      };
      drop.push(newItem);
    }
    // }
  });
  return drop;
}

function addDrop(deps: {
  npc: Npc;
  itemByName: Map<string, Item>;
  dropList: any;
}) {
  deps.dropList.$?.map((mainGroup: any) => {
    const mainGroupChanceDrop = Number(mainGroup.$[1]);
    return mainGroup.$.map((subGroup: any) => {
      return (
        subGroup.$ &&
        subGroup.$.map((itemData: any) => {
          if (itemData.$) {
            const itemChanceDrop = Number(itemData.$[3]);
            const chance = (itemChanceDrop * mainGroupChanceDrop) / 100;

            const itemName = itemData.$[0].replace(/\s/g, "_");
            const item = deps.itemByName.get(itemName.replace("_low", ""));

            if (!item) {
              // console.log(
              //   `Drop list (NPC: ${deps.npc.id}) item not found: ${itemName}`
              // );
            } else {
              deps.npc.dropList.push({
                itemId: item.id,
                itemName: item.itemName,
                countMin: itemData.$[1],
                countMax: itemData.$[2],
                chance,
              });
            }
          }
        })
      );
    });
  });
}

function addSpoil(deps: {
  npc: Npc;
  itemByName: Map<string, Item>;
  spoilList: any;
}) {
  deps.spoilList.$?.map((itemData: any) => {
    if (itemData) {
      const itemName = itemData.$[0];
      const item = deps.itemByName.get(itemName);
      if (!item) {
        console.log(
          `Spoil list (NPC: ${deps.npc.id}) item not found: ${itemName}`
        );
      } else {
        deps.npc.spoilList.push({
          itemId: item.id,
          itemName: item.itemName,
          countMin: itemData.$[1],
          countMax: itemData.$[2],
          chance: itemData.$[3],
        });
      }
    }
  });
}

function addHerbs(deps: { npcs: Map<number, Npc>; items: Map<number, Item> }) {
  const npcGFById = new Map(loadNpcDataGF().map((n) => [n.$[1], n]));
  const itemByName = new Map(
    Array.from(deps.items.values()).map((i) => [i.itemName, i])
  );

  for (const npc of deps.npcs.values()) {
    const npcGF = npcGFById.get(npc.id);
    if (npcGF) {
      addDropHerbs({ dropHerbList: npcGF.ex_item_drop_list, itemByName, npc });
    }
  }
}

function addDropHerbs(deps: {
  npc: Npc;
  itemByName: Map<string, Item>;
  dropHerbList: any;
}) {
  deps.dropHerbList.$?.map((mainGroup: any) => {
    const mainGroupChanceDrop = Number(mainGroup.$[1]);
    return mainGroup.$.map((subGroup: any) => {
      return (
        subGroup.$ &&
        subGroup.$.map((itemData: any) => {
          if (itemData.$) {
            const itemChanceDrop = Number(itemData.$[3]);
            const chance = (itemChanceDrop * mainGroupChanceDrop) / 100;

            const itemName = itemData.$[0].replace(/\s/g, "_");
            const item = deps.itemByName.get(itemName);

            if (!item) {
              // console.log(
              //   `Drop list (NPC: ${deps.npc.id}) item not found: ${itemName}`
              // );
            } else {
              deps.npc.herbList.push({
                itemId: item.id,
                itemName: item.itemName,
                countMin: itemData.$[1],
                countMax: itemData.$[2],
                chance,
              });
            }
          }
        })
      );
    });
  });
}

function addStats(deps: {
  npcs: Map<number, Npc>;
  skills: Map<string, Skill>;
}) {
  for (const npc of deps.npcs.values()) {
    // npc.npcName === "zombie_warrior" &&
    //   console.log(
    //     npc.basePhysicalAttack,
    //     npc.str,
    //     npc.level,
    //     getSkillMod({
    //       ...deps,
    //       skillList: npc.skillList,
    //       effectName: "p_physical_attack",
    //     })
    //   );
    npc.pAtk = calcPAtk(
      npc.basePhysicalAttack ?? 0,
      npc.str,
      npc.level ?? 0,
      getSkillMod({
        ...deps,
        skillList: npc.skillList,
        effectName: "p_physical_attack",
      })
    );

    npc.pDef = calcPDef(
      npc.baseDefend ?? 0,
      npc.level ?? 0,
      getSkillMod({
        ...deps,
        skillList: npc.skillList,
        effectName: "p_physical_defence",
      })
    );
    npc.mAtk = calcMAtk(
      npc.baseMagicAttack ?? 0,
      npc.int,
      npc.level ?? 0,
      getSkillMod({
        ...deps,
        skillList: npc.skillList,
        effectName: "p_magical_attack",
      })
    );
    npc.mDef = calcMDef(
      npc.baseMagicDefend ?? 0,
      npc.men,
      npc.level ?? 0,
      getSkillMod({
        ...deps,
        skillList: npc.skillList,
        effectName: "p_magical_defence",
      })
    );
    npc.pSpd = calcPSpd(npc.baseAttackSpeed ?? 0, npc.dex);
    npc.mSpd = calcMSpd(npc.wit, npc.level ?? 0);
    npc.pCritical = calcPCritical(npc.baseCritical ?? 0, npc.dex ?? 0);
    npc.accuracy = calcAccuracy(npc.dex, npc.level ?? 0);
    npc.evasion = calcEvasion(npc.dex, npc.level ?? 0);
  }
}
function getMaxHP(orgHp: number, skillList: string[]) {
  let multiplier = 1;

  for (const skill of skillList) {
    const m = multiplierBySkill.get(skill);
    if (m) {
      multiplier = m;
    }
  }

  return orgHp * multiplier;
}

const multiplierBySkill = new Map([
  ["@s_npc_prop_hp_lv_mq", 0.25],
  ["@s_npc_prop_hp_lv_mh", 0.5],
  ["@s_npc_prop_hp_lv_m2", 2],
  ["@s_npc_prop_hp_lv_m3", 3],
  ["@s_npc_prop_hp_lv_m4", 4],
  ["@s_npc_prop_hp_lv_m5", 5],
  ["@s_npc_prop_hp_lv_m6", 6],
  ["@s_npc_prop_hp_lv_m7", 7],
  ["@s_npc_prop_hp_lv_m8", 8],
  ["@s_npc_prop_hp_lv_m9", 9],
  ["@s_npc_prop_hp_lv_m10", 10],
  ["@s_npc_prop_hp_lv_m11", 11],
  ["@s_npc_prop_hp_lv_m12", 12],
]);
