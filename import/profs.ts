import {
  loadProfData,
  ProfSkill as ProfSkillToma,
} from "../datapack/toma/profdata";
import { Item, Prof, Skill, ProfSkill } from "../result/types";

export const profSkills = new Map<string, Skill>();

export function loadProfs(deps: {
  items: Map<number, Item>;
  skills: Map<string, Skill>;
}) {
  const profMap = new Map<number, Prof>();
  const profs = loadProfData();

  for (const prof of profs) {
    if (prof.id === 23) {
      console.log(prof.profName, prof.parent);
    }

    let profName = prof.profName;
    let parent = prof.parent;
    if (profName === "assassin") profName = "assasin";
    if (profName === "plains_walker") profName = "plain_walker";
    if (parent === "assassin") parent = "assasin";
    if (parent === "plains_walker") parent = "plain_walker";

    profMap.set(prof.id, {
      // id: prof.id,
      profName,
      parent,
      skills: getSkills({ ...deps, profSkills: prof.skills }),
    });
  }

  return profMap;
}

function getSkills(deps: {
  skills: Map<string, Skill>;
  items: Map<number, Item>;
  profSkills: ProfSkillToma[];
}) {
  const skillMap = new Map<string, ProfSkill>();
  const skillById = deps.skills;
  const itemById = deps.items;

  for (const pSkill of deps.profSkills) {
    const skill = skillById.get(pSkill.skillId + "_" + pSkill.skillLevel);
    if (skill) {
      profSkills.set(pSkill.skillId + "_" + pSkill.skillLevel, skill);
    }

    skillMap.set(pSkill.skillId + "_" + pSkill.skillLevel, {
      ...pSkill,
      operateType:
        skillById.get(pSkill.skillId + "_" + pSkill.skillLevel)!.operateType ??
        "null",
      skill: pSkill.skillId + "_" + pSkill.skillLevel,
      itemNeeded: pSkill.itemNeeded
        ? [
            {
              itemName: itemById
                .get(pSkill.itemNeeded)!
                .itemName.replace(":", "_"),
              count: 1,
            },
          ]
        : [],
    });
  }

  return Array.from(skillMap.values());
}
