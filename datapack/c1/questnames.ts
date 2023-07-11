import Fs from "fs";
import { z } from "zod";

const QuestNameEntryC1 = z.object({
  id: z.number(),  
  level: z.number(),
  name: z.string(),
  desc: z.string(),

});
export type QuestNameEntryC1 = z.infer<typeof QuestNameEntryC1>;

export function loadQuestNamesJson(path: string): QuestNameEntryC1[] {
  const src = Fs.readFileSync(path, "utf8");
  const json = JSON.parse(src);
  let data = QuestNameEntryC1.array().parse(json);
  return data;
}

export function loadQuestNamesC1() {
    return loadQuestNamesJson("datapack/c1/questname-e.txt.l2h.json");
}