import { loadRecipeDataC1 } from "../../datapack/c1/recipe";
import { Item, Material, Recipe } from "../../result/types";
import { Chronicle } from "../types";

export function loadRecipes(deps: {
  chronicle: Chronicle;
  items: Map<number, Item>;
}) {
  let recipes = loadRecipesData(deps);

  console.log("Recipes loaded.");

  return recipes;
}

function loadRecipesData(deps: {
  chronicle: Chronicle;
  items: Map<number, Item>;
}) {
  let recipeData = [];
  switch (deps.chronicle) {
    case "c1":
      recipeData = loadRecipeDataC1();
      break;
    default:
      recipeData = loadRecipeDataC1();
      break;
  }
  const recMap = new Map<number, Recipe>();

  for (const rec of recipeData.values()) {
    recMap.set(rec.$[1], {
      id: rec.$[1],
      level: rec.level,
      mpConsume: rec.mp_consume,
      successRate: rec.success_rate,
      itemName: deps.items.get(rec.item_id)!.itemName,
      recipeName: rec.$[0],
      materialList: getItemList({ ...deps, list: rec.material.$ }),
      npcFeeList: getItemList({ ...deps, list: rec.npc_fee.$ ?? [] }),
      productList: getItemList({ ...deps, list: rec.product.$ }),
    });
  }

  return recMap;
}

function getItemList(deps: {
  items: Map<number, Item>;
  list: { $: [string, number] }[];
}) {
  const itemList: Material[] = [];

  for (const item of deps.list) {
    itemList.push({ itemName: item.$[0], count: item.$[1] });
  }

  return itemList;
}
