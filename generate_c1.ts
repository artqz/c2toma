import { loadNpcPos } from "./import/с1/npcpos";
import { loadItems } from "./import/с1/items";
import { loadNpcs } from "./import/с1/npcs";
import { loadSkills } from "./import/с1/skills";
import { createDir, saveFile } from "./utils/Fs";
import { loadMultisell } from "./import/с1/multisell";
import { loadRecipes } from "./import/с1/recipes";
import { loadAi } from "./import/с1/ai";
import { loadSets } from "./import/с1/sets";
import { loadProfs } from "./import/с1/profs";
import { loadWeaponAbilities } from "./import/с1/weaponAbilities";
import { loadNpcSeaLevel } from "./import/с1/npcSeaLevel";
import { Chronicle } from "./import/types";
import { loadQuests } from "./import/с1/quests";

const chronicle: Chronicle = "gf";
function init() {
  const skills = loadSkills({ chronicle });
  const items = loadItems({ chronicle });
  const quests = loadQuests({ chronicle, items });
  const weaponAbilities = loadWeaponAbilities({ chronicle, items });
  const sets = loadSets({ chronicle, items, skills });
  const npcs = loadNpcs({ chronicle, items, skills });
  const multisell = loadMultisell({ chronicle, items, npcs });
  const recipes = loadRecipes({ chronicle, items });
  loadNpcPos({ chronicle, npcs });
  loadNpcSeaLevel({ chronicle, npcs });
  const profs = loadProfs({ chronicle, skills, items });

  const ai = loadAi({ chronicle, npcs, items });

  createDir(`result/data/${chronicle}`);

  saveFile(
    `result/data/${chronicle}/skills.json`,
    JSON.stringify(Array.from(skills.values()), null, 2)
  );
  saveFile(
    `result/data/${chronicle}/items.json`,
    JSON.stringify(Array.from(items.values()), null, 2)
  );
  createDir(`result/data/${chronicle}/quests`);
  saveFile(
    `result/data/${chronicle}/quests/quests.json`,
    JSON.stringify(Array.from(quests.values()), null, 2)
  );
  saveFile(
    `result/data/${chronicle}/sets.json`,
    JSON.stringify(Array.from(sets.values()), null, 2)
  );
  saveFile(
    `result/data/${chronicle}/weaponAbilities.json`,
    JSON.stringify(Array.from(weaponAbilities.values()), null, 2)
  );
  saveFile(
    `result/data/${chronicle}/npcs.json`,
    JSON.stringify(Array.from(npcs.values()), null, 2)
  );
  saveFile(
    `result/data/${chronicle}/multisell.json`,
    JSON.stringify(Array.from(multisell.values()), null, 2)
  );
  saveFile(
    `result/data/${chronicle}/recipes.json`,
    JSON.stringify(Array.from(recipes.values()), null, 2)
  );
  saveFile(
    `result/data/${chronicle}/profs.json`,
    JSON.stringify(Array.from(profs.values()), null, 2)
  );
  saveFile(
    `result/data/${chronicle}/ai.json`,
    JSON.stringify(Array.from(ai.values()), null, 2)
  );
  console.log("Finish.");
}

init();
