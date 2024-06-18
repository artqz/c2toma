import { loadSkillDataC4 } from "../../../datapack/c4/skilldata";
import { loadSkillGrpC5 } from "../../../datapack/c5/skillgrp";
import { loadSkillDataGF } from "../../../datapack/gf/skilldata";
import { SkillEntry } from "../../../datapack/types";

export function generateSkillDataC5() {
  const skillByIdC4 = new Map(
    loadSkillDataC4().map((s) => [s.skill_id + "_" + s.level, s])
  );
  const skillByIdGF = new Map(
    loadSkillDataGF().map((s) => [s.skill_id + "_" + s.level, s])
  );
  const skills: SkillEntry[] = [];

  for (const skillGrp of loadSkillGrpC5()) {
    const skillC4 = skillByIdC4.get(skillGrp.id + "_" + skillGrp.level);

    if (skillC4 && !skillC4.skill_name.includes("s_not_used")) {
      skills.push({
        skill_id: skillGrp.id,
        level: skillGrp.level,
        skill_name: skillC4.skill_name,
        effect: skillC4.effect,        
        operate_type: skillGrp.operType,
        abnormal_time: skillC4.abnormal_time,
        cast_range: skillGrp.castRange,
        debuff: skillC4.debuff,
        effect_point: skillC4.effect_point,
        hp_consume: skillGrp.hpConsume,
        mp_consume1: 0,
        mp_consume2: skillGrp.mpConsume,
        operate_cond: skillC4.operate_cond,
      });
    } else {
      const skillGF = skillByIdGF.get(skillGrp.id + "_" + skillGrp.level);
      if (skillGF) {
        skills.push({
          skill_id: skillGrp.id,
          level: skillGrp.level,
          skill_name: skillGF.skill_name,
          effect: skillGF.effect,
          operate_type: skillGrp.operType,
          abnormal_time: skillGF.abnormal_time,
          cast_range: skillGrp.castRange,
          debuff: skillGF.debuff,
          effect_point: skillGF.effect_point,
          hp_consume: skillGrp.hpConsume,
          mp_consume1: 0,
          mp_consume2: skillGrp.mpConsume,
          operate_cond: skillGF.operate_cond,
        });
      }
    }
  }
  return skills;
}
