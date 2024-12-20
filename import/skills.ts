import { number, string } from "zod";
import { loadSkillGrpC2 } from "../datapack/c2/skillgrp";
import { loadSkillNamesC2 } from "../datapack/c2/skillnames";
import { SkillEnffect, loadSkillDataC4 } from "../datapack/c4/skilldata";
import { loadSkillGrpC4 } from "../datapack/c4/skillgrp";
import { loadSkillNamesC4 } from "../datapack/c4/skillnames";
import { loadSkillNamesGF } from "../datapack/gf/skillnames";
import { Skill } from "../result/types";
import { saveFile } from "../utils/Fs";
import { getEffects } from './с1/skillEffects';

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
      name: { en: skillC2?.name.trim() ?? "", ru: "" },
      desc: { en: skillC2?.desc?.trim() ?? "", ru: "" },
      level: skillC4.level,
      icon: "",
      operateType: skillC4.operate_type,
      effect: JSON.stringify(skillC4.effect),
      effects: getEffects(skillC4.effect.$),
      operateCond: JSON.stringify(skillC4.operate_cond),
      effectTime: skillC4.abnormal_time,
      castRange: skillC4.cast_range ?? 0,
      hp_consume: skillC4.hp_consume ?? 0,
      mp_consume1: skillC4.mp_consume1 ?? 0,
      mp_consume2: skillC4.mp_consume2 ?? 0,
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
    loadSkillGrpC4().map((skill) => [skill.id + "_" + skill.level, skill])
  );
  const skillsNew = new Map<string, Skill>();

  for (const skill of Array.from(skills.values())) {
    const grp = skillGrp.get(skill.id + "_" + skill.level);
    if (grp) {
      const icon = !skill.icon ? grp.icon.replace("icon.", "") : skill.icon;
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
    loadSkillNamesC4().map((skill) => [skill.id + "_" + skill.level, skill])
  );
  const skillByNameGF = new Map(
    loadSkillNamesGF().map((skill) => [skill.id + "_" + skill.level, skill])
  );
  const skillsNew = new Map<string, Skill>();

  for (const skill of Array.from(skills.values())) {
    const sName = skillNames.get(skill.id + "_" + skill.level);
    if (sName) {
      const name = !skill.name.en ? sName.name : skill.name.en;
      const desc = !skill.desc.en ? sName.desc : skill.desc.en;

      const gfName = skillByNameGF.get(skill.id + "_" + skill.level);
      if (gfName) {
        skillsNew.set(skill.id + "_" + skill.level, {
          ...skill,
          name: { en: name.trim() ?? "", ru: gfName.name.ru.trim() },
          desc: { en: desc.trim() ?? "", ru: desc.trim() ?? "" },
        });
      }
    }
  }
  return skillsNew;
}
