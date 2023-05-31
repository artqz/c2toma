import Fs from "fs";
import { z } from "zod";

const SkillEntryGF = z.object({
  skill_id: z.number(),
  skill_name: z.string(),
  level: z.number(),
  operate_type: z.string(),
});

export type SkillEntryGF = z.infer<typeof SkillEntryGF>;

function loadSkillataJson(path: string): SkillEntryGF[] {
  const src = Fs.readFileSync(path, "utf8");
  const json = JSON.parse(src);
  let data = SkillEntryGF.array().parse(json);

  return data;
}

export function loadSkillDataGF() {
  return loadSkillataJson("datapack/gf/skilldata.txt.l2h.json");
}
