import Fs from "fs";
import { z } from "zod";

const SkillEffect = z.object({
  $: z
    .array(
      z.object({
        $: z.union([
          z.tuple([
            z.string(),
            z.union([z.string(), z.number()]),
            z.union([z.string(), z.number()]),
            z.union([z.string(), z.number()]),
            z.union([z.string(), z.number()]),
          ]),
          z.tuple([
            z.string(),
            z.union([
              z.object({ $: z.array(z.string()) }),
              z.string(),
              z.number(),
            ]),
            z.union([z.string(), z.number()]),
            z.union([z.string(), z.number()]),
          ]),
          z.tuple([
            z.string(),
            z.union([z.string(), z.number()]),
            z.union([z.string(), z.number()]),
          ]),
          z.tuple([
            z.string(),
            z.union([
              z.string(),
              z.number(),
              z.object({ $: z.array(z.object({ $: z.array(z.any()) })) }),
            ]),
          ]),
          z.tuple([z.string()]),
        ]),
      })
    )
    .optional(),
});

const SkillOperateCond = z
  .object({
    $: z.array(
      z.object({
        $: z.union([
          z.tuple([
            z.string(),
            z.union([z.number(), z.string()]),
            z.union([
              z.number(),
              z.string(),
              z.object({ $: z.array(z.any()) }),
            ]),
          ]),
          z.tuple([
            z.string(),
            z.union([
              z.number(),
              z.string(),
              z.object({ $: z.array(z.any()) }),
            ]),
          ]),
          z.tuple([z.string()]),
        ]),
      })
    ),
  })
  .optional();

const SkillEntryC1 = z.object({
  skill_name: z.string(),
  skill_id: z.number(),
  level: z.number(),
  operate_type: z.string(),
  abnormal_time: z.number().optional(),
  debuff: z.number().optional(),
  effect: SkillEffect,
  operate_cond: SkillOperateCond,
  effect_point: z.number().optional(), //aggro point
  hp_consume: z.number().optional(),
  mp_consume1: z.number().optional(),
  mp_consume2: z.number().optional(),
  cast_range: z.number().optional(),
});

export type SkillEntryC1 = z.infer<typeof SkillEntryC1>;
export type SkillEnffect = z.infer<typeof SkillEffect>;
export type SkillOperateCond = z.infer<typeof SkillOperateCond>;

export function loadSkillDataJson(path: string): SkillEntryC1[] {
  const src = Fs.readFileSync(path, "utf8");
  const json = JSON.parse(src);
  let data = SkillEntryC1.array().parse(json);

  return data;
}

export function loadSkillDataC1() {
  return loadSkillDataJson("datapack/c1/skilldata.l2h.json");
}
