import Fs from "fs";
import { z } from "zod";

const RecipeEntryC1 = z.object({
  $: z.tuple([z.string(), z.number()]),
  t: z.enum(["recipe"]),
  level: z.number(),
  material: z.object({$: z.array(z.object({$: z.tuple([z.string(), z.number()])}))}),
  product: z.object({$: z.array(z.object({$: z.tuple([z.string(), z.number()])}))}),
  npc_fee: z.object({$: z.array(z.object({$: z.tuple([z.string(), z.number()])})).optional()}),
  mp_consume: z.number(),
  success_rate: z.number(),
  item_id: z.number(),
})

export type RecipeEntryC1 = z.infer<typeof RecipeEntryC1>;

function loadRecipeDataJson(path: string): RecipeEntryC1[] {
  const src = Fs.readFileSync(path, "utf8");
  const json = JSON.parse(src);
  let data = RecipeEntryC1.array().parse(json);

  return data;
}

export function loadRecipeDataC1() {
  return loadRecipeDataJson("datapack/c1/recipe.txt.l2h.json");
}