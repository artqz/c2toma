import { object, unknown } from "zod";
import { loadNpcDataC1 } from "../../datapack/c1/npcdata";
import { loadNpcNamesC1 } from "../../datapack/c1/npcnames";
import { loadNpcDataC4 } from "../../datapack/c4/npcdata";
import { loadNpcNamesC4 } from "../../datapack/c4/npcnames";
import { loadNpcNamesC5 } from "../../datapack/c5/npcnames";
import { loadNpcDataGF } from "../../datapack/gf/npcdata";
import { NpcNameEntry, loadNpcNamesGF } from "../../datapack/gf/npcnames";
import { loadNpcNamesIL } from "../../datapack/il/npcnames";
import { NpcDataEntry } from "../../datapack/types";
import { Item, Npc, NpcDrop, Skill } from "../../result/types";
import { Chronicle } from "../types";
import { generateNpcsC5 } from "./c5/npcs";
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
  getSkillMod,
} from "./func";
import { generateNpcsIL } from "./il/npcs";
import { getSkills } from "./skills/npcGetSkill";
import { canUseSA } from "./npc/canUseSA";

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
    case "c5":
      return addNpcsС5(deps);
    case "il":
      return addNpcsIL(deps);
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
  const skillsByName = new Map(
    Array.from(deps.skills.values()).map((s) => [s.skillName, s])
  );
  const itemByName = new Map(
    Array.from(deps.items.values()).map((i) => [i.itemName, i])
  );

  for (const npc of deps.npcsData) {
    if (IGNORE_NPCS.has(npc.$[2]) || npc.$[2].startsWith("_")) {
      continue;
    }

    const skillList = getSkills({
      ...deps,
      list: npc.skill_list.$ ?? [],
      ai: npc.npc_ai.$,
      skills: skillsByName,
    });

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
      pAtk: calcPAtk(
        npc.base_physical_attack,
        npc.str,
        npc.level,
        getSkillMod({ ...deps, skillList, effectName: "p_physical_attack" })
      ),
      pDef: calcPDef(
        npc.base_defend,
        npc.level,
        getSkillMod({ ...deps, skillList, effectName: "p_physical_defence" })
      ),
      mAtk: calcMAtk(
        npc.base_magic_attack,
        npc.int,
        npc.level,
        getSkillMod({
          ...deps,
          skillList: skillList,
          effectName: "p_magical_attack",
        })
      ),
      mDef: calcMDef(
        npc.base_magic_defend,
        npc.men,
        npc.level,
        getSkillMod({ ...deps, skillList, effectName: "p_magical_defence" })
      ),
      pSpd: calcPSpd(npc.base_attack_speed, npc.dex),
      mSpd: calcMSpd(npc.wit, npc.level),
      pCritical: calcPCritical(npc.base_critical, npc.dex),
      accuracy: calcAccuracy(npc.dex, npc.level),
      evasion: calcEvasion(npc.dex, npc.level),
      baseReuseDelay: 0,
      baseMovingSpeed: [npc.ground_low.$[0], npc.ground_high.$[0]],
      exp: npc.level ** 2 * npc.acquire_exp_rate,
      sp: npc.acquire_sp,
      magicUseSpeedModify: 0,
      orgHp: calcHP(npc.org_hp, npc.con),
      orgHpRegen: calcHPRegen(npc.org_hp_regen, npc.con, npc.level), // нет данных у томы
      orgMp: calcMP(npc.org_mp, npc.men),
      orgMpRegen: calcMPRegen(npc.org_mp_regen, npc.men, npc.level),
      physicalAvoidModify: npc.physical_avoid_modify,
      physicalHitModify: npc.physical_hit_modify,
      con: npc.con,
      dex: npc.dex,
      int: npc.int,
      men: npc.men,
      str: npc.str,
      wit: npc.wit,
      type: npc.$[0],
      race: npc.race, //fix interlude
      classes: [],
      dropList: getDrop({
        ...deps,
        list: npc.additional_make_multi_list,
        items: itemByName,
      }),
      spoilList: getSpoil({
        ...deps,
        list: npc.corpse_make_list,
        items: itemByName,
      }),
      herbList: [],
      ...(canUseSA(npc) && { canUseSA: canUseSA(npc) }),
      skillList,
      multisell: [],
      spawns: [],
    });
  }

  return npcs;
}

function addNpcsС5(deps: {
  skills: Map<string, Skill>;
  items: Map<number, Item>;
}) {
  const npcs = generateNpcsC5(deps);
  return npcs;
}

function addNpcsIL(deps: {
  skills: Map<string, Skill>;
  items: Map<number, Item>;
}) {
  const npcs = generateNpcsIL({ ...deps, ignoreNpcList: IGNORE_NPCS });
  return npcs;
}

function getDrop(deps: { list: any; items: Map<string, Item> }) {
  const drop: NpcDrop[] = [];

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
            const item = deps.items.get(itemName);

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

function getSpoil(deps: { list: any; items: Map<string, Item> }) {
  const spoil: NpcDrop[] = [];

  (deps.list as any).$?.map((itemData: any) => {
    if (itemData) {
      const itemName = itemData.$[0];
      const item = deps.items.get(itemName);
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
    case "c5":
      addNamesC5(deps);
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
    deps.chronicle === "il" ||
    deps.chronicle === "c5"
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

function addNamesC5(deps: { npcsData: Map<number, Npc> }) {
  const npcsData = deps.npcsData;
  for (const npcName of loadNpcNamesC5()) {
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
