import Fs from "fs";
import { z } from "zod";

const NpcEntryC4 = z.object({
  $: z.tuple([z.string(), z.number(), z.string()]),
  skill_list: z.object({ $: z.optional(z.string().array()) }),
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
  acquire_exp_rate: z.number(),
  acquire_sp: z.number(),
  org_hp: z.number(),
  org_mp: z.number(),
  physical_avoid_modify: z.number(),
  physical_hit_modify: z.number(),
  str: z.number(),
  int: z.number(),
  dex: z.number(),
  wit: z.number(),
  con: z.number(),
  men: z.number(),
  ground_high: z.object({ $: z.tuple([z.number()]).rest(z.number()) }),
  ground_low: z.object({ $: z.tuple([z.number()]).rest(z.number()) }),
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
  npc_ai: z.object({
    $: z.tuple([z.string()]).rest(z.unknown()),
  }),
  collision_radius: z.object({ $: z.tuple([z.number(), z.number()]) }),
  collision_height: z.object({ $: z.tuple([z.number(), z.number()]) }),
  clan: z.object({
    $: z.union([z.string().array(), z.number().array()]).optional(),
  }),
  clan_help_range: z.number(),
  base_reuse_delay: z.number(),
  base_rand_dam: z.number(),
  base_attack_range: z.number(),
  soulshot_count: z.number().optional(),
  spiritshot_count: z.number().optional(),
});

export type NpcEntryC4 = z.infer<typeof NpcEntryC4>;

export function loadNpcDataJson(path: string): NpcEntryC4[] {
  const src = Fs.readFileSync(path, "utf8");
  const json = JSON.parse(src);
  let data = NpcEntryC4.array().parse(json);

  return data;
}

export function loadNpcDataC4() {
  return loadNpcDataJson("datapack/c4/npcdata.txt.l2h.json");
}
