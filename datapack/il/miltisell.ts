import Fs from "fs";
import { z } from "zod";

function $arr<T extends z.ZodTypeAny>(el: T) {
  return z.object({ $: z.array(el) });
}

const MultisellEntryIL = z.object({
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

export type MultisellEntryIL = z.infer<typeof MultisellEntryIL>;

export function loadMultisellDataJson(path: string): MultisellEntryIL[] {
  const src = Fs.readFileSync(path, "utf8");
  const json = JSON.parse(src);
  let data = MultisellEntryIL.array().parse(json);

  return data;
}

export function loadMultisellDataIL() {
  return loadMultisellDataJson("datapack/il/multisell.txt.json");
}
