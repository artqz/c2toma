
import Fs from "fs";
import { z } from "zod";


const ItemEntryC4 = z.object({
  $: z.union([z.tuple([z.string(), z.number(), z.string()]), z.array(z.number())]),
  t: z.enum(["item", "set"]),
  armor_type: z.string().optional(),
  etcitem_type: z.string().optional(),
  weapon_type: z.string().optional(),
  slot_bit_type: z.object({$: z.array(z.string())}).optional(),
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
  crystal_type: z.string().optional(),
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
  damage_range: z.object({$: z.array(z.number()).optional()}).optional(),
  attack_speed: z.number().optional(),
  reuse_delay: z.number().optional(),
  mp_consume: z.number().optional(),
  magical_damage: z.number().optional(),
  durability: z.number().optional(),
  physical_defense: z.number().optional(),
  magical_defense: z.number().optional(),
  mp_bonus: z.number().optional(),
  magic_weapon: z.number().optional(),
});

export type ItemEntryC4 = z.infer<typeof ItemEntryC4>;

export function loadItemDataJson(path: string): ItemEntryC4[] {
  const src = Fs.readFileSync(path, "utf8");
  const json = JSON.parse(src);
  let data = ItemEntryC4.array().parse(json);
  
  return data;
}

export function loadItemDataC4() {
    return loadItemDataJson("datapack/c4/itemdata.txt.l2h.json");
}