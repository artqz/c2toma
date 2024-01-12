import Fs from "fs";
import { z } from "zod";

const NpcEntryC4 = z.object({
  npc_ai: z.object({
    // $: z.tuple([z.string()]).rest(z.unknown()),
    $: z.array(z.string(), z.any()).optional(),
  }),
});

type NpcEntryC4 = z.infer<typeof NpcEntryC4>;

function loadNpcDataJson(path: string): NpcEntryC4[] {
  const src = Fs.readFileSync(path, "utf8");
  const json = JSON.parse(src);
  let data = NpcEntryC4.array().parse(json);

  return data;
}

function loadNpcDataC4() {
  return loadNpcDataJson("datapack/c4/npcdata.txt.l2h.json");
}

loadNpcDataC4();
