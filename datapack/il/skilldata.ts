import Fs from "fs";
import { any, z } from "zod";

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

const SkillOperateCond = z.object({
  $: z
    .array(
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
    )
    .optional(),
});

const SkillEntryIL = z.object({
  skill_id: z.number(),
  skill_name: z.string(),
  level: z.number(),
  operate_type: z.string(),
  abnormal_time: z.number().optional(),
  debuff: z.number().optional(),
  effect: SkillEffect,
  operate_cond: SkillOperateCond.optional(),
  effect_point: z.number().optional(), //aggro point
  hp_consume: z.number().optional(),
  mp_consume1: z.number().optional(),
  mp_consume2: z.number().optional(),
  cast_range: z.number().optional(),
});

export type SkillEntryIL = z.infer<typeof SkillEntryIL>;

function loadSkillataJson(path: string): SkillEntryIL[] {
  const src = Fs.readFileSync(path, "utf8");
  const json = JSON.parse(src);
  let data = SkillEntryIL.array().parse(json);

  return data;
}

export function loadSkillDataIL() {
  return loadSkillataJson("datapack/il/skilldata.txt.json");
}
