import Fs from "fs";
import { z } from "zod";

const ProfSkillAcquireC1 = z.array(
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

const SkillAcquireEntryC1 = z.object({
  $: ProfSkillAcquireC1,
  t: z.string(),
});

export type SkillAcquireEntryC1 = z.infer<typeof SkillAcquireEntryC1>;
export type ProfSkillAcquireC1 = z.infer<typeof ProfSkillAcquireC1>;

export function loadSkillAcquireDataJson(path: string): SkillAcquireEntryC1[] {
  const src = Fs.readFileSync(path, "utf8");
  const json = JSON.parse(src);
  let data = SkillAcquireEntryC1.array().parse(json);

  return data;
}

export function loadSkillAcquireDataC1() {
  return loadSkillAcquireDataJson("datapack/c1/skillacquire.txt.l2h.json");
}
