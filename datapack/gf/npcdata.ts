import Fs from "fs";
import { z } from "zod";

const NpcEntryGF= z.object({
  $: z.tuple([z.string(), z.number(), z.string()]),
  skill_list: z.object({ $: z.optional(z.string().array()) }),
  org_hp_regen: z.number(),
  org_mp_regen: z.number(),
  race: z.enum([
    "animal",
    "beast",
    "bug",
    "castle_guard",
    "construct",
    "darkelf",
    "demonic",
    "dragon",
    "dwarf",
    "elemental",
    "elf",
    "fairy",
    "giant",
    "human",
    "humanoid",
    "mercenary",
    "monster",
    "orc",
    "plant",
    "undead",
    // GF
    "kamael",
    "divine",
    "siege_weapon",
    "etc",
  ]),
  agro_range: z.number(),
  npc_ai: z.object({ $: z.tuple([z.string()]).rest(z.unknown()) }),
});

export type NpcEntryGF = z.infer<typeof NpcEntryGF>;

export function loadNpcDataJson(path: string): NpcEntryGF[] {
  const src = Fs.readFileSync(path, "utf8");
  const json = JSON.parse(src);
  let data = NpcEntryGF.array().parse(json);

  return data;
}

export function loadNpcDataGF() {
  return loadNpcDataJson("datapack/gf/npcdata.txt.l2h.json");
}
