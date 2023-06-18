import { Skill } from "../../result/types";
import { loadEffects } from "../effects";

export function getExistingSkillsC3(deps: { skills: Map<string, Skill> }) {
  let skills = deps.skills;
  skills = loadEffects({ skills });
  return skills;
}
