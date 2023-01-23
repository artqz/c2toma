import Fs from "fs";
import { z } from "zod";

const SkillGrp = z.object({
  skill_id: z.number(),
  skill_level: z.number(),
  icon: z.string(),
});

export type SkillGrp = z.infer<typeof SkillGrp>;

const soursec = [
  "armorgrp.l2h.json",
  "etcitemgrp.l2h.json",
  "weapongrp.l2h.json",
];

export function loadSkillGrpJson(path: string): SkillGrp[] {
  const src = Fs.readFileSync(path, "utf8");
  const json = JSON.parse(src);
  let data = SkillGrp.array().parse(json);
  return data;
}

export function loadSkillGrpC2() {
  return loadSkillGrpJson(`datapack/c2/skillgrp.txt.l2h.txt.json`);
}
