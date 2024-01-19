import { Skill } from '../../../result/types';

export function getSkills(deps: {
  list: string[];
  skills: Map<string, Skill>;
  ai: [string, ...unknown[]];
}) {
  const npcSkillList: string[] = [];
  for (const npcSkill of deps.list) {
    const skill = deps.skills.get(npcSkill.replace("@", ""));
    if (skill) {
      npcSkillList.push(skill.id + "_" + skill.level);
    }
  }
  for (const ai of deps.ai) {
    if (typeof ai === "object") {
      if (ai) {
        const npcSkill: string = Object.values(ai)[0].toString();
        if (npcSkill.includes("@s_")) {
          const skill = deps.skills.get(npcSkill.replace("@", ""));
          if (skill) {
            npcSkillList.push(skill.id + "_" + skill.level);
          }
        }
      }
    }
  }
  return npcSkillList;
}