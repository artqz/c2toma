import { loadRecipesC2 } from "../datapack/c2/recipes";
import { Item, Material, Recipe } from "../result/types";

export function loadRecipes(deps: { items: Map<number, Item> }) {
  const itemById = deps.items;
  const recipes = loadRecipesC2();

  const recMap = new Map<number, Recipe>();

  for (const rec of recipes) {
    recMap.set(rec.id, {
      id: rec.id,
      itemName: itemById.get(rec.recipe_id)!.itemName,
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
          chance: 100,
        },
      ],
      recipeName: rec.name,
      successRate: rec.success_rate,
    });
  }
  // addRecipesInItem({items: deps.items, recipes: recMap})
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

// export async function addRecipesInItem(deps: {
//   recipes: Map<number, Recipe>;
//   items: Map<number, Item>;
// }) {
//   const itemByName = new Map(Array.from(deps.items.values()).map((item) => [item.itemName, item]));
//   const recipes = deps.recipes

//   for (const _recipe of recipes.values()) {
//     const item = itemByName.get(_recipe.itemName);

//     if (item) {
//     const recipe: Recipe = {
//       id: _recipe.id,
//       recipeName: _recipe.recipeName,
//       itemName: item.itemName,
//       level: _recipe.level,
//       materialList: [],
//       productList: [],
//       mpConsume: _recipe.mpConsume,
//       successRate: _recipe.successRate,
//       npcFeeList: _recipe.npcFeeList
//     }

//     item.recipe.push(recipe);

//     for (const material of _recipe.materialList) {
//         const qMaterial = itemByName.get(material.itemName);
//         if (qMaterial) {
//           const mat: Material = {
//             itemName: qMaterial.itemName,
//             count: material.count,
//           };
//           recipe.materialList.push(mat);
//           // qMaterial.material.push(mat);
//         }
//     }

//     for (const product of _recipe.productList) {
//         const qProduct = itemByName.get(product.itemName);
//         if (qProduct) {
//           const prod: Product = {
//             itemName: qProduct.itemName,
//             count: product.count
//           };
//           recipe.productList.push(prod);
//           // qProduct.product.push(prod);
//         }
//       }
//   }
//   }
// }
