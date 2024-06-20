import Fs from "fs";
import { any, z } from "zod";

const SkillEffect = z.object({
  $: z
    .array(
      z.object({
        $: z.union([
          z.any(), //временно
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
          z.any(), //временно
          z.tuple([z.string(), z.number(), z.string(), z.number()]), //hz
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
          z.tuple([
            z.union([
              z.number(),
              z.string(),
              z.object({ $: z.array(z.any()) }),
            ]),
          ]),
        ]),
      })
    ),
  })
  .optional();

const SkillEntryGF = z.object({
  skill_id: z.number(),
  skill_name: z.string(),
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

export type SkillEntryGF = z.infer<typeof SkillEntryGF>;

function loadSkillataJson(path: string): SkillEntryGF[] {
  const src = Fs.readFileSync(path, "utf8");
  const json = JSON.parse(src);
  let data = SkillEntryGF.array().parse(json);

  return data;
}

export function loadSkillDataGF() {
  return loadSkillataJson("datapack/gf/skilldata.txt.l2h.json");
}
