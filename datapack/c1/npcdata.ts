import Fs from "fs";
import { z } from "zod";

const NpcSkillsEntryC1 = z.object({ $: z.optional(z.string().array()) });

const NpcEntryC1 = z.object({
  $: z.tuple([z.string(), z.number(), z.string()]),
  skill_list: NpcSkillsEntryC1,
  org_hp_regen: z.number(),
  org_mp_regen: z.number(),
  level: z.number(),
  base_attack_speed: z.number(),
  base_critical: z.number(),
  base_defend: z.number(),
  base_magic_attack: z.number(),
  base_magic_defend: z.number(),
  base_physical_attack: z.number(),
  base_attack_type: z.string(),
  ground_high: z.object({ $: z.tuple([z.number()]).rest(z.number()) }),
  ground_low: z.object({ $: z.tuple([z.number()]).rest(z.number()) }),
  acquire_exp_rate: z.number(),
  acquire_sp: z.number(),
  org_hp: z.number(),
  org_mp: z.number(),
  physical_avoid_modify: z.number(),
  str: z.number(),
  int: z.number(),
  dex: z.number(),
  wit: z.number(),
  con: z.number(),
  men: z.number(),
  physical_hit_modify: z.number(),
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
  additional_make_multi_list: z.unknown(),
  corpse_make_list: z.unknown(),
  npc_ai: z.object({ $: z.tuple([z.string()]).rest(z.unknown()) }),
});

export type NpcEntryC1 = z.infer<typeof NpcEntryC1>;
export type NpcSkillsEntryC1 = z.infer<typeof NpcSkillsEntryC1>;

export function loadNpcDataJson(path: string): NpcEntryC1[] {
  const src = Fs.readFileSync(path, "utf8");
  const json = JSON.parse(src);
  let data = NpcEntryC1.array().parse(json);

  return data;
}

export function loadNpcDataC1() {
  return loadNpcDataJson("datapack/c1/npcdata.txt.l2h.json");
}
