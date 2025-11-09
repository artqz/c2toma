import {
  ProfSkills as TomaSkill,
  loadProfsDataCT1,
} from "../../../datapack/ct1/profsdata";
import { Item, Prof, ProfSkill, Skill } from "../../../result/types";

export function generateProfsCT1(deps: {
  items: Map<number, Item>;
  skills: Map<string, Skill>;
}) {
  const profMap = new Map<string, Prof>();
  for (const prof of loadProfsDataCT1()) {
    profMap.set(prof.profName, {
      profName: prof.profName,
      parent: prof.parent,
      skills: getSkills({ ...deps, tomaSkills: prof.skills }),
    });
  }  
  return profMap;
}

function getSkills(deps: {
  items: Map<number, Item>;
  skills: Map<string, Skill>;
  tomaSkills: TomaSkill[];
}) {
  const skills: ProfSkill[] = [];
  for (const pSkill of deps.tomaSkills) {
    const skill = deps.skills.get(pSkill.skillID + "_" + pSkill.skillLevel);
    if (skill) {
      skills.push({
        skill: skill.id + "_" + skill.level,
        range: skill.castRange,
        operateType: skill.operateType ?? "A1",
        autoGet: pSkill.autoGet,
        getLv: pSkill.getLv,
        hp: pSkill.hp,
        mp: pSkill.mp,
        itemNeeded: pSkill.itemNeeded
          ? [
            {
              itemName: deps.items
                .get(pSkill.itemNeeded)!
                .itemName.replace(":", "_"),
              count: 1,
            },
          ]
          : [],
        lvUpSp: pSkill.lvUpSp,
        isMagic: pSkill.isMagic,
      });
    }
  }
  return skills;
}
