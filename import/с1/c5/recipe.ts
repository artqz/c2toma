import { loadRecipesDataC5 } from '../../../datapack/c5/recipe';
import { Item, Material, Recipe } from '../../../result/types';

export function generateRecipesC5(deps: {items: Map<number, Item>;}) {
  const recipes = loadRecipesDataC5();
  const recMap = new Map<number, Recipe>();
  const itemById = deps.items

  for (const rec of recipes) {
    recMap.set(rec.id_mk, {
      id: rec.id_mk,
      itemName: itemById.get(rec.recipe_id)!.itemName,
      level: rec.level,
      mpConsume: rec.mp_cost,
      materialList: getMaterials({ ...deps, materials: rec.materials }),
      npcFeeList: [],
      productList: [
        {
          itemName: itemById.get(rec.id_item)!.itemName,
          count: rec.count,
          chance: 100,
        },
      ],
      recipeName: rec.name,
      successRate: rec.success_rate,
    });
  }
  // addRecipesInItem({items: deps.items, recipes: recMap})

  return recMap;
}

function getMaterials(deps: {
  materials: number[][];
  items: Map<number, Item>;
}) {
  const { materials } = deps;
  const itemById = deps.items;

  const materialList: Material[] = [];

  for (const m of materials) {
    const itemName = itemById.get(m[0])!.itemName;

    materialList.push({ itemName, count: m[1] });
  }

  return materialList;
}