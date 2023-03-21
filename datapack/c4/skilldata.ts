import Fs from "fs";
import { z } from "zod";

const SkillEntryC4 = z.object({
  skill_name: z.string(),
  skill_id: z.number(),
  level: z.number(),
  operate_type: z.string(),
  abnormal_time: z.number().optional(),
  debuff: z.number().optional(),
});

export type SkillEntryC4 = z.infer<typeof SkillEntryC4>;

export function loadSkillDataJson(path: string): SkillEntryC4[] {
  const src = Fs.readFileSync(path, "utf8");
  const json = JSON.parse(src);
  let data = SkillEntryC4.array().parse(json);

  return data;
}

export function loadSkillDataC4() {
  return loadSkillDataJson("datapack/c4/skilldata.l2h.json");
}
