import Fs from "fs";
import { z } from "zod";

const RecipeEntry = z.object({
  id: z.number(),
  name: z.string(),
  recipe_id: z.number(),
  level: z.number(),
  material: z.object({ $: z.array(z.string()) }),
  product_id: z.number(),
  product_num: z.number(),
  npc_fee: z.object({ $: z.array(z.string()).optional() }),
  mp_consume: z.number(),
  success_rate: z.number(),
});

export type SkillGrp = z.infer<typeof RecipeEntry>;

function loadRecipesJson(path: string): SkillGrp[] {
  const src = Fs.readFileSync(path, "utf8");
  const json = JSON.parse(src);
  let data = RecipeEntry.array().parse(json);

  return data;
}

export function loadRecipesC2() {
  return loadRecipesJson(`datapack/c2/recipe-c.l2h.json`);
}
