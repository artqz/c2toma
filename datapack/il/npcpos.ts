import Fs from "fs";
import { z } from "zod";

function makeNpcType<S extends string>(suffix: S) {
  return z.object({
    t: z.literal(`npcmaker${suffix}` as const),
    $: z.preprocess(
      (arrRaw) => {
        const arr = z.unknown().array().parse(arrRaw);
        let start = 0;
        while (typeof arr[start] === "string") {
          start++;
        }
        return [arr.slice(0, start), ...arr.slice(start)];
      },
      z.tuple([z.string().array()]).rest(
        z.object({
          t: z.literal(`npc${suffix}` as const),
          $: z.tuple([z.string()]).rest(z.unknown()),
          pos: z
            .union([
              z.literal("anywhere"),
              z
                .object({
                  $: z
                    .tuple([z.number(), z.number(), z.number(), z.number()])
                    .rest(z.unknown()),
                })
                .transform((pos) => ({ $: [pos] })),
              z.object({
                $: z
                  .object({
                    $: z
                      .tuple([z.number(), z.number(), z.number(), z.number()])
                      .rest(z.unknown()),
                  })
                  .array(),
              }),
            ])
            .optional(),
        })
      )
    ),
  });
}

const NpcPosEntry = z.discriminatedUnion("t", [
  z.object({ t: z.literal("domain") }),
  z.object({
    t: z.literal("territory"),
    $: z.tuple([
      z.string(),
      z.object({
        $: z.array(
          z.object({
            $: z.tuple([
              z.number(),
              z.number(),
              z.number(),
              z.union([
                z.number(),
                z.object({
                  t: z.literal("unit"),
                  value: z.number(),
                  unit: z.literal("%"),
                }),
              ]),
            ]),
          })
        ),
      }),
    ]),
  }),
  makeNpcType(""),
  makeNpcType("_ex"),
]);

export type NpcPosEntry = z.infer<typeof NpcPosEntry>;

export function loadNpcPosJson(path: string): NpcPosEntry[] {
  const src = Fs.readFileSync(path, "utf8");
  const json = JSON.parse(src);
  let data = NpcPosEntry.array().parse(json);
  return data;
}

export function loadNpcPosIL() {
  return loadNpcPosJson("datapack/il/npcpos.txt.json");
}
