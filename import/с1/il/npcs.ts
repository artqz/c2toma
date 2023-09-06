import { loadNpcDataC4 } from "../../../datapack/c4/npcdata";
import { loadNpcDataGF } from "../../../datapack/gf/npcdata";
import { loadNpcGrpIL } from "../../../datapack/il/npcgrp";
import { loadNpcNamesIL } from "../../../datapack/il/npcnames";
import { NpcDataEntry, NpcNameEntry } from "../../../datapack/types";
import { Item, Npc, Skill } from "../../../result/types";
type NpcNameC6 = NpcNameEntry & {
  npcName: string;
};

export function generateNpcsIL(deps: {
  skills: Map<string, Skill>;
  items: Map<number, Item>;
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

  console.log(loadNpcNamesIL().length, Array.from(npcs.values()).length);
  // add skills
  addSkills({ ...deps, npcs });

  // add drop and spoil
  addDropAndSpoil({ ...deps, npcs });

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
    npcName: "",
    name: npcName.name,
    nick: npcName.nick,
    nickColor: npcName.nickcolor,
    level: npcData.level,
    ai: "",
    agroRange: 0,
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
    orgHp: npcData.org_hp,
    orgHpRegen: 0, // нет данных у томы
    orgMp: npcData.org_mp,
    orgMpRegen: 0, // нет данных у томы
    physicalAvoidModify: npcData.physical_avoid_modify,
    physicalHitModify: npcData.physical_hit_modify,
    type: npcData.$[0],
    race: npcData.race,
    classes: [],
    dropList: [],
    spoilList: [],
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

  for (const npc of deps.npcs.values()) {
    const grp = npcGrp.get(npc.id);
    if (grp) {
      for (const skillIdLvl of grp.skillList) {
        const skill = deps.skills.get(skillIdLvl);
        if (skill) {
          npc.skillList.push(skill.skillName);
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
  const itemByName = new Map(
    Array.from(deps.items.values()).map((i) => [i.itemName, i])
  );

  for (const npc of deps.npcs.values()) {
    const npcGF = npcGFById.get(npc.id);
    if (npcGF) {
      (npcGF.additional_make_multi_list as any).$?.map((mainGroup: any) => {
        const mainGroupChanceDrop = Number(mainGroup.$[1]);
        return mainGroup.$.map((subGroup: any) => {
          return (
            subGroup.$ &&
            subGroup.$.map((itemData: any) => {
              if (itemData.$) {
                const itemChanceDrop = Number(itemData.$[3]);
                const chance = (itemChanceDrop * mainGroupChanceDrop) / 100;

                const itemName = itemData.$[0].replace(/\s/g, "_");
                const item = itemByName.get(itemName.replace("_low", ""));

                if (!item) {
                  console.log(`Drop list (NPC: ${npc.id}) item not found: ${itemName}`);
                } else {
                  npc.dropList.push({
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

      (npcGF.corpse_make_list as any).$?.map((itemData: any) => {
        if (itemData) {
          const itemName = itemData.$[0];
          const item = itemByName.get(itemName);
          if (!item) {
            console.log(`Spoil list (NPC: ${npc.id}) item not found: ${itemName}`);
          } else {
            npc.spoilList.push({
              itemName: item.itemName,
              countMin: itemData.$[1],
              countMax: itemData.$[2],
              chance: itemData.$[3],
            });
          }
        }
      });
    }
  }
}
