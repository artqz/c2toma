import Fs from "fs";
import Path from "path";
import { loadNpcDataC1 } from "../datapack/c1/npcdata";

import { loadNpcNamesC2 } from "../datapack/c2/npcnames";
import { loadNpcDataC4 } from "../datapack/c4/npcdata";
// import { loadSkillNamesGF } from "../datapack/gf/skillnames";
import { Item, Npc, NpcDrop, Skill, lstring } from "../result/types";
import { NpcDataEntry } from "./types";
import { NpcNameEntry, loadNpcNamesGF } from "../datapack/gf/npcnames";
import { loadNpcDataGF } from "../datapack/gf/npcdata";
import { calcAccuracy, calcEvasion, calcMAtk, calcMDef, calcMSpd, calcPAtk, calcPCritical, calcPDef, calcPSpd, getSkillMod } from './с1/func';

export const npcSkills = new Map<string, Skill>();

function loadNpcJson(path: string, filename: string) {
  const map = Fs.readFileSync(Path.join(path, filename), "utf8");
  return NpcDataEntry.parse(JSON.parse(map));
}

export function loadNpcs(deps: {
  items: Map<number, Item>;
  skills: Map<string, Skill>;
}) {
  let npcs = loadTomaNpcs(deps);
  npcs = loadC4Npcs({ ...deps, npcsToma: npcs });
  npcs = runames({ npcs });
  console.log("NPCs loaded.");
  return npcs;
}

function loadTomaNpcs(deps: {
  items: Map<number, Item>;
  skills: Map<string, Skill>;
}) {
  const npcnamesC2 = new Map(loadNpcNamesC2().map((npc) => [npc.id, npc]));

  const npcs = new Map<number, Npc>();
  const path = "npcs/c2";
  const entries = Fs.readdirSync(path, "utf8");
  const tomaNpcs = new Map(
    entries
      .filter((file) => Path.extname(file) === ".json")
      .map((x) => [parseInt(x), parseInt(x)])
  );

  for (const npcId of Array.from(tomaNpcs.values())) {
    const npcC2 = npcnamesC2.get(npcId);

    if (npcC2) {
      const npc = loadNpcJson(path, `${npcId}.json`);

      npcs.set(npcId, {
        id: npc.npcData.npcClassId,
        npcName: "", // нет данных у томы
        name: { en: npcC2.name, ru: "" }, // нет данных у томы
        nick: { en: npcC2.nick, ru: "" }, // нет данных у томы
        nickColor: npcC2.nickcolor, // нет данных у томы
        level: npc.npcData.level,
        ai: "",
        agroRange: 0, // нет данных у томы
        baseAttackSpeed: npc.npcData.baseAttackSpeed,
        baseCritical: npc.npcData.baseCritical,
        baseDefend: npc.npcData.baseDefend,
        baseMagicAttack: npc.npcData.baseMagicAttack,
        baseMagicDefend: npc.npcData.baseMagicDefend,
        basePhysicalAttack: npc.npcData.basePhysicalAttack,
        baseReuseDelay: 0, // нет данных у томы
        baseMovingSpeed: [0, 0],
        exp: npc.npcData.acquireExpRate,
        sp: npc.npcData.acquireSp,
        magicUseSpeedModify: 0, // нет данных у томы
        orgHp: npc.npcData.orgHp,
        orgHpRegen: 0, // нет данных у томы
        orgMp: npc.npcData.orgMp,
        orgMpRegen: 0, // нет данных у томы
        physicalAvoidModify: npc.npcData.physicalAvoidModify,
        physicalHitModify: npc.npcData.physicalHitModify,
        con: 0,
        dex: 0,
        int: 0,
        men: 0,
        str: 0,
        wit: 0,
        type: npc.npcData.npcType.toString(), // необходимо перевести в другой вид, либо взять в другом сервере
        race: "", // нет данных у томы, берем из скилов, которых нет берем из ц4
        classes: [],
        dropList: getDrop(npc.drop, deps.items),
        spoilList: getDrop(npc.spoil, deps.items),
        skillList: getSkills({ ...deps, tomaSkills: npc.npcData.skillList }),
        multisell: [],
        spawns: [],
        herbList: [],
      });
    }
  }
  return npcs;
}

function getSkills(deps: {
  skills: Map<string, Skill>;
  tomaSkills: { skillId: number; skillLevel: number }[];
}) {
  const skillArr: string[] = [];
  deps.tomaSkills.map((s) => {
    const skill = deps.skills.get(s.skillId + "_" + s.skillLevel);
    if (skill) {
      npcSkills.set(s.skillId + "_" + s.skillLevel, skill);
      skillArr.push(s.skillId + "_" + s.skillLevel);
    }
  });
  return skillArr;
}

