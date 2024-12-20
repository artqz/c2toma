import Fs from "fs";
import { z } from "zod";

function $arr<T extends z.ZodTypeAny>(el: T) {
  return z.object({ $: z.array(el) });
}

const MultisellEntryC1 = z.object({
  $: z.tuple([z.string(), z.number()]),
  t: z.literal("MultiSell"),
  is_dutyfree: z.number().optional(),
  is_show_all: z.number().optional(),
  keep_enchanted: z.number().optional(),

  selllist: $arr(
    // entry
    z.object({
      $: z
        .tuple([
          // result
          z.union([
            $arr(z.object({ $: z.tuple([z.string(), z.number()]) })),
            z
              .object({ $: z.tuple([z.string(), z.number()]) })
              .transform((x) => ({ $: [x] })),
          ]),
          // required
          $arr(z.object({ $: z.tuple([z.string(), z.number()]) })),
        ])
        .rest(z.object({ $: z.tuple([z.number()]) })),
    })
  ),
});

export type MultisellEntryC1 = z.infer<typeof MultisellEntryC1>;

function loadMultisellDataJson(path: string): MultisellEntryC1[] {
  const src = Fs.readFileSync(path, "utf8");
  const json = JSON.parse(src);
  let data = MultisellEntryC1.array().parse(json);

  return data;
}

export function loadMultisellDataC1() {
  return loadMultisellDataJson("datapack/c1/multisell.txt.l2h.json");
}
