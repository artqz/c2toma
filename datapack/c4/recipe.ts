import Fs from "fs";
import { z } from "zod";

const RecipeEntry = z.object({
  $: z.tuple([z.string(), z.number()]),
  t: z.enum(["recipe"]),
  level: z.number(),
  material: z.object({
    $: z.array(z.object({ $: z.tuple([z.string(), z.number()]) })),
  }),
  product: z.object({
    $: z.array(
      z.object({
        $: z.union([
          z.tuple([z.string(), z.number(), z.number()]),
          z.tuple([z.string(), z.number()]),
        ]),
      })
    ),
  }),
  npc_fee: z.object({
    $: z.array(z.object({ $: z.tuple([z.string(), z.number()]) })).optional(),
  }),
  mp_consume: z.number(),
  success_rate: z.number(),
  item_id: z.number(),
});

export type RecipeEntry = z.infer<typeof RecipeEntry>;

function loadRecipeDataJson(path: string): RecipeEntry[] {
  const src = Fs.readFileSync(path, "utf8");
  const json = JSON.parse(src);
  let data = RecipeEntry.array().parse(json);

  return data;
}

export function loadRecipeDataC4() {
  return loadRecipeDataJson("datapack/c4/recipe.txt.json");
}
