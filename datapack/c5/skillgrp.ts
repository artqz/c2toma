import { parse as parseCsv } from "csv-parse/sync";
import Fs from "fs";
import { z } from "zod";

const operType = {
  0: "A1",
  1: "A2",
  2: "A3",
  3: "T",
}

type SkillGrpEntry = {
  id: number;
  level: number;
  icon: string;
  operType: string;
  hpConsume: number;
  mpConsume: number;
  castRange: number;
  castStyle: number;
  hitTime: number;
  isMagic: number;
  aniChar: string;
  desc: string;	
  extraEff: number;		
  isEnch: number;
  enchSkillId: number;			
  unk0: number;		
  unk1: number;
};

const SkillGrpItem = z.object({
  skill_id: z.string(),
  skill_level: z.string(),
  icon_name: z.string(),
  //  
  oper_type: z.string(),
  hp_consume: z.string(),
  mp_consume: z.string(),
  cast_range: z.string(),
  cast_style: z.string(),
  //
  hit_time: z.string(), //skill_hit_time
  is_magic: z.string(),	
  ani_char: z.string(),	
  desc: z.string(),	
  extra_eff: z.string(),		
  is_ench: z.string(),		
  ench_skill_id: z.string(),			
  UNK_0: z.string(),		
  UNK_1: z.string(),	
});

export function loadSkillGrpC5(): SkillGrpEntry[] {
  const skillsRaw = parseCsv(
    Fs.readFileSync("datapack/c5/skillgrp.txt", "utf8"),
    { delimiter: "\t", relaxQuotes: true, columns: true, bom: true }
  );
  
  const skills = SkillGrpItem.array().parse(skillsRaw);  

  return skills
  .filter(x => x.skill_id < "50000") // тома пидор (убираем дроп и спойл из скилзов)
  .map((x) => {        
    return {
      id: parseInt(x.skill_id),
      level: parseInt(x.skill_level),
      icon: x.icon_name.replace("icon.", ""),
      operType: operType[x.oper_type as "0" | "1" | "2" | "3"],
      hpConsume: parseInt(x.hp_consume),
      mpConsume: parseInt(x.mp_consume),
      castRange: parseInt(x.cast_range),
      castStyle: parseInt(x.cast_style),
      hitTime: parseInt(x.hit_time),
      isMagic: parseInt(x.is_magic),
      aniChar: x.ani_char,
      desc: x.desc,	
      extraEff: parseInt(x.extra_eff),		
      isEnch: parseInt(x.is_ench),		
      enchSkillId: parseInt(x.ench_skill_id),			
      unk0: parseInt(x.UNK_0),		
      unk1: parseInt(x.UNK_1),
    };   
  });  
}