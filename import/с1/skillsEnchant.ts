import { Skill } from '../../result/types';

export function loadSkillEnchants (deps: {
  skills: Map<string, Skill>
}) {
  const enchantSkills = Array.from(deps.skills.values()).filter(s => s.level != null && s.level >= 100)
  for (const enchantType of SKILL_ENCHANT_TYPES) {
    for (const skill of enchantSkills) {
      if (skill.skillName.includes(`_${enchantType}_`)) {
        
      }
      else console.log("----------- Нет такого энчанта "+skill.skillName);
      
    }
  }
}
const SKILL_ENCHANT_TYPES = ["power", "cost", "chance", "recovery", "time"]