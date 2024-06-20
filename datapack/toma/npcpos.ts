import Fs from "fs";
import { z } from "zod";

const NpcPosEntry = z.record(
  z.array(z.array(z.tuple([z.number(), z.number()])))
);

export type NpcPosEntry = z.infer<typeof NpcPosEntry>;

function loadNpcPosJson(path: string): NpcPosEntry {
  const src = Fs.readFileSync(path, "utf8");
  const json = JSON.parse(src);
  let data = NpcPosEntry.parse(json);

  return data;
}

export function loadNpcPosToma() {
  return loadNpcPosJson("datapack/toma/elab-spawns.json");
}
