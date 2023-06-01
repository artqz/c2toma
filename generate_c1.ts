import { loadNpcPos } from './import/с1/npcpos';
import { loadItems } from "./import/с1/items";
import { loadNpcs } from "./import/с1/npcs";
import { loadSkills } from "./import/с1/skills";
import { createDir, saveFile } from "./utils/Fs";
import { loadMultisell } from './import/с1/multisell';

const chronicle = "c1";
function init() {
  const skills = loadSkills({ chronicle });
  const items = loadItems({ chronicle });
  // const itemAbilityList = loadItemAbilityList({ items });
  // const itemSetList = loadItemSetList({ items, skills: AllSkills });
  const npcs = loadNpcs({ chronicle, items, skills });
  const multisell = loadMultisell({ chronicle, items, npcs });
  //   const recipes = loadRecipes({ items });
  loadNpcPos({ chronicle, npcs });
  //   const profs = loadProfs({ skills: AllSkills, items });
  //  const skills = getExistingSkills({skills: new Map([...profSkills, ...npcSkills, ...setSkills])})

  // const ai = loadAi({ npcs, items });

  createDir(`result/data/${chronicle}`);

  saveFile(
    `result/data/${chronicle}/skills.json`,
    JSON.stringify(Array.from(skills.values()), null, 2)
  );
  saveFile(
    `result/data/${chronicle}/items.json`,
    JSON.stringify(Array.from(items.values()), null, 2)
  );
  // saveFile(
  //   "result/data/sets.json",
  //   JSON.stringify(Array.from(itemSetList.values()), null, 2)
  // );
  // saveFile(
  //   "result/data/weaponAbilities.json",
  //   JSON.stringify(Array.from(itemAbilityList.values()), null, 2)
  // );
  saveFile(
    `result/data/${chronicle}/npcs.json`,
    JSON.stringify(Array.from(npcs.values()), null, 2)
  );
  // saveFile(
  //   "result/data/skills.json",
  //   JSON.stringify(Array.from(skills.values()), null, 2)
  // );
  saveFile(
    `result/data/${chronicle}/multisell.json`,
    JSON.stringify(Array.from(multisell.values()), null, 2)
  );
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
