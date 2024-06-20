import { z } from "zod";

export const NpcDataEntry = z.object({
  npcData: z.object({
    npcClassId: z.number(),
    level: z.number(),
    npcType: z.number(),
    acquireExpRate: z.number(),
    acquireSp: z.number(),
    skillList: z.array(
      z.object({ skillId: z.number(), skillLevel: z.number() })
    ),
    corpseMakeList: z.array(
      z.object({
        itemClassId: z.number(),
        min: z.number(),
        max: z.number(),
        chance: z.number(),
      })
    ),
    additionalMakeList: z.array(
      z.object({
        itemClassId: z.number(),
        min: z.number(),
        max: z.number(),
        chance: z.number(),
      })
    ),
    additionalMakeMultiList: z.array(
      z.object({
        itemClassId: z.number(),
        min: z.number(),
        max: z.number(),
        chance: z.number(),
      })
    ),
    orgHp: z.number(),
    orgMp: z.number(),
    baseDefend: z.number(),
    baseMagicAttack: z.number(),
    baseMagicDefend: z.number(),
    basePhysicalAttack: z.number(),
    physicalHitModify: z.number(),
    physicalAvoidModify: z.number(),
    baseAttackSpeed: z.number(),
    baseCritical: z.number(),
    social: z.boolean(),
  }),
  drop: z.array(
    z.object({
      npcId: z.number(),
      min: z.number(),
      max: z.number(),
      chance: z.number(),
      crystal: z.object({
        itemClassId: z.number(),
        crystalType: z.enum(["NoGrade", "D", "C", "B", "A", "S"]),
      }),
      npcType: z.number(),
    })
  ),
  spoil: z.array(
    z.object({
      npcId: z.number(),
      min: z.number(),
      max: z.number(),
      chance: z.number(),
      crystal: z.object({
        itemClassId: z.number(),
        crystalType: z.enum(["NoGrade", "D", "C", "B", "A", "S"]),
      }),
      npcType: z.number(),
    })
  ),
});
export type NpcDataEntry = z.infer<typeof NpcDataEntry>;

export const NpcsDataEntry = z.object({
  npc: z.object({
    npcClassId: z.number(),
  }),
});
export type NpcsDataEntry = z.infer<typeof NpcsDataEntry>;

export type Chronicle = "c1" | "c2" | "c3" | "c4" | "c5" | "il" | "gf";
