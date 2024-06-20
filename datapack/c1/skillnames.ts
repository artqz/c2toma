import Fs from "fs";
import { z } from "zod";

const SkillNameEntryC1 = z.object({
  skill_id: z.number(),
  skill_level: z.number(),
  name: z.string(),
  desc: z.string(),
});

export type SkillNameEntryC1 = z.infer<typeof SkillNameEntryC1>;

function loadSkillNamesJson(path: string): SkillNameEntryC1[] {
  const src = Fs.readFileSync(path, "utf8");
  const json = JSON.parse(src);
  let data = SkillNameEntryC1.array().parse(json);
  return data;
}

export function loadSkillNamesC1() {
  return loadSkillNamesJson("datapack/c1/skillname-e.txt.l2h.json");
}
