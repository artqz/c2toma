import { loadNpcs } from "./import/с1/npcs";
import { createDir, saveFile } from "./utils/Fs";

function init() {
  // const AllSkills = loadSkills();
  // const items = loadItems();
  // const itemAbilityList = loadItemAbilityList({ items });
  // const itemSetList = loadItemSetList({ items, skills: AllSkills });
  const npcs = loadNpcs({});
  //   const multisell = loadMultisell({ items, npcs });
  //   const recipes = loadRecipes({ items });
  //   loadNpcPos({ npcs });
  //   const profs = loadProfs({ skills: AllSkills, items });
  //  const skills = getExistingSkills({skills: new Map([...profSkills, ...npcSkills, ...setSkills])})

  // const ai = loadAi({ npcs, items });

  createDir("result/data/c1");

  // saveFile(
  //   "result/data/items.json",
  //   JSON.stringify(Array.from(items.values()), null, 2)
  // );
  // saveFile(
  //   "result/data/sets.json",
  //   JSON.stringify(Array.from(itemSetList.values()), null, 2)
  // );
  // saveFile(
  //   "result/data/weaponAbilities.json",
  //   JSON.stringify(Array.from(itemAbilityList.values()), null, 2)
  // );
  saveFile(
    "result/data/c1/npcs.json",
    JSON.stringify(Array.from(npcs.values()), null, 2)
  );
  // saveFile(
  //   "result/data/skills.json",
  //   JSON.stringify(Array.from(skills.values()), null, 2)
  // );
  // saveFile(
  //   "result/data/multisell.json",
  //   JSON.stringify(Array.from(multisell.values()), null, 2)
  // );
  // saveFile(
  //   "result/data/recipes.json",
  //   JSON.stringify(Array.from(recipes.values()), null, 2)
  // );
  // saveFile(
  //   "result/data/profs.json",
  //   JSON.stringify(Array.from(profs.values()), null, 2)
  // );
  // saveFile(
  //   "result/data/ai.json",
  //   JSON.stringify(Array.from(ai.values()), null, 2)
  // );
  console.log("Finish.");
}

init();
