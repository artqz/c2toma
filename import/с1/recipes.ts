import { loadRecipeDataC1 } from "../../datapack/c1/recipe";
import { loadRecipeDataC4 } from "../../datapack/c4/recipe";
import { loadRecipeDataGF } from "../../datapack/gf/recipe";
import { loadRecipeDataIL } from "../../datapack/il/recipe";
import { Item, Material, Product, Recipe } from "../../result/types";
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
    case "c4":
      recipeData = loadRecipeDataC4();
      break;
    case "il":
      recipeData = loadRecipeDataIL();
      break;
    case "gf":
      recipeData = loadRecipeDataGF();
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
      productList: getProfuctList({ ...deps, list: rec.product.$ }),
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

function getProfuctList(deps: {
  items: Map<number, Item>;
  list: { $: [string, number, number?] }[];
}) {
  const itemList: Product[] = [];

  for (const item of deps.list) {
    itemList.push({
      itemName: item.$[0],
      count: item.$[1],
      chance: item.$[2] ?? 100,
    });
  }

  return itemList;
}
