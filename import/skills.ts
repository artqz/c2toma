import { loadSkillGrpC2 } from "../datapack/c2/skillgrp";
import { loadSkillNamesC2 } from "../datapack/c2/skillnames";
import { loadSkillDataC4 } from "../datapack/c4/skilldata";
import { loadSkillGrpC4 } from '../datapack/c4/skillgrp';
import { loadSkillNamesC4 } from '../datapack/c4/skillnames';
import { Skill } from "../result/types";

export function loadSkills() {
  let skills: Map<string, Skill>;
  skills = loadC4Skills();
  skills = loadC2Icons(skills);
  skills = loadC4Icons(skills);
  skills = loadC4Names(skills);
  console.log("Skills loaded.");

  return skills;
}

function loadC4Skills() {
  const skillnamesC2 = new Map(
    loadSkillNamesC2().map((skill) => [
      skill.skill_id + "_" + skill.skill_level,
      skill,
    ])
  );

  const skillsC4 = new Map(
    loadSkillDataC4().map((skill) => [
      skill.skill_id + "_" + skill.level,
      skill,
    ])
  );
  const skills = new Map<string, Skill>();
  // for (const skillC2 of Array.from(skillnamesC2.values())) {
  for (const skillC4 of Array.from(skillsC4.values())) {  
    // const skillC4 = skillsC4.get(skillC2.skill_id + "_" + skillC2.skill_level);
        const skillC2 = skillnamesC2.get(skillC4.skill_id + "_" + skillC4.level);
    // if (skillC4) {
      skills.set(skillC4.skill_id + "_" + skillC4.level, {
        id: skillC4.skill_id,
        skillName: skillC4.skill_name.replace(" ", "_"),
        name: skillC2?.name ?? "",
        desc: skillC2?.desc ?? "",
        level: skillC4.level,
        icon: "",
        operateType: skillC4.operate_type,
        effectTime: skillC4.abnormal_time,
        effectType:
          skillC4.debuff === undefined
            ? undefined
            : skillC4.debuff
            ? "debuff"
            : skillC4.skill_name.search("song_") > 0 ||
              skillC4.skill_name.search("dance_") > 0
            ? "song"
            : "buff",
      });
    
  }
  
  return skills;
}

function loadC2Icons(skills: Map<string, Skill>) {
  const skillGrp = new Map(
    loadSkillGrpC2().map((skill) => [
      skill.skill_id + "_" + skill.skill_level,
      skill,
    ])
  );
  const skillsNew = new Map<string, Skill>();

  for (const skill of Array.from(skills.values())) {
    const grp = skillGrp.get(skill.id + "_" + skill.level);
    
      skillsNew.set(skill.id + "_" + skill.level, {
        ...skill,
        icon: grp?.icon.replace("icon.", "") ?? "",
      });
    
  }
  return skillsNew;
}

function loadC4Icons(skills: Map<string, Skill>) {
  const skillGrp = new Map(
    loadSkillGrpC4().map((skill) => [
      skill.id + "_" + skill.level,
      skill,
    ])
  );
  const skillsNew = new Map<string, Skill>();

  for (const skill of Array.from(skills.values())) {      
      const grp = skillGrp.get(skill.id + "_" + skill.level);
      if (grp) {
        const icon = !skill.icon ? grp.icon.replace("icon.", "") : skill.icon
        skillsNew.set(skill.id + "_" + skill.level, {
        ...skill,
        icon: icon ?? "",
      });
      } 
  }
  return skillsNew;
}

function loadC4Names(skills: Map<string, Skill>) {
  const skillNames = new Map(
    loadSkillNamesC4().map((skill) => [
      skill.id + "_" + skill.level,
      skill,
    ]))
  const skillsNew = new Map<string, Skill>();

  for (const skill of Array.from(skills.values())) {
      
      const sName = skillNames.get(skill.id + "_" + skill.level);
      if (sName) {
        const name = !skill.name ? sName.name : skill.name
        const desc = !skill.desc ? sName.desc : skill.desc

        skillsNew.set(skill.id + "_" + skill.level, {
        ...skill,
        name: name ?? "",
        desc: desc ?? "",
      });
      }    
  }
  return skillsNew;
}