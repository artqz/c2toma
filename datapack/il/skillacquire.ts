import Fs from "fs";
import { z } from "zod";

const ProfSkillAcquireIL = z.array(
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

const SkillAcquireEntryIL = z.object({
  $: ProfSkillAcquireIL,
  t: z.string(),
});

export type SkillAcquireEntryIL = z.infer<typeof SkillAcquireEntryIL>;
export type ProfSkillAcquireIL = z.infer<typeof ProfSkillAcquireIL>;

export function loadSkillAcquireDataJson(path: string): SkillAcquireEntryIL[] {
  const src = Fs.readFileSync(path, "utf8");
  const json = JSON.parse(src);
  let data = SkillAcquireEntryIL.array().parse(json);

  return data;
}

export function loadSkillAcquireDataIL() {
  return loadSkillAcquireDataJson("datapack/il/skillacquire.txt.json");
}