function loadC4Npcs(deps: {
  npcsToma: Map<number, Npc>;
  items: Map<number, Item>;
  skills: Map<string, Skill>;
}) {
  const npcs = new Map<number, Npc>();
  const c4Npcs = new Map(loadNpcDataC4().map((npc) => [npc.$[1], npc]));
  const c1Npcs = new Map(loadNpcDataC1().map((npc) => [npc.$[1], npc]));
  const npcsSkills = new Map<string, string>();
  for (const npc of Array.from(deps.npcsToma.values())) {
    const npcById = c4Npcs.get(npc.id);

    if (npcById) {
      if (OLD_NPCS.has(npcById!.$[2])) {
        const npcC1 = c1Npcs.get(npc.id);
        if (npcC1) {
          npcs.set(npc.id, {
            ...npc,
            agroRange: npcC1.agro_range,
            npcName: npcC1.$[2],
            orgHpRegen: npcC1.org_hp_regen,
            orgMpRegen: npcC1.org_mp_regen,
            type: npcC1.$[0],
            race: getRace(npc.skillList, npcC1.race),
            ai: npcC1.npc_ai.$[0],
            con: npcC1.con,
            dex: npcC1.dex,
            int: npcC1.int,
            men: npcC1.men,
            str: npcC1.str,
            wit: npcC1.wit,
            baseMovingSpeed: [npcC1.ground_low.$[0], npcC1.ground_high.$[0]],
            pAtk: calcPAtk(
        npcC1.base_physical_attack,
        npcC1.str,
        npcC1.level,
        getSkillMod({...deps, skillList: npc.skillList, effectName: "p_physical_attack"})
      ),
      pDef: calcPDef(npcC1.base_defend, npcC1.level, getSkillMod({...deps, skillList: npc.skillList, effectName: "p_physical_defence"})),
      mAtk: calcMAtk(npcC1.base_magic_attack, npcC1.int, npcC1.level, getSkillMod({...deps, skillList: npc.skillList, effectName: "p_magical_attack"})),
      mDef: calcMDef(npcC1.base_magic_defend, npcC1.men, npcC1.level, getSkillMod({...deps, skillList: npc.skillList, effectName: "p_magical_defence"})),
      pSpd: calcPSpd(npcC1.base_attack_speed, npcC1.dex),
      mSpd: calcMSpd(npcC1.wit, npcC1.level),
      pCritical: calcPCritical(npcC1.base_critical, npcC1.dex),
      accuracy: calcAccuracy(npcC1.dex, npcC1.level),
      evasion: calcEvasion(npcC1.dex, npcC1.level),
            // skillList: npcById
            //   ? npcById.skill_list.$!.map((x) => {
            //       const skillName = x.replace("@", "");
            //       npcsSkills.set(skillName, skillName);
            //       return skillName;
            //     })
            //   : [],
          });
        }
      } else {
        if (npcById) {
          npcs.set(npc.id, {
            ...npc,
            agroRange: npcById.agro_range,
            npcName: npcById.$[2],
            orgHpRegen: npcById.org_hp_regen,
            orgMpRegen: npcById.org_mp_regen,
            type: npcById.$[0],
            race: getRace(npc.skillList, npcById.race),
            ai: npcById.npc_ai.$[0],
            con: npcById.con,
            dex: npcById.dex,
            int: npcById.int,
            men: npcById.men,
            str: npcById.str,
            wit: npcById.wit,
            baseMovingSpeed: [
              npcById.ground_low.$[0],
              npcById.ground_high.$[0],
            ],
            pAtk: calcPAtk(
        npcById.base_physical_attack,
        npcById.str,
        npcById.level,
        getSkillMod({...deps, skillList: npc.skillList, effectName: "p_physical_attack"})
      ),
      pDef: calcPDef(npcById.base_defend, npcById.level, getSkillMod({...deps, skillList: npc.skillList, effectName: "p_physical_defence"})),
      mAtk: calcMAtk(npcById.base_magic_attack, npcById.int, npcById.level, getSkillMod({...deps, skillList: npc.skillList, effectName: "p_magical_attack"})),
      mDef: calcMDef(npcById.base_magic_defend, npcById.men, npcById.level, getSkillMod({...deps, skillList: npc.skillList, effectName: "p_magical_defence"})),
      pSpd: calcPSpd(npcById.base_attack_speed, npcById.dex),
      mSpd: calcMSpd(npcById.wit, npcById.level),
      pCritical: calcPCritical(npcById.base_critical, npcById.dex),
      accuracy: calcAccuracy(npcById.dex, npcById.level),
      evasion: calcEvasion(npcById.dex, npcById.level),
            // skillList: npcById
            //   ? npcById.skill_list.$!.map((x) => {
            //       const skillName = x.replace("@", "");
            //       npcsSkills.set(skillName, skillName);
            //       return skillName;
            //     })
            //   : [],
          });
        }
      }
    }
  }

  //add npc skills
  addNpcSkills({ ...deps, npcsSkills });
  return npcs;
}

