import { z } from "zod";

type lstring = {
  en: string;
  ru: string;
};
export type ItemNameEntry = {
  id: number;
  add_name: lstring;
  name: lstring;
  desc: lstring;
};

export type SkillNameEntry = {
  id: number;
  level: number;
  name: lstring;
  desc: lstring;
};

const ItemDataEntry = z.object({
  // $: z.union([
  //   z.tuple([z.string(), z.number(), z.string()]),
  //   z.array(z.number()),
  // ]),
  // t: z.enum(["item", "set"]),
  $: z.union([
    z.tuple([z.string(), z.number(), z.string()]),
    z.tuple([z.string(), z.number(), z.string(), z.number()]),
    z.array(z.number()),
  ]),
  item_type: z.string().optional(),
  armor_type: z.string().optional(),
  etcitem_type: z.string().optional(),
  weapon_type: z.string().optional(),
  slot_bit_type: z.object({ $: z.array(z.string()) }).optional(),
  weight: z.number().optional(),
  consume_type: z.string().optional(),
  initial_count: z.number().optional(),
  maximum_count: z.number().optional(),
  soulshot_count: z.number().optional(),
  spiritshot_count: z.number().optional(),
  immediate_effect: z.number().optional(),
  default_price: z.number().optional(),
  item_skill: z.string().optional(),
  critical_attack_skill: z.string().optional(),
  material_type: z.string().optional(),
  crystal_type: z
    .enum([
      "none",
      "d",
      "c",
      "b",
      "a",
      "s",
      "s80",
      "s84",
      "crystal_free",
      "event",
    ])
    .optional(),
  crystal_count: z.number().optional(),
  is_trade: z.number().optional(),
  is_drop: z.number().optional(),
  is_destruct: z.number().optional(),
  physical_damage: z.number().optional(),
  random_damage: z.number().optional(),
  can_penetrate: z.number().optional(),
  critical: z.number().optional(),
  hit_modify: z.number().optional(),
  avoid_modify: z.number().optional(),
  dual_fhit_rate: z.number().optional(),
  shield_defense: z.number().optional(),
  shield_defense_rate: z.number().optional(),
  attack_range: z.number().optional(),
  effective_range: z.number().optional(),
  damage_range: z.object({ $: z.array(z.number()).optional() }).optional(),
  attack_speed: z.number().optional(),
  reuse_delay: z.number().optional(),
  mp_consume: z.number().optional(),
  magical_damage: z.number().optional(),
  durability: z.number().optional(),
  physical_defense: z.number().optional(),
  magical_defense: z.number().optional(),
  mp_bonus: z.number().optional(),
  magic_weapon: z.number().optional(),
  //sets
  slot_chest: z.union([
    z.number().optional(),
    z.object({ $: z.array(z.number()) }).optional(),
  ]),
  slot_legs: z.union([
    z.number().optional(),
    z.object({ $: z.array(z.number()) }).optional(),
  ]),
  slot_head: z.union([
    z.number().optional(),
    z.object({ $: z.array(z.number()) }).optional(),
  ]),
  slot_lhand: z.union([
    z.number().optional(),
    z.object({ $: z.array(z.number()) }).optional(),
  ]),
  slot_gloves: z.union([
    z.number().optional(),
    z.object({ $: z.array(z.number()) }).optional(),
  ]),
  slot_feet: z.union([
    z.number().optional(),
    z.object({ $: z.array(z.number()) }).optional(),
  ]),
  slot_additional: z.enum(["none", "slot_lhand"]).optional(),
  set_skill: z.string().optional(),
  set_effect_skill: z.string().optional(),
  set_additional_effect_skill: z.string().optional(),
  set_additional2_condition: z.number().optional(),
  set_additional2_effect_skill: z.string().optional(),
});

export type ItemDataEntry = z.infer<typeof ItemDataEntry>;

export type ItemGrp = {
  id: number;
  icon: string;
};

export type NpcNameEntry = {
  id: number;
  name: lstring;
  nick: lstring;
  nickcolor: "default" | "quest" | "raid";
};

const NpcDataEntry = z.object({
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
  acquire_exp_rate: z.number(),
  acquire_sp: z.number(),
  org_hp: z.number(),
  org_mp: z.number(),
  physical_avoid_modify: z.number(),
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

export type NpcDataEntry = z.infer<typeof NpcDataEntry>;

export type NpcGrpEntry = {
  id: number;
  "dtab1[0]": number;
  "dtab1[1]": number;
  "dtab1[2]": number;
  "dtab1[3]": number;
  "dtab1[4]": number;
  "dtab1[5]": number;
  "dtab1[6]": number;
  "dtab1[7]": number;
  "dtab1[8]": number;
  "dtab1[9]": number;
  "dtab1[10]": number;
  "dtab1[11]": number;
  "dtab1[12]": number;
  "dtab1[13]": number;
  "dtab1[14]": number;
  "dtab1[15]": number;
  "dtab1[16]": number;
  "dtab1[17]": number;
  "dtab1[18]": number;
  "dtab1[19]": number;
  "dtab1[20]": number;
  "dtab1[21]": number;
  "dtab1[22]": number;
  "dtab1[23]": number;
  "dtab1[24]": number;
  "dtab1[25]": number;
};
