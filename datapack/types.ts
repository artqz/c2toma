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
  crystal_type: z.enum(["none", "d", "c", "b", "a", "s"]).optional(),
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
  slot_chest: z.number().optional(),
  slot_legs: z.number().optional(),
  slot_head: z.number().optional(),
  slot_lhand: z.number().optional(),
  slot_gloves: z.number().optional(),
  slot_feet: z.number().optional(),
  slot_additional: z.enum(["none", "slot_lhand"]).optional(),
  set_skill: z.string().optional(),
  set_effect_skill: z.string().optional(),
  set_additional_effect_skill: z.string().optional(),
});

export type ItemDataEntry = z.infer<typeof ItemDataEntry>;

export type ItemGrp = {
  id: number;
  icon: string;
};
