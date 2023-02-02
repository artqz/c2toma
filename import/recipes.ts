import { loadRecipesC2 } from "../datapack/c2/recipes";
import { Item, Material, Recipe } from "../result/types";

export function loadRecipes(deps: { items: Map<number, Item> }) {
  const itemById = deps.items;
  const recipes = loadRecipesC2();

  const recMap = new Map<number, Recipe>();

  for (const rec of recipes) {
    recMap.set(rec.id, {
      id: rec.id,
      itemName: itemById.get(rec.id)!.itemName,
      level: rec.level,
      mpConsume: rec.mp_consume,
      materialList: getMaterials({ ...deps, materials: rec.material.$ }),
      npcFeeList: rec.npc_fee.$
        ? getMaterials({ ...deps, materials: rec.npc_fee.$ })
        : [],
      productList: [
        {
          itemName: itemById.get(rec.product_id)!.itemName,
          count: rec.product_num,
        },
      ],
      recipeName: rec.name,
      successRate: rec.success_rate,
    });
  }
  console.log("Recipes loaded.");

  return recMap;
}

function getMaterials(deps: { materials: string[]; items: Map<number, Item> }) {
  const { materials } = deps;
  const itemById = deps.items;
  const regexp = /(\d+)\((\d+)\)/;

  const materialList: Material[] = [];

  for (const m of materials) {
    const res = m.match(regexp);
    const itemName = itemById.get(res ? parseInt(res[1]) : 0)!.itemName;
    const count = res ? parseInt(res[2]) : 0;
    materialList.push({ itemName, count });
  }

  return materialList;
}
