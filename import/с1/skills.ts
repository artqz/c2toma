import { loadSkillDataC1 } from "../../datapack/c1/skilldata";
import { loadSkillGrpC1 } from "../../datapack/c1/skillgrp";
import { loadSkillNamesC1 } from "../../datapack/c1/skillnames";
import { loadSkillDataGF } from "../../datapack/gf/skilldata";
import { loadSkillIconsGF } from "../../datapack/gf/skillgrp";
import { loadSkillNamesGF } from "../../datapack/gf/skillnames";
import { Skill } from "../../result/types";
import { Chronicle } from "../types";

export function loadSkills(deps: { chronicle: Chronicle }) {
  let skills = loadItemData(deps);
  skills = loadSkillNames({ ...deps, skillData: skills });
  skills = loadSkillGrps({ ...deps, skillData: skills });
  skills = loadSkillRuNames({ ...deps, skillData: skills });
  console.log("Skills loaded.");

  return skills;
}

function loadItemData(deps: { chronicle: Chronicle }) {
  let skillData = [];
  switch (deps.chronicle) {
    case "c1":
      skillData = loadSkillDataC1();
      break;
    case "gf":
      skillData = loadSkillDataGF();
      break;
    default:
      skillData = loadSkillDataC1();
      break;
  }
  const skills = new Map<string, Skill>();

  for (const skill of skillData) {
    skills.set(skill.skill_id + "_" + skill.level, {
      id: skill.skill_id,
      skillName: skill.skill_name.toString().replace(/:|\s/g, "_"),
      name: { en: "", ru: "" },
      desc: { en: "", ru: "" },
      level: skill.level,
      icon: "",
      operateType: skill.operate_type,
      effect: "",
      operateCond: "",
      effectTime: skill.abnormal_time,
      // нет в ц1 (debuff)
      castRange: skill.cast_range ?? 0,
      hp_consume: skill.hp_consume ?? 0,
      mp_consume1: skill.mp_consume1 ?? 0,
      mp_consume2: skill.mp_consume2 ?? 0,
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
  switch (deps.chronicle) {
    case "c1":
      addNamesC1(deps);
      break;
    case "gf":
      addNamesGF(deps);
      break;
    default:
      addNamesC1(deps);
      break;
  }

  return deps.skillData;
}

function loadSkillGrps(deps: {
  chronicle: Chronicle;
  skillData: Map<string, Skill>;
}) {
  switch (deps.chronicle) {
    case "c1":
      addIconsC1(deps);
      break;
    case "gf":
      addIconsGF(deps);
      break;
    default:
      addIconsC1(deps);
      break;
  }

  return deps.skillData;
}

function loadSkillRuNames(deps: {
  chronicle: Chronicle;
  skillData: Map<string, Skill>;
}) {
  const skillData = deps.skillData;
  if (deps.chronicle === "c1") {
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
      const skillName = skillNamesGF.get(
        skillGF.skill_id + "_" + skillGF.level
      );
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
    // добиваем то, что не смогли найти
    const skillNamesByName = new Map(
      Array.from(skillNames.values()).map((s) => [
        s.skillName.replace(/[0-9]/g, ""),
        s,
      ])
    );
    for (const skill of skillData.values()) {
      if (skill.name.ru === skill.name.en) {
        const _skill = skillNamesByName.get(
          skill.skillName.replace(/[0-9]/g, "")
        );
        if (_skill) {
          skillData.set(skill.id + "_" + skill.level, {
            ...skill,
            name: { ...skill.name, ru: _skill.name.ru },
          });
        }
      }
    }
    for (const skill of skillData.values()) {
      if (skill.name.ru === skill.name.en) {
        let skillName;
        switch (skill.skillName) {
          case "s_strong_to_bow":
            skillName = "s_strong_to_bow_ex";
            break;
          case "s_strong_to_pdamage":
            skillName = "s_strong_to_pdamage_ex";
            break;
          case "s_strong_to_mdamage":
            skillName = "s_strong_to_mdamage_ex";
            break;
          default:
            skillName = skill.skillName.replace(/_greater|_crystal/, "");
            break;
        }
        const _skill = skillNames.get(skillName);
        if (_skill) {
          skillData.set(skill.id + "_" + skill.level, {
            ...skill,
            name: { ...skill.name, ru: _skill.name.ru },
          });
        }
      }
    }
  }

  return skillData;
}

function addNamesC1(deps: { skillData: Map<string, Skill> }) {
  for (const skillName of loadSkillNamesC1()) {
    const skill = deps.skillData.get(
      skillName.skill_id + "_" + skillName.skill_level
    );
    if (skill) {
      deps.skillData.set(skillName.skill_id + "_" + skillName.skill_level, {
        ...skill,
        name: { en: skillName.name, ru: skillName.name },
        desc: { en: skillName.desc, ru: skillName.desc },
      });
    }
  }
}

function addNamesGF(deps: { skillData: Map<string, Skill> }) {
  for (const skillName of loadSkillNamesGF()) {
    const skill = deps.skillData.get(skillName.id + "_" + skillName.level);
    if (skill) {
      deps.skillData.set(skillName.id + "_" + skillName.level, {
        ...skill,
        name: skillName.name,
        desc: skillName.desc,
      });
    }
  }
}

function addIconsC1(deps: { skillData: Map<string, Skill> }) {
  const skillData = deps.skillData;

  for (const skillGrp of loadSkillGrpC1()) {
    const skill = skillData.get(skillGrp.skill_id + "_" + skillGrp.skill_level);
    if (skill) {
      skillData.set(skillGrp.skill_id + "_" + skillGrp.skill_level, {
        ...skill,
        icon: skillGrp.icon.replace("icon.", ""),
      });
    }
  }
}

function addIconsGF(deps: { skillData: Map<string, Skill> }) {
  const skillData = deps.skillData;

  for (const skillGrp of loadSkillIconsGF()) {
    const skill = skillData.get(skillGrp.id + "_" + skillGrp.level);
    if (skill) {
      skillData.set(skillGrp.id + "_" + skillGrp.level, {
        ...skill,
        icon: skillGrp.icon.replace("icon.", ""),
      });
    }
  }
}
