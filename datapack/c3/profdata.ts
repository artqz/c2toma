import Fs from "fs";
import { z } from "zod";
import { getFiles } from "../../utils/Fs";

// {
//   "name": 40,
//   "isGroup": true
// },
// {
//   "skill": {
//     "skillId": 239,
//     "skillLevel": 2,
//     "isMagic": false,
//     "operateType": 3,
//     "getLv": 40,
//     "lvUpSp": 0,
//     "autoGet": true,
//     "itemNeeded": 0,
//     "hp": 0,
//     "mp": 0,
//     "range": 0
//   }
// },

const ProfSkillC3 = z.union([
  z.object({ name: z.number(), isGroup: z.boolean() }),
  z.object({
    skill: z.object({
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
    }),
  }),
]);
export type ProfSkillC3 = z.infer<typeof ProfSkillC3>;

const ProfEntryTomaC3 = z.object({
  id: z.number(),
  profName: z.string(),
  parent: z.string().nullable(),
  skills: z.array(ProfSkillC3),
});

export type ProfEntryTomaC3 = z.infer<typeof ProfEntryTomaC3>;

export function loadProfDataJson(path: string): ProfEntryTomaC3 {
  const src = Fs.readFileSync(path, "utf8");
  const json = JSON.parse(src);

  let data = ProfEntryTomaC3.parse(json);

  return data;
}

export function loadProfDataC3() {
  const profs: ProfEntryTomaC3[] = [];
  const files = getFiles("datapack/c3/profs", ".json");
  for (const f of files) {
    if (f !== "races.json") {
      const data = loadProfDataJson(`datapack/c3/profs/${f}`);
      profs.push(data);
    }
  }
  return profs;
}
