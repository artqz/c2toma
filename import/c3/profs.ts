import { ProfSkillC3, loadProfDataC3 } from "../../datapack/c3/profdata";
import { Item, Prof, ProfSkill, Skill } from "../../result/types";

export const profSkillsC3 = new Map<string, Skill>();

export function loadProfsC3(deps: {
  items: Map<number, Item>;
  skills: Map<string, Skill>;
}) {
  const profMap = new Map<number, Prof>();
  const profs = loadProfDataC3();

  for (const prof of profs) {
    profMap.set(prof.id, {
      // id: prof.id,
      profName: prof.profName === "assassin" ? "assasin" : prof.profName,
      parent: prof.parent === "assassin" ? "assasin" : prof.profName,
      skills: getSkills({ ...deps, profSkills: prof.skills }),
    });
  }

  return profMap;
}

function isGroup(pet: ProfSkillC3): pet is { name: number; isGroup: boolean } {
  return (<{ name: number; isGroup: boolean }>pet).name !== undefined;
}

function getSkills(deps: {
  skills: Map<string, Skill>;
  items: Map<number, Item>;
  profSkills: ProfSkillC3[];
}) {
  const skillMap = new Map<string, ProfSkill>();
  const skillById = deps.skills;
  const itemById = deps.items;

  for (const pSkill of deps.profSkills) {
    if (!isGroup(pSkill)) {
      const skill = skillById.get(
        pSkill.skill.skillId + "_" + pSkill.skill.skillLevel
      );
      if (skill) {
        profSkillsC3.set(
          pSkill.skill.skillId + "_" + pSkill.skill.skillLevel,
          skill
        );
      }

      skillMap.set(pSkill.skill.skillId + "_" + pSkill.skill.skillLevel, {
        ...pSkill.skill,
        operateType:
          skillById.get(pSkill.skill.skillId + "_" + pSkill.skill.skillLevel)!
            .operateType ?? "null",
        skill: pSkill.skill.skillId + "_" + pSkill.skill.skillLevel,
        itemNeeded: pSkill.skill.itemNeeded
          ? [
              {
                itemName: itemById
                  .get(pSkill.skill.itemNeeded)!
                  .itemName.replace(":", "_"),
                count: 1,
              },
            ]
          : [],
      });
    }
  }

  return Array.from(skillMap.values());
}
