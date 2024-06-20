import Fs from "fs";
import { z } from "zod";

export type NpcNameEntry = {
  id: number;
  name: string;
  nick: string;
  nickcolor: "default" | "quest" | "raid";
};

const EntryC1 = z.object({
  id: z.number(),
  nickcolor: z.enum(["default", "quest", "raid"]),
  nick: z.string(),
  name: z.string(),
});

export function loadNpcNamesJson(path: string): NpcNameEntry[] {
  const src = Fs.readFileSync(path, "utf8");
  const json = JSON.parse(src);
  let data = EntryC1.array().parse(json);
  return data;
}

export function loadNpcNamesC1() {
  return loadNpcNamesJson("datapack/c1/npcname-e.txt.l2h.json");
}
