import Fs from "fs";
import { z } from "zod";

const QuestNameEntryC2 = z.object({
  id: z.number(),  
  level: z.number(),
  name: z.string(),
  desc: z.string(),

});
export type QuestNameEntryC2 = z.infer<typeof QuestNameEntryC2>;

export function loadQuestNamesJson(path: string): QuestNameEntryC2[] {
  const src = Fs.readFileSync(path, "utf8");
  const json = JSON.parse(src);
  let data = QuestNameEntryC2.array().parse(json);
  return data;
}

export function loadQuestNamesC2() {
    return loadQuestNamesJson("datapack/c2/questname-e.l2h.json");
}