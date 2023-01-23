import Fs from "fs";
import { z } from "zod";

const ItemEntryC2 = z.object({
  id: z.number(),  
  name: z.string(),
  additionalname: z.string(),
  popup: z.number(),
  description: z.string(),

});
export type ItemEntryC2 = z.infer<typeof ItemEntryC2>;

export function loadItemNamesJson(path: string): ItemEntryC2[] {
  const src = Fs.readFileSync(path, "utf8");
  const json = JSON.parse(src);
  let data = ItemEntryC2.array().parse(json);
  return data;
}

export function loadItemNamesC2() {
    return loadItemNamesJson("datapack/c2/itemname-e.l2h.json");
}