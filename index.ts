import { loadItemAbilityList } from "./import/items/itemAbilityList";
import { loadAi } from "./import/ai";
import { loadItems } from "./import/items/items";
import { loadMultisell } from "./import/multisell";
import { loadNpcPos } from "./import/npcpos";
import { loadNpcs, npcSkills } from "./import/npcs";
import { loadProfs, profSkills } from "./import/profs";
import { loadRecipes } from "./import/recipes";
import { loadSkills } from "./import/skills";
import { createDir, saveFile } from "./utils/Fs";
import { loadItemSetList, setSkills } from "./import/items/itemSetList";
import { getExistingSkills } from './import/existingSkills';

function init() {
  const AllSkills = loadSkills();
  const items = loadItems();
  const itemAbilityList = loadItemAbilityList({ items });
  const itemSetList = loadItemSetList({ items, skills: AllSkills });
  const npcs = loadNpcs({ items, skills: AllSkills });
  const multisell = loadMultisell({ items, npcs });
  const recipes = loadRecipes({ items });
  loadNpcPos({ npcs });
  const profs = loadProfs({ skills: AllSkills, items });
 const skills = getExistingSkills({skills: new Map([...profSkills, ...npcSkills, ...setSkills])})

  
  const ai = loadAi({ npcs, items });

  createDir("result/data");

  saveFile(
    "result/data/items.json",
    JSON.stringify(Array.from(items.values()), null, 2)
  );
  saveFile(
    "result/data/sets.json",
    JSON.stringify(Array.from(itemSetList.values()), null, 2)
  );
  saveFile(
    "result/data/weaponAbilities.json",
    JSON.stringify(Array.from(itemAbilityList.values()), null, 2)
  );
  saveFile(
    "result/data/npcs.json",
    JSON.stringify(Array.from(npcs.values()), null, 2)
  );
  saveFile(
    "result/data/skills.json",
    JSON.stringify(Array.from(skills.values()), null, 2)
  );
  saveFile(
    "result/data/multisell.json",
    JSON.stringify(Array.from(multisell.values()), null, 2)
  );
  saveFile(
    "result/data/recipes.json",
    JSON.stringify(Array.from(recipes.values()), null, 2)
  );
  saveFile(
    "result/data/profs.json",
    JSON.stringify(Array.from(profs.values()), null, 2)
  );
  saveFile(
    "result/data/ai.json",
    JSON.stringify(Array.from(ai.values()), null, 2)
  );
  console.log("Finish.");
}

init();
