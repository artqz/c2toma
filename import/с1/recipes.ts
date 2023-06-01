import { loadRecipeDataC1 } from '../../datapack/c1/recipe';
import { Item, Recipe } from '../../result/types';
import { Chronicle } from '../types';

export function loadRecipes(deps: { chronicle: Chronicle, items: Map<number, Item> }) {
  let recipes = loadRecipesData(deps);

  console.log("Recipes loaded.");

  return recipes;
}

function loadRecipesData(deps: { chronicle: Chronicle, items: Map<number, Item> }) {
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
    materialList: [],
    npcFeeList: [],
    productList: []
  })
}



  
  return []
}