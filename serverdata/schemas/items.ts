import { z } from "zod";

export const Item = z.object({
  id: z.number(),
  itemName: z.string(),
  name: z.string(),
});

const defaultAction = z.enum(["EQUIP"]);
const weaponType = z.enum(["BLUNT"]);
const bodypart = z.enum(["rhand"]);
const material = z.enum(["STEEL"]);

export const ItemData = z.object({
  item: z.object({
    $: z.object({
      id: z.number(),
      name: z.string(),
      type: z.enum(["Weapon", "Armor", "QuestItem", "EtcItem"]),
    }),
    // set: z.object({
    //   name: z.enum(["weight"]),
    // }),
    weight: z
      .object({
        _: z.number(),
      })
      .optional(),
    defaultPrice: z
      .object({
        _: z.number(),
      })
      .optional(),
    shots: z
      .object({
        $: z.object({
          soul: z.number(),
          spirit: z.number(),
        }),
      })
      .optional(),
    isTrade: z
      .object({
        _: z.boolean(),
      })
      .optional(),
    isDrop: z
      .object({
        _: z.boolean(),
      })
      .optional(),
    isDestruct: z
      .object({
        _: z.boolean(),
      })
      .optional(),
    stats: z.object({
      stat: z
        .object({
          $: z.object({ type: z.enum(["pAtk", "mAtk", "randomDamage"]) }),
          // pAtk: z.number().optional(),
          // mAtk: z.number().optional(),
          // rCrit: z.number().optional(),
          // accCombat: z.number().optional(),
          // pAtkSpd: z.number().optional(),
          // randomDamage: z.number().optional(),
          // pAtkRange: z.number().optional(),
        })
        .array(),
    }),
  }),
});
export type ItemData = z.infer<typeof ItemData>;
export type Item = z.infer<typeof Item>;
