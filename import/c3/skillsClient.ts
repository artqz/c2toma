import { loadSkillNamesC3 } from "../../datapack/c3/skillnames";
import { Skill } from "./../../result/types";

export function getSkillsClientC3(deps: { skills: Map<string, Skill> }) {
  // const skillsById = new Map(
  //   Array.from(deps.skills.values()).map((s) => [s.id + "_" + s.level, s])
  // );

  const skillsC3 = new Map<string, Skill>();

  for (const _skill of loadSkillNamesC3()) {
    const skill = deps.skills.get(_skill.id + "_" + _skill.level);
    if (skill) {
      skillsC3.set(skill.id + "_" + skill.level, skill);
    }
  }
  return skillsC3;
}
