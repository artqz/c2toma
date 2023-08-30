import Fs from "fs";
import { z } from "zod";

const RecipeEntryIL = z.object({
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

export type RecipeEntryIL = z.infer<typeof RecipeEntryIL>;

function loadRecipeDataJson(path: string): RecipeEntryIL[] {
  const src = Fs.readFileSync(path, "utf8");
  const json = JSON.parse(src);
  let data = RecipeEntryIL.array().parse(json);

  return data;
}

export function loadRecipeDataIL() {
  return loadRecipeDataJson("datapack/il/recipe.txt.json");
}
