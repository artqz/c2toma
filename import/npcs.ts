import Fs from "fs";
import Path from "path";
import { loadNpcDataC1 } from "../datapack/c1/npcdata";

import { loadNpcNamesC2, NpcNameEntry } from "../datapack/c2/npcnames";
import { loadNpcDataC4 } from "../datapack/c4/npcdata";
import { loadSkillDataC4 } from "../datapack/c4/skilldata";
import { loadSkillIconsGF } from "../datapack/gf/skillgrp";
import { loadSkillNamesGF } from "../datapack/gf/skillnames";
import { Item, Npc, NpcDrop, Skill } from "../result/types";
import { NpcDataEntry } from "./types";

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
        name: npcC2.name, // нет данных у томы
        nick: npcC2.nick, // нет данных у томы
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
        exp: npc.npcData.acquireExpRate,
        sp: npc.npcData.acquireSp,
        magicUseSpeedModify: 0, // нет данных у томы
        orgHp: npc.npcData.orgHp,
        orgHpRegen: 0, // нет данных у томы
        orgMp: npc.npcData.orgMp,
        orgMpRegen: 0, // нет данных у томы
        physicalAvoidModify: npc.npcData.physicalAvoidModify,
        physicalHitModify: npc.npcData.physicalHitModify,
        type: npc.npcData.npcType.toString(), // необходимо перевести в другой вид, либо взять в другом сервере
        race: "", // нет данных у томы, берем из скилов, которых нет берем из ц4
        dropList: getDrop(npc.drop, deps.items),
        spoilList: getDrop(npc.spoil, deps.items),
        skillList: getSkills({...deps, tomaSkills: npc.npcData.skillList}),
        multisell: [],
        spawns: [],
      });
    }
  }
  return npcs;
}

function getSkills(deps: {skills: Map<string, Skill>, tomaSkills: {skillId: number, skillLevel: number}[]}) {
  const skillArr: string[] = []
  deps.tomaSkills.map(s => {    
    const skill = deps.skills.get(s.skillId+"_"+s.skillLevel)    
    if (skill) {
      skillArr.push(skill.skillName)
    }
  })
  return skillArr
}

function loadC4Npcs(deps: {
  npcsToma: Map<number, Npc>;
  items: Map<number, Item>
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
  //add drop in items
  addDropInItems({...deps, npcs})

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
  const skillC4 = new Map(
    Array.from(skillsC4GF().values()).map((x) => [x.skillName, x])
  );

  for (const npcSkill of Array.from(deps.npcsSkills.values())) {
    const skill = skillByName.get(npcSkill);
    if (!skill) {
      const _skill = skillC4.get(npcSkill);
      if (_skill) {
        deps.skills.set(_skill.id + "_" + _skill.level, {
          ..._skill,
        });
      }
    }
  }
}

function getDrop(
  list: DropList[],
  items: Map<number, Item>,
) {
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

function skillsC4GF() {
  const skillDataC4 = loadSkillDataC4();
  const skillIcons = loadSkillIconsGF();
  const skillNames = loadSkillNamesGF();

  const skillsMap = new Map<string, Skill>();

  //add data
  for (const skillData of skillDataC4.values()) {
    skillsMap.set(skillData.skill_id + "_" + skillData.level, {
      id: skillData.skill_id,
      level: skillData.level,
      name: "",
      desc: "",
      icon: "",
      operateType: skillData.operate_type,
      skillName: skillData.skill_name,
      effectTime: skillData.abnormal_time,
      effectType:
        skillData.debuff === undefined
          ? undefined
          : skillData.debuff
          ? "debuff"
          : skillData.skill_name.search("song_") > 0 ||
            skillData.skill_name.search("dance_") > 0
          ? "song"
          : "buff",
    });
  }

  //add skill
  for (const skillIco of skillIcons) {
    const skill = skillsMap.get(skillIco.id + "_" + skillIco.level);
    if (skill) {
      skillsMap.set(skillIco.id + "_" + skillIco.level, {
        ...skill,
        icon: skillIco.icon.replace("_new", ""),
      });
    }
  }

  //add names
  for (const skillName of skillNames) {
    const skill = skillsMap.get(skillName.id + "_" + skillName.level);
    if (skill) {
      skillsMap.set(skillName.id + "_" + skillName.level, {
        ...skill,
        name: skillName.name,
        desc: skillName.desc,
      });
    }
  }

  return skillsMap;
}

function addDropInItems (deps: {
  items: Map<number, Item>,
  npcs: Map<number, Npc>
}) {
  const ItemByName = new Map(Array.from(deps.items.values()).map(i => [i.itemName, i]))
  for (const npc of deps.npcs.values()) {
    for (const drop of npc.dropList) {     
      const item = ItemByName.get(drop.itemName)
      if (item) {
        item.dropList.push({npcName: npc.npcName, chance: drop.chance, countMin: drop.countMin, countMax: drop.countMax})
      }
    }

    for (const spoil of npc.spoilList) {      
      const item = ItemByName.get(spoil.itemName)
      if (item) {        
        item.spoilList.push({npcName: npc.npcName, chance: spoil.chance, countMin: spoil.countMin, countMax: spoil.countMax})
      }
    }
  }
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
}

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
    ["s_race_animal", "animal"], ["s_race_beast", "beast"], ["s_race_bug","bug"], 
    ["s_race_construct", "construct"], ["s_race_demonic", "demonic"], ["s_race_dragon", "dragon"], 
    ["s_race_elemental", "elemental"], ["s_race_fairy", "fairy"], ["s_race_giant", "giant"], 
    ["s_race_humanoid", "humanoid"], ["s_race_plant", "plant"], ["s_race_undead", "undead"], 
    ["s_race_divine", "divine"], 
  ])

  let newRace = race

  for (const skill of skills.values()) {
    const checkRace = racesMap.get(skill)
    if (checkRace) {
      newRace = checkRace      
    }
  }

  return newRace
}

