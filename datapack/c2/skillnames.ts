import Fs from "fs";
import { z } from "zod";

const SkillNameEntryC2 = z.object({
  t: z.enum(["skill"]),
  skill_id: z.number(),
  skill_level: z.number(),
  name: z.string(),
  desc: z.string().nullable(),
});

export type SkillNameEntryC2 = z.infer<typeof SkillNameEntryC2>;

export function loadSkillNamesJson(path: string): SkillNameEntryC2[] {
  const src = Fs.readFileSync(path, "utf8");
  const json = JSON.parse(src);
  let data = SkillNameEntryC2.array().parse(json);
  return data;
}

export function loadSkillNamesC2() {
  return loadSkillNamesJson("datapack/c2/skillname-e.txt.l2h.txt.json");
}
