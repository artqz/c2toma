import { loadSkillGrpC2 } from "../datapack/c2/skillgrp";
import { loadSkillNamesC2 } from "../datapack/c2/skillnames";
import { loadSkillDataC4 } from "../datapack/c4/skilldata";
import { Skill } from "../result/types";

export function loadSkills() {
  let skills: Map<string, Skill>;
  skills = loadC4Skills();
  skills = loadC2Icons(skills);
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
  for (const skillC2 of Array.from(skillnamesC2.values())) {
    const skillC4 = skillsC4.get(skillC2.skill_id + "_" + skillC2.skill_level);
    if (skillC4) {
      skills.set(skillC2.skill_id + "_" + skillC2.skill_level, {
        id: skillC4.skill_id,
        skillName: skillC4.skill_name,
        name: skillC2.name,
        desc: skillC2.desc ?? "",
        level: skillC4.level,
        icon: "",
        operateType: skillC4.operate_type,
      });
    }
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
    if (grp) {
      skillsNew.set(skill.id + "_" + skill.level, {
        ...skill,
        icon: grp.icon.replace("icon.", ""),
      });
    }
  }
  return skillsNew;
}