function addNpcSkills(deps: {
  npcsSkills: Map<string, string>;
  skills: Map<string, Skill>;
}) {
  const skillByName = new Map(
    Array.from(deps.skills.values()).map((x) => [x.skillName, x])
  );

  for (const npcSkill of deps.npcsSkills.values()) {
    const skill = skillByName.get(npcSkill);
    if (skill) {
      deps.skills.set(skill.id + "_" + skill.level, {
        ...skill,
      });
    } else {
      console.log(`------ нет нпц скилза ${npcSkill}`);
    }
  }
}

function getDrop(list: DropList[], items: Map<number, Item>) {
  const drop: NpcDrop[] = [];

  for (const item of list) {
    drop.push({
      chance: item.chance,
      countMax: item.max,
      countMin: item.min,
      itemName: items.get(item.crystal.itemClassId)!.itemName,
    });
  }

  return drop;
}

function runames(deps: { npcs: Map<number, Npc> }) {
  const npcdataGF = new Map(loadNpcDataGF().map((npc) => [npc.$[1], npc]));
  const npcnamesGF = new Map(loadNpcNamesGF().map((npc) => [npc.id, npc]));
  const npcnameByName = new Map<string, NpcNameEntry>();

  for (const dNpc of npcdataGF.values()) {
    const nNpc = npcnamesGF.get(dNpc.$[1]);
    if (nNpc) {
      npcnameByName.set(dNpc.$[2], nNpc);
    }
  }

  for (const npc of deps.npcs.values()) {
    const nNpc = npcnameByName.get(npc.npcName);
    if (nNpc) {
      deps.npcs.set(npc.id, {
        ...npc,
        name: { ...npc.name, ru: nNpc.name.ru },
        nick: { ...npc.nick, ru: nNpc.nick.ru },
      });
    }
  }

  return deps.npcs;
}

type DropList = {
  npcType: number;
  min: number;
  max: number;
  chance: number;
  npcId: number;
  crystal: {
    itemClassId: number;
    crystalType: "NoGrade" | "D" | "C" | "B" | "A" | "S";
  };
};

const OLD_NPCS = new Set([
  "__gargoyle_lord",
  "__patriarch_kuroboros",
  "__malex",
  "__madness_beast",
  "__discard_guardian",
  "__brae_orc_chief",
  "__soul_scavenger",
  "__sukar_wererat_chief",
  "__kaysha_herald_of_ikaro",
  "__tracker_sharuk",
  "__priest_of_kuroboros",
  "__tiger_hornet",
  "__revenant_of_sir_calibu",
  "__demon_tempest",
  "__redeye_leader_trakia",
  "__nurkas_messenger",
  "__queens_nobel_leader",
  "__titan_premo_prime",
  "__archon_susceptor",
  "__eyes_of_bereth",
  "__adherent_of_anta_skyla",
  "__corsair_captain_kylon",
  "__cave_servant_lord_ishk",
  "__scavenger_ldr_rinoket",
  "__necrosentinel_guard",
  "__envoyofantaras_nakonda",
  "__dread_avenger_kraven",
  "__handmaiden_of_orfen",
  "__fairy_queen_timiniel",
  "__betrayer_of_urutu",
  "__rampage_golem_ldr_talo",
  "__guts",
  "__langu",
  "__guflang",
  "__rayon",
  "__ria",
  "__maslin",
  "__gludio_outter_doorman",
  "__ol_mahum_steward_tamut",
  "__partisan_ordery_brakel",
  "__tokum_priest_of_fire",
  "__ruben",
  "__horner",
  "__bremmer",
  "__calis",
  "__winker",
  "__black",
  "__dillon",
  "__boyer",
  "__tim",
  "__seth",
  "__ron",
  "__flynn",
  "event_human",
  "__gludio_teleporter1",
  "__gludio_teleporter2",
  "__gludio_teleporter3",
  "__dion_default_teleporte",
  "__giran_teleporter1",
  "__giran_teleporter2",
  "__giran_teleporter3",
  "__oren_default_teleporte",
  "__aden_default_teleporte",
]);

function getRace(skills: string[], race: string) {
  const racesMap = new Map<string, string>([
    ["s_race_animal", "animal"],
    ["s_race_beast", "beast"],
    ["s_race_bug", "bug"],
    ["s_race_construct", "construct"],
    ["s_race_demonic", "demonic"],
    ["s_race_dragon", "dragon"],
    ["s_race_elemental", "elemental"],
    ["s_race_fairy", "fairy"],
    ["s_race_giant", "giant"],
    ["s_race_humanoid", "humanoid"],
    ["s_race_plant", "plant"],
    ["s_race_undead", "undead"],
    ["s_race_divine", "divine"],
  ]);

  let newRace = race;

  for (const skill of skills.values()) {
    const checkRace = racesMap.get(skill);
    if (checkRace) {
      newRace = checkRace;
    }
  }

  return newRace;
}
