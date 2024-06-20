import { loadSkillIconsC3 } from "../../datapack/c3/skillgrp";
import { loadSkillNamesC3 } from "../../datapack/c3/skillnames";
import { loadSkillDataC4 } from "../../datapack/c4/skilldata";
import { loadSkillGrpC4 } from "../../datapack/c4/skillgrp";
import { loadSkillNamesC4 } from "../../datapack/c4/skillnames";
import { loadSkillDataGF } from "../../datapack/gf/skilldata";
import { loadSkillNamesGF } from "../../datapack/gf/skillnames";
import { Skill } from "../../result/types";
import { getEffects } from '../с1/skillEffects';

export function loadAllSkillsC3() {
  let skills: Map<string, Skill>;
  skills = loadC4Skills();
  skills = loadC2Icons(skills);
  skills = loadC4Icons(skills);
  skills = loadC4Names(skills);
  skills = loadSkillRuNames({ skillData: skills });
  console.log("Skills loaded.");

  return skills;
}

function loadC4Skills() {
  const skillNamesC3 = new Map(
    loadSkillNamesC3().map((skill) => [skill.id + "_" + skill.level, skill])
  );

  const skillsC4 = new Map(
    loadSkillDataC4().map((skill) => [
      skill.skill_id + "_" + skill.level,
      skill,
    ])
  );
  const skills = new Map<string, Skill>();

  for (const skillC4 of Array.from(skillsC4.values())) {
    const skillC3 = skillNamesC3.get(skillC4.skill_id + "_" + skillC4.level);
    // if (skillC4) {
    skills.set(skillC4.skill_id + "_" + skillC4.level, {
      id: skillC4.skill_id,
      skillName: skillC4.skill_name.replace(" ", "_"),
      name: { en: skillC3?.name.trim() ?? "", ru: skillC3?.name.trim() ?? "" },
      desc: {
        en: skillC3?.desc?.trim() ?? "",
        ru: skillC3?.desc?.trim() ?? "",
      },
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
    loadSkillIconsC3().map((skill) => [skill.id + "_" + skill.level, skill])
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
      const icon = !skill.icon ? grp.icon : skill.icon;
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

  const skillsNew = new Map<string, Skill>();

  for (const skill of Array.from(skills.values())) {
    const sName = skillNames.get(skill.id + "_" + skill.level);
    if (sName) {
      const name = !skill.name.en ? sName.name : skill.name.en;
      const desc = !skill.desc.en ? sName.desc : skill.desc.en;

      skillsNew.set(skill.id + "_" + skill.level, {
        ...skill,
        name: { en: name.trim() ?? "", ru: name.trim() ?? "" },
        desc: { en: desc.trim() ?? "", ru: desc.trim() ?? "" },
      });
    }
  }
  return skillsNew;
}

function loadSkillRuNames(deps: { skillData: Map<string, Skill> }) {
  const skillData = deps.skillData;

  const skillDataGF = new Map(
    loadSkillDataGF().map((skill) => [
      skill.skill_id + "_" + skill.level,
      skill,
    ])
  );
  const skillNamesGF = new Map(
    loadSkillNamesGF().map((skill) => [skill.id + "_" + skill.level, skill])
  );
  const skillNames = new Map<
    string,
    {
      id: number;
      skillName: string;
      level: number;
      name: { en: string; ru: string };
      desc: { en: string; ru: string };
    }
  >();

  for (const skillGF of skillDataGF.values()) {
    const skillName = skillNamesGF.get(skillGF.skill_id + "_" + skillGF.level);
    if (skillName) {
      skillNames.set(skillGF.skill_name, {
        ...skillName,
        skillName: skillGF.skill_name,
      });
    }
  }

  for (const skill of skillData.values()) {
    const _skill = skillNames.get(skill.skillName);
    if (_skill) {
      skillData.set(skill.id + "_" + skill.level, {
        ...skill,
        name: { ...skill.name, ru: _skill.name.ru },
      });
    }
  }

  return skillData;
}
