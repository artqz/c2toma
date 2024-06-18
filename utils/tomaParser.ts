import Fs from "fs";
import Path from "path";
import { z } from "zod";

const NpcDataEntry = z.object({
  npc: z.object({
    npcClassId: z.number(),
    additionalMakeMultiList: z.array(
      z.object({
        itemClassId: z.number(),
        min: z.number(),
        max: z.number(),
        chance: z.number(),
      })
    ),
  }),
});

type NpcDataEntry = z.infer<typeof NpcDataEntry>;

function loadNpcJson(path: string, filename: string) {
  const map = Fs.readFileSync(Path.join(path, filename), "utf8");
  return NpcDataEntry.array().parse(JSON.parse(map));
}

export function tomaNpcsParser(path: string) {
  const files = Fs.readdirSync(path, "utf8");
  let npcs: NpcDataEntry[] = [];

  for (const file of Array.from(files.values())) {
    const json = loadNpcJson(path, file);
    npcs = npcs.concat(json);
  }
  return npcs;
}
