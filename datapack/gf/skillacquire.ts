import Fs from "fs";
import { z } from "zod";

const ProfSkillAcquireGF = z.array(
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

const SkillAcquireEntryGF = z.object({
  $: ProfSkillAcquireGF,
  t: z.string(),
});

export type SkillAcquireEntryGF = z.infer<typeof SkillAcquireEntryGF>;
export type ProfSkillAcquireGF = z.infer<typeof ProfSkillAcquireGF>;

export function loadSkillAcquireDataJson(path: string): SkillAcquireEntryGF[] {
  const src = Fs.readFileSync(path, "utf8");
  const json = JSON.parse(src);
  let data = SkillAcquireEntryGF.array().parse(json);

  return data;
}

export function loadSkillAcquireDataGF() {
  return loadSkillAcquireDataJson("datapack/gf/skillacquire.txt.l2h.json");
}
