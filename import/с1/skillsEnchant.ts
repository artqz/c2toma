import _ from 'lodash';
import { Skill, SkillEnchant } from '../../result/types';
import { Chronicle } from '../types';

export function loadSkillEnchants (deps: {
  chronicle: Chronicle;
  skills: Map<string, Skill>
}) {
  if (deps.chronicle === "c1", deps.chronicle === "c2", deps.chronicle === "c3") {
    return []
  }
  const list = new Map<string, {skillId: number, enchantType: string, skillName: string}>()
  const enchantSkills = Array.from(deps.skills.values()).filter(s => s.level != null && s.level >= 100)

  for (const enchantType of SKILL_ENCHANT_TYPES) {    
    for (const skill of enchantSkills) {
      if (skill.skillName.includes(`_${enchantType}_`)) {
        list.set(skill.skillName, {skillId: skill.id, enchantType: enchantType, skillName: skill.skillName})
      }      
    }
  }

  const arr = Array.from(list.values());
  
  return arr.reduce<SkillEnchant>((group, {skillId, enchantType, skillName}) => {   
    group[skillId] = group[skillId] ?? {};  
    group[skillId][enchantType] = group[skillId][enchantType] ?? [];  
    group[skillId][enchantType].push({skillName});
    return group;
}, {});

  
}
const SKILL_ENCHANT_TYPES = ["power", "cost", "chance", "recovery", "time"]