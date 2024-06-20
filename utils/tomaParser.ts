import Fs from "fs";
import Path from "path";
import { z } from "zod";
import { Item } from "../result/types";

const NpcDrop = z.object({
  itemClassId: z.number(),
  min: z.number(),
  max: z.number(),
  chance: z.number(),
});

const NpcDataEntry = z.object({
  npc: z.object({
    npcClassId: z.number(),
    additionalMakeMultiList: z.array(NpcDrop),
    corpseMakeList: z.array(NpcDrop),
    skillList: z.array(
      z.object({
        skillId: z.number(),
        skillLevel: z.number(),
      })
    ),
  }),
});

type NpcDataEntry = z.infer<typeof NpcDataEntry>;

function loadNpcJson(path: string, filename: string) {
  const map = Fs.readFileSync(Path.join(path, filename), "utf8");
  return NpcDataEntry.array().parse(JSON.parse(map));
}

export function tomaNpcsParser(deps: { path: string }) {
  const path = deps.path;
  if (!Fs.existsSync(path)) {
    return [];
  }
  const files = Fs.readdirSync(path, "utf8");
  let npcs: NpcDataEntry[] = [];

  for (const file of files) {
    const json = loadNpcJson(path, file);
    npcs = npcs.concat(json);
  }

  return npcs;
}
