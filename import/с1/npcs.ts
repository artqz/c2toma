import { loadNpcDataC1 } from "../../datapack/c1/npcdata";
import { loadNpcNamesC1 } from "../../datapack/c1/npcnames";
import { loadNpcDataC4 } from "../../datapack/c4/npcdata";
import { loadNpcNamesC4 } from "../../datapack/c4/npcnames";
import { loadNpcDataGF } from "../../datapack/gf/npcdata";
import { NpcNameEntry, loadNpcNamesGF } from "../../datapack/gf/npcnames";
import { loadNpcDataIL } from "../../datapack/il/npcdata";
import { loadNpcNamesIL } from "../../datapack/il/npcnames";
import { NpcDataEntry } from "../../datapack/types";
import { Item, Npc, NpcDrop, Skill } from "../../result/types";
import { Chronicle } from "../types";
import { generateNpcsIL } from "./il/npcs";

export function loadNpcs(deps: {
  chronicle: Chronicle;
  items: Map<number, Item>;
  skills: Map<string, Skill>;
}) {
  let npcs = loadNpcData(deps);
  npcs = loadNpcnames({ ...deps, npcsData: npcs });
  npcs = loadNpcRuNames({ ...deps, npcsData: npcs });
  console.log("NPCs loaded.");

  return npcs;
}

function loadNpcData(deps: {
  chronicle: Chronicle;
  items: Map<number, Item>;
  skills: Map<string, Skill>;
}) {
  switch (deps.chronicle) {
    case "c1":
      return addNpcs({ ...deps, npcsData: loadNpcDataC1() });
    case "c4":
      return addNpcs({ ...deps, npcsData: loadNpcDataC4() });
    case "il":
      return addNpcsIL();
    case "gf":
      return addNpcs({ ...deps, npcsData: loadNpcDataGF() });
    default:
      return addNpcs({ ...deps, npcsData: loadNpcDataC1() });
  }
}

function addNpcs(deps: {
  chronicle: Chronicle;
  items: Map<number, Item>;
  skills: Map<string, Skill>;
  npcsData: NpcDataEntry[];
}) {
  const npcs = new Map<number, Npc>();

  for (const npc of deps.npcsData) {
    if (IGNORE_NPCS.has(npc.$[2]) || npc.$[2].startsWith("_")) {
      continue;
    }

    npcs.set(npc.$[1], {
      id: npc.$[1],
      npcName: npc.$[2],
      name: { en: "", ru: "" },
      nick: { en: "", ru: "" },
      nickColor: "default",
      level: npc.level,
      ai: npc.npc_ai.$[0],
      agroRange: npc.agro_range,
      baseAttackSpeed: npc.base_attack_speed,
      baseCritical: npc.base_critical,
      baseDefend: npc.base_defend,
      baseMagicAttack: npc.base_magic_attack,
      baseMagicDefend: npc.base_magic_defend,
      basePhysicalAttack: npc.base_physical_attack,
      baseReuseDelay: 0,
      exp: npc.level ** 2 * npc.acquire_exp_rate,
      sp: npc.acquire_sp,
      magicUseSpeedModify: 0,
      orgHp: npc.org_hp,
      orgHpRegen: npc.org_hp_regen,
      orgMp: npc.org_mp,
      orgMpRegen: npc.org_mp_regen,
      physicalAvoidModify: npc.physical_avoid_modify,
      physicalHitModify: npc.physical_hit_modify,
      type: npc.$[0],
      race: npc.race, //fix interlude
      classes: [],
      dropList: getDrop({ ...deps, list: npc.additional_make_multi_list }),
      spoilList: getSpoil({ ...deps, list: npc.corpse_make_list }),
      skillList: getSkills({ ...deps, list: npc.skill_list }),
      multisell: [],
      spawns: [],
    });
  }
  return npcs;
}

function addNpcsIL() {
  const npcs = generateNpcsIL();
  return npcs;
}

function getSkills(deps: {
  list: { $?: string[] | undefined };
  skills: Map<string, Skill>;
}) {
  const skillsByName = new Map(
    Array.from(deps.skills.values()).map((s) => [s.skillName, s])
  );
  const npcSkillList: string[] = [];
  for (const npcSkill of deps.list.$ ?? []) {
    const skill = skillsByName.get(npcSkill.replace("@", ""));
    if (skill) {
      npcSkillList.push(skill.skillName);
    }
  }
  return npcSkillList;
}

