import { Skill } from "../result/types";
import { loadEffects } from "./effects";

export function getExistingSkills(deps: { skills: Map<string, Skill> }) {
  let skills = deps.skills;
  skills = loadEffects({ skills });
  return skills;
}
