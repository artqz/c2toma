import { loadRecipesDataC3 } from "../../datapack/c3/recipes";
import { Item, Material, Recipe } from "../../result/types";

export function loadRecipesC3(deps: { items: Map<number, Item> }) {
  const itemById = deps.items;
  const recipes = loadRecipesDataC3();

  const recMap = new Map<number, Recipe>();

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
  console.log("Recipes loaded.");

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
