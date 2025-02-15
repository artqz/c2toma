import { loadSkillDataC1 } from "../../datapack/c1/skilldata";
import { loadSkillGrpC1 } from "../../datapack/c1/skillgrp";
import { loadSkillNamesC1 } from "../../datapack/c1/skillnames";
import { loadSkillDataC4 } from "../../datapack/c4/skilldata";
import { loadSkillGrpC4 } from "../../datapack/c4/skillgrp";
import { loadSkillNamesC4 } from "../../datapack/c4/skillnames";
import { loadSkillNamesC5 } from "../../datapack/c5/skillnames";
import { loadSkillDataGF } from "../../datapack/gf/skilldata";
import { loadSkillIconsGF } from "../../datapack/gf/skillgrp";
import { loadSkillNamesGF } from "../../datapack/gf/skillnames";
import { loadSkillDataIL } from "../../datapack/il/skilldata";
import { loadSkillGrpIL } from "../../datapack/il/skillgrp";
import { loadSkillNamesIL } from "../../datapack/il/skillnames";
import { Skill } from "../../result/types";
import { saveFile } from '../../utils/Fs';
import { Chronicle } from "../types";
import { generateSkillDataC5 } from "./c5/skills";
import { getEffects } from './skillEffects';

export function loadSkills(deps: { chronicle: Chronicle }) {
  let { skills, effects } = loadItemData(deps);
  skills = loadSkillNames({ ...deps, skillData: skills });
  skills = loadSkillGrps({ ...deps, skillData: skills });
  skills = loadSkillRuNames({ ...deps, skillData: skills });
  console.log(`Skills loaded (${Array.from(skills.values()).length}).`);

  return { skills, effects };
}

function loadItemData(deps: { chronicle: Chronicle }) {
  let skillData = [];
  switch (deps.chronicle) {
    case "c1":
      skillData = loadSkillDataC1();
      break;
    case "c4":
      skillData = loadSkillDataC4();
      break;
    case "c5":
      skillData = generateSkillDataC5();
      break;
    case "il":
      skillData = loadSkillDataIL();
      break;
    case "gf":
      skillData = loadSkillDataGF();
      break;
    default:
      skillData = loadSkillDataC1();
      break;
  }
  const skills = new Map<string, Skill>();
  const effects = new Map<string, any>();
  const _effectsMap = new Map<string, string>()
  for (const skill of skillData) {
    // if (skill.skill_id === 4084 && skill.level === 4) {

    //   getEffects(skill.effect.$)
    // }

    // getAllEffects(skill.effect.$).map(e => _effectsMap.set(e, e))   
    effects.set(skill.skill_name.toString().replace(/:|\s/g, "_"), skill.effect.$)

    skills.set(skill.skill_id + "_" + skill.level, {
      id: skill.skill_id,
      skillName: skill.skill_name.toString().replace(/:|\s/g, "_"),
      name: { en: "", ru: "" },
      desc: { en: "", ru: "" },
      level: skill.level,
      icon: "",
      operateType: skill.operate_type.toUpperCase(),
      effect: "",
      effects: getEffects(skill.effect.$),
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
      effectJson: JSON.stringify(skill.effect, null, 2),
      operateCondJson: JSON.stringify(skill.operate_cond, null, 2),
    });
  }
  // saveFile("allEffects.json", JSON.stringify(Array.from(_effectsMap.values()), null, 2))
  return { skills, effects };
}

function loadSkillNames(deps: {
  chronicle: Chronicle;
  skillData: Map<string, Skill>;
}) {
  switch (deps.chronicle) {
    case "c1":
      addNamesC1(deps);
      break;
    case "c4":
      addNamesC4(deps);
      break;
    case "c5":
      addNamesC5(deps);
      break;
    case "il":
      addNamesIL(deps);
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
    case "c4":
      addIconsC4(deps);
      break;
    case "c5":
      addIconsC5(deps);
      break;
    case "il":
      addIconsIL(deps);
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
  if (
    deps.chronicle === "c1" ||
    deps.chronicle === "c4" ||
    deps.chronicle === "il"
  ) {
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
        desc: { en: skillName.desc.trim(), ru: skillName.desc.trim() },
      });
    }
  }
}

function addNamesC4(deps: { skillData: Map<string, Skill> }) {
  for (const skillName of loadSkillNamesC4()) {
    const skill = deps.skillData.get(skillName.id + "_" + skillName.level);
    if (skill) {
      deps.skillData.set(skillName.id + "_" + skillName.level, {
        ...skill,
        name: { en: skillName.name, ru: skillName.name },
        desc: { en: skillName.desc.trim(), ru: skillName.desc.trim() },
      });
    }
  }
}

function addNamesC5(deps: { skillData: Map<string, Skill> }) {
  for (const skillName of loadSkillNamesC5()) {
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

function addNamesIL(deps: { skillData: Map<string, Skill> }) {
  for (const skillName of loadSkillNamesIL()) {
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

function addIconsC4(deps: { skillData: Map<string, Skill> }) {
  const skillData = deps.skillData;

  for (const skillGrp of loadSkillGrpC4()) {
    const skill = skillData.get(skillGrp.id + "_" + skillGrp.level);
    if (skill) {
      skillData.set(skillGrp.id + "_" + skillGrp.level, {
        ...skill,
        icon: skillGrp.icon.replace("icon.", ""),
      });
    }
  }
}

function addIconsC5(deps: { skillData: Map<string, Skill> }) {
  const skillData = deps.skillData;

  for (const skillGrp of loadSkillGrpIL()) {
    const skill = skillData.get(skillGrp.id + "_" + skillGrp.level);
    if (skill) {
      skillData.set(skillGrp.id + "_" + skillGrp.level, {
        ...skill,
        icon: skillGrp.icon,
      });
    }
  }
}

function addIconsIL(deps: { skillData: Map<string, Skill> }) {
  const skillData = deps.skillData;

  for (const skillGrp of loadSkillGrpIL()) {
    const skill = skillData.get(skillGrp.id + "_" + skillGrp.level);
    if (skill) {
      skillData.set(skillGrp.id + "_" + skillGrp.level, {
        ...skill,
        icon: skillGrp.icon,
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


function getAllEffects(effects: any) {
  const arr: string[] = []
  if (effects) {
    for (const effect of effects) {
      const effectName: string = effect.$[0];
      arr.push(effectName)
    }
  }
  return arr
}