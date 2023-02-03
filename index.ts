import { loadAi } from "./import/ai";
import { loadItems } from "./import/items";
import { loadMultisell } from "./import/multisell";
import { loadNpcPos } from "./import/npcpos";
import { loadNpcs } from "./import/npcs";
import { loadProfs } from "./import/profs";
import { loadRecipes } from "./import/recipes";
import { loadSkills } from "./import/skills";
import { createDir, saveFile } from "./utils/Fs";

function init() {
  const items = loadItems();
  const skills = loadSkills();
  const npcs = loadNpcs({ items, skills });
  const multisell = loadMultisell({ items });
  const recipes = loadRecipes({ items });
  loadNpcPos({ npcs });
  const profs = loadProfs({ skills, items });
  const ai = loadAi({ npcs, items });
  
  
  createDir("result/data")

  saveFile(
    "result/data/items.json",
    JSON.stringify(Array.from(items.values()), null, 2)
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