function getDrop(deps: { list: any; items: Map<number, Item> }) {
  const drop: NpcDrop[] = [];
  const itemByName = new Map(
    Array.from(deps.items.values()).map((i) => [i.itemName, i])
  );

  (deps.list as any).$?.map((mainGroup: any) => {
    const mainGroupChanceDrop = Number(mainGroup.$[1]);
    return mainGroup.$.map((subGroup: any) => {
      return (
        subGroup.$ &&
        subGroup.$.map((itemData: any) => {
          if (itemData.$) {
            const itemChanceDrop = Number(itemData.$[3]);
            const chance = (itemChanceDrop * mainGroupChanceDrop) / 100;

            const itemName = itemData.$[0].replace(/\s/g, "_");
            const item = itemByName.get(itemName);

            if (!item) {
              console.log("Drop list item not found: " + itemName);
            } else {
              drop.push({
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

  return drop;
}

function getSpoil(deps: { list: any; items: Map<number, Item> }) {
  const spoil: NpcDrop[] = [];
  const itemByName = new Map(
    Array.from(deps.items.values()).map((i) => [i.itemName, i])
  );

  (deps.list as any).$?.map((itemData: any) => {
    if (itemData) {
      const itemName = itemData.$[0];
      const item = itemByName.get(itemName);
      if (!item) {
        console.log("Spoil list item not found: " + itemName);
      } else {
        spoil.push({
          itemName: item.itemName,
          countMin: itemData.$[1],
          countMax: itemData.$[2],
          chance: itemData.$[3],
        });
      }
    }
  });

  return spoil;
}

function loadNpcnames(deps: {
  chronicle: Chronicle;
  npcsData: Map<number, Npc>;
}) {
  const npcsData = deps.npcsData;

  switch (deps.chronicle) {
    case "c1":
      addNamesC1(deps);
      break;
    case "c4":
      addNamesC4(deps);
      break;
    case "il":
      addNamesIL(deps);
      break;
    case "gf":
      addNamesGF(deps);
      break;
    default:
      addNamesC1(deps);
      break;
  }

  return npcsData;
}

function loadNpcRuNames(deps: {
  chronicle: Chronicle;
  npcsData: Map<number, Npc>;
}) {
  const npcsData = deps.npcsData;
  if (
    deps.chronicle === "c1" ||
    deps.chronicle === "c4" ||
    deps.chronicle === "il"
  ) {
    const npcdataGF = new Map(loadNpcDataGF().map((npc) => [npc.$[1], npc]));
    const npcNamesGF = new Map(loadNpcNamesGF().map((npc) => [npc.id, npc]));
    const npcNameByName = new Map<string, NpcNameEntry>();

    for (const npcGF of npcdataGF.values()) {
      const npcName = npcNamesGF.get(npcGF.$[1]);
      if (npcName) {
        npcNameByName.set(npcGF.$[2], npcName);
      }
    }

    for (const npcData of npcsData.values()) {
      const npc = npcNameByName.get(npcData.npcName);
      if (npc) {
        npcsData.set(npcData.id, {
          ...npcData,
          name: { ...npcData.name, ru: npc.name.ru },
          nick: {
            ...npcData.nick,
            ru: npcData.nick.en === npc.nick.en ? npc.nick.ru : npcData.nick.en,
          },
        });
      }
    }
  }

  return npcsData;
}

function addNamesC1(deps: { npcsData: Map<number, Npc> }) {
  const npcsData = deps.npcsData;
  for (const npcName of loadNpcNamesC1()) {
    const npc = npcsData.get(npcName.id);
    if (npc) {
      npcsData.set(npc.id, {
        ...npc,
        name: { en: npcName.name, ru: npcName.name },
        nick: { en: npcName.nick, ru: npcName.nick },
        nickColor: npcName.nickcolor,
      });
    }
  }
}

function addNamesC4(deps: { npcsData: Map<number, Npc> }) {
  const npcsData = deps.npcsData;
  for (const npcName of loadNpcNamesC4()) {
    const npc = npcsData.get(npcName.id);
    if (npc) {
      npcsData.set(npc.id, {
        ...npc,
        name: npcName.name,
        nick: npcName.nick,
        nickColor: npcName.nickcolor,
      });
    }
  }
}

function addNamesIL(deps: { npcsData: Map<number, Npc> }) {
  const npcsData = deps.npcsData;
  for (const npcName of loadNpcNamesIL()) {
    const npc = npcsData.get(npcName.id);
    if (npc) {
      npcsData.set(npc.id, {
        ...npc,
        name: npcName.name,
        nick: npcName.nick,
        nickColor: npcName.nickcolor,
      });
    }
  }
}

function addNamesGF(deps: { npcsData: Map<number, Npc> }) {
  const npcsData = deps.npcsData;
  for (const npcName of loadNpcNamesGF()) {
    const npc = npcsData.get(npcName.id);
    if (npc) {
      npcsData.set(npc.id, {
        ...npc,
        name: npcName.name,
        nick: npcName.nick,
        nickColor: npcName.nickcolor,
      });
    }
  }
}

const IGNORE_NPCS = new Set([
  "salesman_cat",
  "test_server_helper",
  "test_server_helper2",
]);
