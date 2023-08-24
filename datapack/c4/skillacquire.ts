import Fs from "fs";
import { z } from "zod";

const ProfSkillAcquire = z.array(
  z.union([
    z.string(),
    z.object({
      skill_name: z.string(),
      get_lv: z.number(),
      lv_up_sp: z.number(),
      auto_get: z.string(),
      item_needed: z.object({
        $: z
          .array(
            z.object({
              $: z.tuple([z.string(), z.number()]),
            })
          )
          .optional(),
      }),
      quest_needed: z
        .object({
          $: z.array(z.number()),
        })
        .optional(),
    }),
  ])
);

const SkillAcquireEntry = z.object({
  $: ProfSkillAcquire,
  t: z.string(),
});

export type SkillAcquireEntry = z.infer<typeof SkillAcquireEntry>;
export type ProfSkillAcquire = z.infer<typeof ProfSkillAcquire>;

export function loadSkillAcquireDataJson(path: string): SkillAcquireEntry[] {
  const src = Fs.readFileSync(path, "utf8");
  const json = JSON.parse(src);
  let data = SkillAcquireEntry.array().parse(json);

  return data;
}

export function loadSkillAcquireDataC4() {
  return loadSkillAcquireDataJson("datapack/c4/skillacquire.txt.json");
}
