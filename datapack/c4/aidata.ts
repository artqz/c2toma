import Fs from "fs";
import { z } from "zod";

const AiEntryC4 = z.object({
  super: z.string(),
  name: z.string(),
  sell_lists: z.array(
    z.array(z.tuple([z.string(), z.number(), z.number(), z.number()]))
  ),
});

export type AiEntryC4 = z.infer<typeof AiEntryC4>;

function loadAiDataJson(path: string): AiEntryC4[] {
  const src = Fs.readFileSync(path, "utf8");
  const json = JSON.parse(src);
  let data = AiEntryC4.array().parse(json);

  return data;
}

export function loadAiDataC4() {
  return loadAiDataJson("datapack/c4/ai.json");
}
