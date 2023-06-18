import Fs from "fs";
import { parse as parseCsv } from "csv-parse/sync";
import { z } from "zod";

const RecipeEntry = z.object({
  name: z.string().optional(),
  id_mk: z.string(),
  id_recipe: z.string(),
  level: z.string(),
  id_item: z.string(),
  count: z.string(),
  mp_cost: z.string(),
  success_rate: z.string(),
  materials_cnt: z.string(),
  "materials_m[0]_id": z.string(),
  "materials_m[0]_cnt": z.string(),
  "materials_m[1]_id": z.string(),
  "materials_m[1]_cnt": z.string(),
  "materials_m[2]_id": z.string(),
  "materials_m[2]_cnt": z.string(),
  "materials_m[3]_id": z.string(),
  "materials_m[3]_cnt": z.string(),
  "materials_m[4]_id": z.string(),
  "materials_m[4]_cnt": z.string(),
  "materials_m[5]_id": z.string(),
  "materials_m[5]_cnt": z.string(),
  "materials_m[6]_id": z.string(),
  "materials_m[6]_cnt": z.string(),
  "materials_m[7]_id": z.string(),
  "materials_m[7]_cnt": z.string(),
  "materials_m[8]_id": z.string(),
  "materials_m[8]_cnt": z.string(),
  "materials_m[9]_id": z.string(),
  "materials_m[9]_cnt": z.string(),
  // id: z.number(),
  // name: z.string(),
  // recipe_id: z.number(),
  // level: z.number(),
  // material: z.object({ $: z.array(z.string()) }),
  // product_id: z.number(),
  // product_num: z.number(),
  // npc_fee: z.object({ $: z.array(z.string()).optional() }),
  // mp_consume: z.number(),
  // success_rate: z.number(),
});

export type RecipeDataEntry = {
  id_mk: number;
  name: string;
  recipe_id: number;
  level: number;
  id_item: number;
  count: number;
  materials: number[][];
  mp_cost: number;
  success_rate: number;
};

export type RecipeEntry = z.infer<typeof RecipeEntry>;

function cleanStr(s: string) {
  const left = s.match(/[au],(.*?)$/)?.[1] ?? s;
  const right = left.match(/^(.*?)(\\\\n)?\\0/)?.[1] ?? left;
  return right;
}

function loadRecipesCSV(path: string): RecipeDataEntry[] {
  const src = parseCsv(Fs.readFileSync(path, "utf8"), {
    delimiter: "\t",
    relaxQuotes: true,
    columns: true,
  });

  const data = RecipeEntry.array().parse(src);

  return data.map((rec) => {
    const materials: number[][] = [];
    if (rec["materials_m[0]_id"]) {
      materials.push([
        parseInt(rec["materials_m[0]_id"]),
        parseInt(rec["materials_m[0]_cnt"]),
      ]);
    }
    if (rec["materials_m[1]_id"]) {
      materials.push([
        parseInt(rec["materials_m[1]_id"]),
        parseInt(rec["materials_m[1]_cnt"]),
      ]);
    }
    if (rec["materials_m[2]_id"]) {
      materials.push([
        parseInt(rec["materials_m[2]_id"]),
        parseInt(rec["materials_m[2]_cnt"]),
      ]);
    }
    if (rec["materials_m[3]_id"]) {
      materials.push([
        parseInt(rec["materials_m[3]_id"]),
        parseInt(rec["materials_m[3]_cnt"]),
      ]);
    }
    if (rec["materials_m[4]_id"]) {
      materials.push([
        parseInt(rec["materials_m[4]_id"]),
        parseInt(rec["materials_m[4]_cnt"]),
      ]);
    }
    if (rec["materials_m[5]_id"]) {
      materials.push([
        parseInt(rec["materials_m[5]_id"]),
        parseInt(rec["materials_m[5]_cnt"]),
      ]);
    }
    if (rec["materials_m[6]_id"]) {
      materials.push([
        parseInt(rec["materials_m[6]_id"]),
        parseInt(rec["materials_m[6]_cnt"]),
      ]);
    }
    if (rec["materials_m[7]_id"]) {
      materials.push([
        parseInt(rec["materials_m[7]_id"]),
        parseInt(rec["materials_m[7]_cnt"]),
      ]);
    }
    if (rec["materials_m[8]_id"]) {
      materials.push([
        parseInt(rec["materials_m[8]_id"]),
        parseInt(rec["materials_m[8]_cnt"]),
      ]);
    }
    if (rec["materials_m[9]_id"]) {
      materials.push([
        parseInt(rec["materials_m[9]_id"]),
        parseInt(rec["materials_m[9]_cnt"]),
      ]);
    }
    return {
      id_mk: parseInt(rec.id_mk),
      name: cleanStr(rec.name ?? ""),
      recipe_id: parseInt(rec.id_recipe),
      level: parseInt(rec.level),
      id_item: parseInt(rec.id_item),
      count: parseInt(rec.count),
      materials,
      mp_cost: parseInt(rec.mp_cost),
      success_rate: parseInt(rec.success_rate),
    };
  });
}

export function loadRecipesDataC3() {
  return loadRecipesCSV(`datapack/c3/recipe-c.txt`);
}
