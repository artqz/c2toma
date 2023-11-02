import { ProfSkills as TomaSkill, loadProfsDataC5 } from '../../../datapack/c5/profsdata';
import { Item, Prof, ProfSkill, Skill } from '../../../result/types';

export function generateProfsC5(deps: {items: Map<number, Item>;
  skills: Map<string, Skill>;
}) {
  const profMap = new Map<string, Prof>()
  for (const prof of loadProfsDataC5()) {
    profMap.set(prof.profName, {profName: prof.profName, parent: prof.parent, skills: getSkills({...deps, tomaSkills: prof.skills})})
  }
  return profMap
}

function getSkills(deps: {
  items: Map<number, Item>;
  skills: Map<string, Skill>;
  tomaSkills: TomaSkill[]
}){
  const skills: ProfSkill[] = []
  for (const pSkill of deps.tomaSkills) {
    const skill = deps.skills.get(pSkill.skillID+"_"+pSkill.skillLevel)
    if (skill) {
      skills.push({skillName: skill.skillName, skillLevel: skill.level ?? 1, range: skill.castRange, operateType: skill.operateType ?? "A1", autoGet: pSkill.autoGet, getLv: pSkill.getLv, hp: pSkill.hp, mp: pSkill.mp, itemNeeded: pSkill.itemNeeded ? [
              {
                itemName: deps.items
                  .get(pSkill.itemNeeded)!
                  .itemName.replace(":", "_"),
                count: 1,
              },
            ]
          : [], lvUpSp: pSkill.lvUpSp, isMagic: pSkill.isMagic })
    }    
  }
  return skills
}