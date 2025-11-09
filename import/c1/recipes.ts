import { loadRecipeDataC1 } from "../../datapack/c1/recipe";
import { loadRecipeDataC4 } from "../../datapack/c4/recipe";
import { loadRecipeDataGF } from "../../datapack/gf/recipe";
import { RecipeEntry } from '../../datapack/types';
import { Item, Material, Product, Recipe } from "../../result/types";
import { Chronicle } from "../types";
import { generateRecipesC5 } from './c5/recipe';
import { generateRecipesCT1 } from "./ct1/recipe";
import { generateRecipesIL } from './il/recipe';

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
  switch (deps.chronicle) {
    case "c1":      
      return addRecipe({...deps, recipeData: loadRecipeDataC1()})
    case "c4":   
      return addRecipe({...deps, recipeData: loadRecipeDataC4()})
    case "c5":
      return addRecipeC5(deps)
    case "il":
      return addRecipeIL(deps)
      case "ct1":
      return addRecipeCT1(deps)
    case "gf":
      return addRecipe({...deps, recipeData: loadRecipeDataGF()})
    default:
      return addRecipe({...deps, recipeData: loadRecipeDataC1()})
  
  }
  
}

function addRecipe(deps: {items: Map<number, Item>; recipeData:RecipeEntry[]}) {
  const recMap = new Map<number, Recipe>();

  for (const rec of deps.recipeData) {
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


function addRecipeC5(deps: {items: Map<number, Item>; }) {
  return generateRecipesC5(deps)
}

function addRecipeIL(deps: {items: Map<number, Item>; }) {
  return generateRecipesIL(deps)
}

function addRecipeCT1(deps: {items: Map<number, Item>; }) {
  return generateRecipesCT1(deps)
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
