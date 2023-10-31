import { parse as parseCsv } from "csv-parse/sync";
import Fs from "fs";
import { z } from "zod";

type SkillGrpEntry = {
  id: number;
  level: number;
  icon: string;
};

const SkillGrpItem = z.object({
  skill_id: z.string(),
  skill_level: z.string(),
  icon_name: z.string(),
  //  
  oper_type: z.number(),
  operate_type: z.string(),
  abnormal_time: z.number().optional(),

  effect_point: z.number().optional(), //aggro point
  hp_consume: z.string(),
  mp_consume: z.string(),
  cast_range: z.string(),
  //
  hit_time: z.string(), //skill_hit_time
});

export function loadSkillGrpC5(): SkillGrpEntry[] {
  const skillsRaw = parseCsv(
    Fs.readFileSync("datapack/c5/skillgrp.txt", "utf8"),
    { delimiter: "\t", relaxQuotes: true, columns: true, bom: true }
  );

  const skills = SkillGrpItem.array().parse(skillsRaw);

  return skills.map((x) => {
    return {
      id: parseInt(x.skill_id),
      level: parseInt(x.skill_level),
      icon: x.icon_name.replace("icon.", ""),
    };
  });
}
