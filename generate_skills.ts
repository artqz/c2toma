import { loadNpcDataC4 } from './datapack/c4/npcdata';
import { loadSkillDataC4 } from './datapack/c4/skilldata';
import { loadNpcGrpC5 } from './datapack/c5/npcgrp';
import { loadNpcNamesC5 } from './datapack/c5/npcnames';
import { loadSkillGrpC5 } from './datapack/c5/skillgrp';
import { loadSkillNamesC5 } from './datapack/c5/skillnames';
import { loadNpcDataGF } from './datapack/gf/npcdata';
import { SkillEntryGF, loadSkillDataGF } from './datapack/gf/skilldata';
import { NpcNameEntry, NpcDataEntry } from './datapack/types';
import { Skill } from './result/types';


function init () {
  const skillByIdC4 = new Map(loadSkillDataC4().map(s => [s.skill_id+"_"+s.level, s]))
  const skillByIdGF= new Map(loadSkillDataGF().map(s => [s.skill_id+"_"+s.level, s]))
  const skills = new Map<string, Skill>()

  for (const skillGrp of loadSkillGrpC5()) {
    const skillC4 = skillByIdC4.get(skillGrp.id+"_"+ skillGrp.level)
    if (skillC4) {
      skills.set(skillGrp.id+"_"+ skillGrp.level, {
        id: skillGrp.id,
        skillName: skillC4.skill_name,
        level: skillGrp.level,
        name: {en: "", ru: ""},
        desc: {en: "", ru: ""},
        icon: skillGrp.icon,
        castRange: skillGrp.castRange,
        effect: JSON.stringify(skillC4.effect),
        effectTime: skillC4.abnormal_time,
        operateType: skillGrp.operType,
        effectType: skillC4.debuff === undefined
          ? undefined
          : skillC4.debuff
          ? "debuff"
          : skillC4.skill_name.search("song_") > 0 ||
            skillC4.skill_name.search("dance_") > 0
          ? "song"
          : "buff",
        hp_consume: skillGrp.hpConsume,
        mp_consume1: skillGrp.mpConsume,
        operateCond: JSON.stringify(skillC4.operate_cond),
        mp_consume2: 0
      })     
    }
    else {
      const skillGF = skillByIdGF.get(skillGrp.id+"_"+ skillGrp.level)
      if (skillGF) {
        skills.set(skillGrp.id+"_"+ skillGrp.level, {
        id: skillGrp.id,
        skillName: skillGF.skill_name,
        level: skillGrp.level,
        name: {en: "", ru: ""},
        desc: {en: "", ru: ""},
        icon: skillGrp.icon,
        castRange: skillGrp.castRange,
        effect: JSON.stringify(skillGF.effect),
        effectTime: skillGF.abnormal_time,
        operateType: skillGrp.operType,
        effectType: skillGF.debuff === undefined
          ? undefined
          : skillGF.debuff
          ? "debuff"
          : skillGF.skill_name.search("song_") > 0 ||
            skillGF.skill_name.search("dance_") > 0
          ? "song"
          : "buff",
        hp_consume: skillGrp.hpConsume,
        mp_consume1: skillGrp.mpConsume,
        operateCond: JSON.stringify(skillGF.operate_cond),
        mp_consume2: 0
      })     
      }
    }
  }
  console.log(loadSkillGrpC5().length, Array.from(skills.values()).length);
  
  
}






init()