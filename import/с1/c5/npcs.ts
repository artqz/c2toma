import { loadNpcDataC4 } from "../../../datapack/c4/npcdata";
import { loadNpcGrpC5 } from "../../../datapack/c5/npcgrp";
import { loadNpcNamesC5 } from "../../../datapack/c5/npcnames";
import { loadNpcDataGF } from "../../../datapack/gf/npcdata";
import { NpcDataEntry, NpcNameEntry } from "../../../datapack/types";
import { Item, Npc, Skill } from "../../../result/types";
import { calcHP, calcHPRegen, calcMP, calcMPRegen } from "../func";
type NpcNameC6 = NpcNameEntry & {
  npcName: string;
};

export function generateNpcsC5(deps: {
  skills: Map<string, Skill>;
  items: Map<number, Item>;
}) {
  const npcs = new Map<number, Npc>();
  const npcsNames = new Map<number, NpcNameC6>();

  const npcC4ByName = new Map(loadNpcDataC4().map((n) => [n.$[2], n]));
  const npcGFByName = new Map(loadNpcDataGF().map((n) => [n.$[2], n]));
  const npcGFById = new Map(loadNpcDataGF().map((n) => [n.$[1], n]));

  // Находим все игровые имена в грации
  for (const npcName of loadNpcNamesC5()) {
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
    const npcC4 = npcC4ByName.get(npcName.npcName);
    if (npcC4) {
      const { id, npc } = addNpc(npcC4, npcName, deps.skills);
      npcs.set(id, npc);
    } else {
      const npcGF = npcGFByName.get(npcName.npcName);
      if (npcGF) {
        const { id, npc } = addNpc(npcGF, npcName, deps.skills);
        npcs.set(id, npc);
      }
    }
  }

  console.log(loadNpcNamesC5().length, Array.from(npcs.values()).length);
  // add skills
  addSkills({ ...deps, npcs });

  // add drop and spoil
  addDropAndSpoil({ ...deps, npcs });

  // add herbs
  addHerbs({ ...deps, npcs });

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
    exp: npcData.level ** 2 * npcData.acquire_exp_rate,
    sp: npcData.acquire_sp,
    magicUseSpeedModify: 0,
    orgHp: calcHP(npcData.org_hp, npcData.con),
    orgHpRegen: calcHPRegen(npcData.org_hp_regen, npcData.con, npcData.level), // нет данных у томы
    orgMp: calcMP(npcData.org_mp, npcData.men),
    orgMpRegen: calcMPRegen(npcData.org_mp_regen, npcData.men, npcData.level),
    physicalAvoidModify: npcData.physical_avoid_modify,
    physicalHitModify: npcData.physical_hit_modify,
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
  const npcGrp = new Map(loadNpcGrpC5().map((ng) => [ng.id, ng]));

  for (const npc of deps.npcs.values()) {
    const grp = npcGrp.get(npc.id);
    if (grp) {
      for (const skillIdLvl of grp.skillList) {
        const skill = deps.skills.get(skillIdLvl);
        if (skill) {
          npc.skillList.push(skillIdLvl);
        }
      }
    }
  }
}

function addDropAndSpoil(deps: {
  npcs: Map<number, Npc>;
  items: Map<number, Item>;
}) {
  const npcGFById = new Map(loadNpcDataGF().map((n) => [n.$[1], n]));
  const npcC4ByName = new Map(loadNpcDataC4().map((n) => [n.$[2], n]));
  const itemByName = new Map(
    Array.from(deps.items.values()).map((i) => [i.itemName, i])
  );

  for (const npc of deps.npcs.values()) {
    const npcC4 = npcC4ByName.get(npc.npcName);
    if (npcC4) {
      addDrop({ dropList: npcC4.additional_make_multi_list, itemByName, npc });
      addSpoil({ spoilList: npcC4.corpse_make_list, itemByName, npc });
    } else {
      const npcGF = npcGFById.get(npc.id);
      if (npcGF) {
        addDrop({
          dropList: npcGF.additional_make_multi_list,
          itemByName,
          npc,
        });
        addSpoil({ spoilList: npcGF.corpse_make_list, itemByName, npc });
      }
    }
  }
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
              console.log(
                `Drop list (NPC: ${deps.npc.id}) item not found: ${itemName}`
              );
            } else {
              deps.npc.dropList.push({
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
              console.log(
                `Drop list (NPC: ${deps.npc.id}) item not found: ${itemName}`
              );
            } else {
              deps.npc.herbList.push({
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
