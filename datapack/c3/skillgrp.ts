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
});

export function loadSkillIconsC3(): SkillGrpEntry[] {
  const skillsRaw = parseCsv(
    Fs.readFileSync("datapack/c3/skillgrp.txt", "utf8"),
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
