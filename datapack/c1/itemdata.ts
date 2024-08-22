import Fs from "fs";
import { z } from "zod";

const ItemEntryC1 = z.object({
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
  //c1 stats
  p_def_inc: z
    .object({
      $: z.tuple([z.number(), z.number()]),
    })
    .optional(),
  m_def_inc: z
    .object({
      $: z.tuple([z.number(), z.number()]),
    })
    .optional(),
  hp_inc: z
    .object({
      $: z.tuple([z.number(), z.number()]),
    })
    .optional(),
  mp_inc: z
    .object({
      $: z.tuple([z.number(), z.number()]),
    })
    .optional(),
  move_speed_inc: z
    .object({
      $: z.tuple([z.number(), z.number()]),
    })
    .optional(),
  breath_inc: z
    .object({
      $: z.tuple([z.number(), z.number()]),
    })
    .optional(),
  magic_resist_inc: z
    .object({
      $: z.tuple([z.number(), z.number()]),
    })
    .optional(),
  casting_speed_inc: z
    .object({
      $: z.tuple([z.number(), z.number()]),
    })
    .optional(),
  p_attack_inc: z
    .object({
      $: z.tuple([z.number(), z.number()]),
    })
    .optional(),
  m_attack_inc: z
    .object({
      $: z.tuple([z.number(), z.number()]),
    })
    .optional(),
  hp_regen_inc: z
    .object({
      $: z.tuple([z.number(), z.number()]),
    })
    .optional(),
  mp_regen_inc: z
    .object({
      $: z.tuple([z.number(), z.number()]),
    })
    .optional(),
  str_inc: z
    .object({
      $: z.tuple([z.number(), z.number()]),
    })
    .optional(),
  con_inc: z
    .object({
      $: z.tuple([z.number(), z.number()]),
    })
    .optional(),
  dex_inc: z
    .object({
      $: z.tuple([z.number(), z.number()]),
    })
    .optional(),
  int_inc: z
    .object({
      $: z.tuple([z.number(), z.number()]),
    })
    .optional(),
  men_inc: z
    .object({
      $: z.tuple([z.number(), z.number()]),
    })
    .optional(),
  wit_inc: z
    .object({
      $: z.tuple([z.number(), z.number()]),
    })
    .optional(),
  avoid_inc: z
    .object({
      $: z.tuple([z.number(), z.number()]),
    })
    .optional(),
  shield_def_prob_inc: z
    .object({
      $: z.tuple([z.number(), z.number()]),
    })
    .optional(),
  weight_limit_inc: z
    .object({
      $: z.tuple([z.number(), z.number()]),
    })
    .optional(),
  resist_poison_inc: z
    .object({
      $: z.tuple([z.number(), z.number()]),
    })
    .optional(),
  p_def_vs_dagger_inc: z
    .object({
      $: z.tuple([z.number(), z.number()]),
    })
    .optional(),
    //capsule
  default_action: z.string().optional(),
});

export type ItemEntryC1 = z.infer<typeof ItemEntryC1>;

function loadItemDataJson(path: string): ItemEntryC1[] {
  const src = Fs.readFileSync(path, "utf8");
  const json = JSON.parse(src);
  let data = ItemEntryC1.array().parse(json);

  return data;
}

export function loadItemDataC1() {
  return loadItemDataJson("datapack/c1/itemdata.txt.l2h.json");
}
