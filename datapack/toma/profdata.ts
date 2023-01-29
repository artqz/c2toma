import Fs from "fs";
import { z } from "zod";
import { getFiles } from "../../utils/Fs";

const ProfSkill = z.object({
  skillId: z.number(),
  skillLevel: z.number(),
  isMagic: z.boolean(),
  operateType: z.number(),
  getLv: z.number(),
  lvUpSp: z.number(),
  autoGet: z.boolean(),
  itemNeeded: z.number(),
  hp: z.number(),
  mp: z.number(),
  range: z.number(),
});

export type ProfSkill = z.infer<typeof ProfSkill>;

const ProfEntryToma = z.object({
  id: z.number(),
  profName: z.string(),
  parent: z.string().nullable(),
  skills: z.array(ProfSkill),
});

export type ProfEntryToma = z.infer<typeof ProfEntryToma>;

export function loadProfDataJson(path: string): ProfEntryToma {
  const src = Fs.readFileSync(path, "utf8");
  const json = JSON.parse(src);

  let data = ProfEntryToma.parse(json);

  return data;
}

export function loadProfData() {
  const profs: ProfEntryToma[] = [];
  const files = getFiles("datapack/toma/classes", ".json");
  for (const f of files) {
    if (f !== "races.json") {
      const data = loadProfDataJson(`datapack/toma/classes/${f}`);
      profs.push(data);
    }
  }
  return profs;
}
