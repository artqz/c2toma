import Fs from "fs";
import { z } from "zod";

const ItemEntryC1 = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
});
export type ItemEntryC1 = z.infer<typeof ItemEntryC1>;

function loadItemNamesJson(path: string): ItemEntryC1[] {
  const src = Fs.readFileSync(path, "utf8");
  const json = JSON.parse(src);
  let data = ItemEntryC1.array().parse(json);
  return data;
}

export function loadItemNamesC1() {
  return loadItemNamesJson("datapack/c1/itemname-e.l2h.json");
}
