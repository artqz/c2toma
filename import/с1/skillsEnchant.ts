import _ from 'lodash';
import { Skill, SkillEnchant } from '../../result/types';
import { Chronicle } from '../types';

export function loadSkillEnchants (deps: {
  chronicle: Chronicle;
  skills: Map<string, Skill>
}) {
  for (var key in Object.keys(CHANCE)) {
   
        console.log(key +" -> "+CHANCE[key].length);
        
     
  }
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
  return arr
//   return arr.reduce<SkillEnchant>((group, {skillId, enchantType, skillName}) => {   
//     group[skillId] = group[skillId] ?? {};  
//     group[skillId][enchantType] = group[skillId][enchantType] ?? [];  
//     group[skillId][enchantType].push({skillName});
//     return group;
// }, {});

  
}
const SKILL_ENCHANT_TYPES = ["power", "cost", "chance", "recovery", "time"]

const CHANCE: Record<number,number[]> = {
    76: [82,80,78,40,30,20,14,10,6,2,2,2,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0],
    77: [92,90,88,82,80,78,40,30,20,14,10,6,2,2,2,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
    78: [97,95,93,92,90,88,82,80,78,40,30,20,14,10,6,2,2,2,1,1,1,1,1,1,1,1,1,1,1,0],
    79: [99,99,99,97,95,93,92,90,88,82,80,78,40,30,20,14,10,6,2,2,2,1,1,1,1,1,1,1,1,1],
    80: [100,100,100,99,99,99,97,95,93,92,90,88,82,80,78,40,30,20,14,10,6,2,2,2,1,1,1,1,1,1],
}