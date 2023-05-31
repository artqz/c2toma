import { loadSkillDataC1 } from "../../datapack/c1/skilldata";
import { loadSkillGrpC1 } from "../../datapack/c1/skillgrp";
import { loadSkillNamesC1 } from "../../datapack/c1/skillnames";
import { loadSkillDataGF } from "../../datapack/gf/skilldata";
import { SkillNameEntry, loadSkillNamesGF } from "../../datapack/gf/skillnames";
import { Skill, lstring } from "../../result/types";
import { Chronicle } from "../types";

export function loadSkills(deps: { chronicle: Chronicle }) {
  let skills = loadItemData(deps);
  skills = loadSkillNames({ ...deps, skillData: skills });
  skills = loadSkillGrps({ ...deps, skillData: skills });
  skills = loadSkillRuNames({ skillData: skills });
  console.log("Skills loaded.");

  return skills;
}

function loadItemData(deps: { chronicle: Chronicle }) {
  let skillData = [];
  switch (deps.chronicle) {
    case "c1":
      skillData = loadSkillDataC1();
      break;
    default:
      skillData = loadSkillDataC1();
      break;
  }
  const skills = new Map<string, Skill>();

  for (const skill of skillData) {
    skills.set(skill.skill_id + "_" + skill.level, {
      id: skill.skill_id,
      skillName: skill.skill_name.replace(" ", "_"),
      name: { en: "", ru: "" },
      desc: { en: "", ru: "" },
      level: skill.level,
      icon: "",
      operateType: skill.operate_type,
      effect: "",
      operateCond: "",
      effectTime: skill.abnormal_time,
      // нет в ц1
      effectType:
        skill.debuff === undefined
          ? undefined
          : skill.debuff
          ? "debuff"
          : skill.skill_name.search("song_") > 0 ||
            skill.skill_name.search("dance_") > 0
          ? "song"
          : "buff",
    });
  }

  return skills;
}

function loadSkillNames(deps: {
  chronicle: Chronicle;
  skillData: Map<string, Skill>;
}) {
  let skillNames = [];
  switch (deps.chronicle) {
    case "c1":
      skillNames = loadSkillNamesC1();
      break;
    default:
      skillNames = loadSkillNamesC1();
      break;
  }
  const skillData = deps.skillData;

  for (const skillName of skillNames) {
    const skill = skillData.get(
      skillName.skill_id + "_" + skillName.skill_level
    );
    if (skill) {
      skillData.set(skillName.skill_id + "_" + skillName.skill_level, {
        ...skill,
        name: { en: skillName.name, ru: skillName.name },
        desc: { en: skillName.desc, ru: skillName.desc },
      });
    }
  }

  return skillData;
}

function loadSkillGrps(deps: {
  chronicle: Chronicle;
  skillData: Map<string, Skill>;
}) {
  let skillGrps = [];
  switch (deps.chronicle) {
    case "c1":
      skillGrps = loadSkillGrpC1();
      break;
    default:
      skillGrps = loadSkillGrpC1();
      break;
  }
  const skillData = deps.skillData;

  for (const skillGrp of skillGrps) {
    const skill = skillData.get(skillGrp.skill_id + "_" + skillGrp.skill_level);
    if (skill) {
      skillData.set(skillGrp.skill_id + "_" + skillGrp.skill_level, {
        ...skill,
        icon: skillGrp.icon.replace("icon.", ""),
      });
    }
  }
  return skillData;
}

function loadSkillRuNames(deps: { skillData: Map<string, Skill> }) {
  const skillData = deps.skillData;
  const skillDataGF = new Map(
    loadSkillDataGF().map((npc) => [npc.skill_id, npc])
  );
  const skillNamesGF = new Map(loadSkillNamesGF().map((npc) => [npc.id, npc]));
  const skillNameByName = new Map<string, SkillNameEntry>();

  for (const skillGF of skillDataGF.values()) {
    const skillName = skillNamesGF.get(skillGF.skill_id);
    if (skillName) {
      skillNameByName.set(skillGF.skill_name, skillName);
    }
  }

  const testMap = new Map<
    string,
    { id: number; skillName: string; name: lstring }
  >();

  for (const skill of skillData.values()) {
    const _skill = skillNameByName.get(skill.skillName);

    if (_skill) {
      testMap.set(skill.skillName, {
        skillName: skill.skillName,
        id: skill.id,
        name: _skill.name,
      });
    }
  }
  console.log(testMap);
  for (const test of testMap.values()) {
    const skill = skillData.get;
  }
  return skillData;
}
