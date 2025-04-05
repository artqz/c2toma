import Fs from "fs";
import { z } from "zod";
import { NpcDataEntry } from "../types";

const NpcSkillsEntryC1 = z.object({ $: z.optional(z.string().array()) });

const NpcEntryC1 = z.object({
  $: z.tuple([z.string(), z.number(), z.string()]),
  t: z.string(),
  level: z.number(),
  exp: z.number(),
  acquire_exp_rate: z.number(),
  undying: z.number(),
  can_be_attacked: z.number(),
  acquire_sp: z.number(),
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
  sex: z.string(),
  temper: z.number(),
  safe_height: z.number(),
  org_jump: z.number(),
  skill_list: NpcSkillsEntryC1,
  magic_list: NpcSkillsEntryC1,
  max_item: z.number(),
  item_make_list: z.unknown(),
  corpse_make_list: z.unknown(),
  additional_make_list: z.unknown(),
  additional_make_multi_list: z.unknown(),
  slot_chest: z.string(),
  slot_rhand: z.string(),
  slot_lhand: z.string(),
  base_attack_type: z.string(),
  base_can_penetrate: z.number(),
  base_attack_range: z.number(),
  base_damage_range: z.object({
    $: z.tuple([z.number(), z.number(), z.number(), z.number()]),
  }),
  base_rand_dam: z.number(),
  str: z.number(),
  int: z.number(),
  dex: z.number(),
  wit: z.number(),
  con: z.number(),
  men: z.number(),
  hp_increase: z.number(),
  mp_increase: z.number(),
  org_hp_regen: z.number(),
  org_mp_regen: z.number(),
  ground_high: z.object({ $: z.tuple([z.number()]).rest(z.number()) }),
  ground_low: z.object({ $: z.tuple([z.number()]).rest(z.number()) }),
  underwater_low: z.object({
    $: z.tuple([z.number(), z.number(), z.number()]),
  }),
  underwater_high: z.object({
    $: z.tuple([z.number(), z.number(), z.number()]),
  }),
  fly_low: z.object({
    $: z.tuple([z.number(), z.number(), z.number()]),
  }),
  fly_high: z.object({
    $: z.tuple([z.number(), z.number(), z.number()]),
  }),
  float_low: z.object({
    $: z.tuple([z.number(), z.number(), z.number()]),
  }),
  float_high: z.object({
    $: z.tuple([z.number(), z.number(), z.number()]),
  }),
  org_earshot: z.number(),
  sight: z.object({
    $: z.tuple([z.number(), z.number(), z.number(), z.number(), z.number()]),
  }),
  agro_range: z.number(),
  org_hp: z.number(),
  org_mp: z.number(),
  base_defend: z.number(),
  base_magic_attack: z.number(),
  base_magic_defend: z.number(),
  base_physical_attack: z.number(),
  physical_hit_modify: z.number(),
  physical_avoid_modify: z.number(),
  base_attack_speed: z.number(),
  base_reuse_delay: z.number(),
  base_critical: z.number(),
  magic_use_speed_modify: z.number(),
  status: z.object({ $: z.array(z.string()) }),
  align: z.number(),
  collision_radius: z.number(),
  collision_height: z.number(),
  category: z.unknown(),
  clan: z.object({
    $: z.union([z.string().array(), z.number().array()]).optional(),
  }),
  clan_help_range: z.number(),
  guild: z.unknown(),
  pledge: z.unknown(),
  pledge_leader: z.number(),
  alliance: z.unknown(),
  alliance_leader: z.number(),
  ignore_clan_list: z.unknown(),
  ruler: z.number(),
  ruling_domain: z.unknown(),
  npc_ai: z.object({ $: z.tuple([z.string()]).rest(z.unknown()) }),
  corpse_time: z.number(),
  no_sleep_mode: z.number(),
});

export type NpcEntryC1 = z.infer<typeof NpcEntryC1>;
export type NpcSkillsEntryC1 = z.infer<typeof NpcSkillsEntryC1>;

export function loadNpcDataJson(path: string): NpcDataEntry[] {
  const src = Fs.readFileSync(path, "utf8");
  const json = JSON.parse(src);
  let data = NpcEntryC1.array().parse(json);

  return data.map((d) => ({
    ...d,
    collision_height: { $: [d.collision_height, d.collision_height] },
    collision_radius: { $: [d.collision_radius, d.collision_radius] },
  }));
}

export function loadNpcDataC1() {
  return loadNpcDataJson("datapack/c1/npcdata.txt.l2h.json");
}
