import { loadNpcDataC4 } from './datapack/c4/npcdata';
import { loadSkillDataC4 } from './datapack/c4/skilldata';
import { loadNpcGrpC5 } from './datapack/c5/npcgrp';
import { loadNpcNamesC5 } from './datapack/c5/npcnames';
import { loadSkillNamesC5 } from './datapack/c5/skillnames';
import { loadNpcDataGF } from './datapack/gf/npcdata';
import { SkillEntryGF, loadSkillDataGF } from './datapack/gf/skilldata';
import { NpcNameEntry, NpcDataEntry } from './datapack/types';

type NpcName = NpcNameEntry & {
  npcName: string;
};

type Npc = {id: number, npcName: string, skillList: SkillEntryGF[]}

function init () {
  const skillsByNameC5 = new Map(
    loadSkillNamesC5().map((s) => [s.id+"_"+s.level, s])
  );
  const npcsSkills: SkillEntryGF[] = []
  const npcsC5 = generateNpcsC5()
  for (const npc of npcsC5.values()) {
    npc.skillList.map(s => npcsSkills.push(s))
  }

  for (const skill of npcsSkills) {
    const _skill = skillsByNameC5.get(skill.skill_id+"_"+skill.level)
    if (_skill) {
      
    }
    else {
      const _skillFix = skillsByNameC5.get(skill.skill_id+"_"+(skill.level-1))
      if (_skillFix) {
        
      } else {
        console.log(skill.skill_id+"_"+skill.level);
      }
      
    }
  }
  

}

export function generateNpcsC5() {
  const npcs = new Map<number, Npc>();
  const npcsNames = new Map<number, NpcName>();

  console.log("start");

  const skillsByNameC4 = new Map(
    loadSkillDataC4().map((s) => [s.skill_name, s])
  );
  const skillsByNameGF = new Map(
    loadSkillDataGF().map((s) => [s.skill_name, s])
  );  
  const npcC4ByName = new Map(loadNpcDataC4().map((n) => [n.$[2], n]));
  const npcGFByName = new Map(loadNpcDataGF().map((n) => [n.$[2], n]));
  const npcGFById = new Map(loadNpcDataGF().map((n) => [n.$[1], n]));
  console.log("add maps");
  // Находим все игровые имена в грации
  for (const npcName of loadNpcNamesC5()) {
    const npcGF = npcGFById.get(npcName.id);
    if (npcGF) {
      npcsNames.set(npcName.id, { ...npcName, npcName: npcGF.$[2] });
    } 
    else {      
      npcsNames.set(npcName.id, {
        ...npcName,
        npcName: addNpcName.get(npcName.id) ?? "null",
      });
    }
  }
  console.log("find names");

  for (const npcName of npcsNames.values()) {
    const npcC4 = npcC4ByName.get(npcName.npcName);
    if (npcC4) {
      const { id, npc } = addNpc(npcC4, npcName, skillsByNameC4);
      npcs.set(id, npc);
    } else {
      const npcGF = npcGFByName.get(npcName.npcName);
      if (npcGF) {
        const { id, npc } = addNpc(npcGF, npcName, skillsByNameGF);
        npcs.set(id, npc);
      }
      else {
        
        
      }
    }
  }
  console.log("add npcs");

  console.log(loadNpcNamesC5().length, Array.from(npcs.values()).length);

  return npcs;
}

function addNpc(
  npcData: NpcDataEntry,
  npcName: NpcName,
  skills: Map<string, SkillEntryGF>) {
  const id = npcName.id;
  const npc: Npc = {
    id: npcName.id,
    npcName: npcData.$[2],
    skillList: getSkills({list: npcData.skill_list, skills})
  };

  return { id, npc };
}

function getSkills(deps: {
  list: { $?: string[] | undefined };
  skills: Map<string, SkillEntryGF>
}) {
  
  const npcSkillList: SkillEntryGF[] = [];
  for (const npcSkill of deps.list.$ ?? []) {
    const skill = deps.skills.get(npcSkill.replace("@", ""));
    if (skill) {
      npcSkillList.push(skill);
    } else {
      console.log("skill none");
      
    }
  }
  return npcSkillList;
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


init()