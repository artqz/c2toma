import { loadSkillGrpC6 } from '../../datapack/c6/skillgrp';
import { loadSkillNamesC6 } from '../../datapack/c6/skillnames';
import { SkillEntryGF, loadSkillDataGF } from '../../datapack/gf/skilldata';
import { loadSkillNamesGF } from '../../datapack/gf/skillnames';
import { SkillNameEntry } from '../../datapack/types';
import { Skill } from '../../result/types';

export function loadSkillsC6() {
  let skills: Map<string, Skill>;
  skills = getSkills();
  skills = getIcons({ skills });
  skills = getRuNames({ skills});

  console.log("Skills loaded.");
  return skills;
}

// type SkillNameC6 = SkillNameEntry & {
//   id: number;
// };

function getSkills() {
  const skills = new Map<string, Skill>()

  const skillGFById = new Map(loadSkillDataGF().map((s) => [s.skill_id+"_"+s.level, s]));
  
  for (const skillName of loadSkillNamesC6()) {
    let i = 0
    const skillGF = skillGFById.get(skillName.id+"_"+skillName.level)

    if (skillGF) {
      const {id, skill} = addSkill(skillGF, skillName)
      skills.set(id, skill)      
    } else {
      if(skillName.level >= 141 && skillName.level <= 170) {
        const skillGF2 = skillGFById.get(skillName.id+"_"+(skillName.level + 60))
        if (skillGF2) {
        const {id, skill} = addSkill(skillGF2, skillName)
        skills.set(id, skill)   
        }
      } else {
        if (skillName.id == 3010 && skillName.level == 7) {
          // хз что за скилл в ц4 и гф нет такого уровня
          const skillGF2 = skillGFById.get(3010+"_"+6)
        if (skillGF2) {
        const {id, skill} = addSkill(skillGF2, skillName)
        skills.set(id, skill)  
        }
      }
      
    }
  }
  }  

  return skills
}

function getIcons(deps: {skills: Map<string, Skill>}) {
  for (const skillGrp of loadSkillGrpC6()) {
    const skill = deps.skills.get(skillGrp.id+"_"+skillGrp.level);
    if (skill) {
      skill.icon = skillGrp.icon;
    }
  }

  return deps.skills
}

function getRuNames(deps: {skills: Map<string, Skill>}) {
   const skillNamesGF = new Map(loadSkillNamesGF().map((s) => [s.id+"_"+s.level, s]));

  for (const skill of deps.skills.values()) {
    const skillNameGF = skillNamesGF.get(skill.id+"_"+skill.level);
    if (skillNameGF) {
      skill.name.ru = skillNameGF.name.ru
    } else {
      if(skill.level! >= 141 && skill.level! <= 170) {
        const skillNameGF = skillNamesGF.get(skill.id+"_"+(skill.level!+60));
        if (skillNameGF) {
      skill.name.ru = skillNameGF.name.ru
    } else {
    }
      }
    }
  }

  return deps.skills
}


function addSkill(  skillData: SkillEntryGF,
  skillName: SkillNameEntry) {
    const id = skillName.id+"_"+skillName.level
  const skill: Skill = {
      id: skillName.id,
      skillName: skillData.skill_name.replace(" ", "_"),
      name: skillName.name,
      desc: skillName.desc,
      level: skillName.level,
      icon: "",
      operateType: skillData.operate_type,
      effect: JSON.stringify(skillData.effect),
      operateCond: JSON.stringify(skillData.operate_cond),
      effectTime: skillData.abnormal_time,
      castRange: skillData.cast_range ?? 0,
      hp_consume: skillData.hp_consume ?? 0,
      mp_consume1: skillData.mp_consume1 ?? 0,
      mp_consume2: skillData.mp_consume2 ?? 0,
      effectType:
        skillData.debuff === undefined
          ? undefined
          : skillData.debuff
          ? "debuff"
          : skillData.skill_name.search("song_") > 0 ||
            skillData.skill_name.search("dance_") > 0
          ? "song"
          : "buff",
    }

    return {id, skill}
}