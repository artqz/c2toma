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
import { loadNpcBuffs } from "./import/с1/npcBuffs";
import { loadSkillCard } from "./import/с1/skillCard";
import { loadZones } from "./import/с1/zones";

const chronicle: Chronicle = "il";
function init() {
  createDir(`result/data/${chronicle}`);
  // const zones = loadZones({ chronicle });
  // saveFile(
  //   `result/data/${chronicle}/zones.json`,
  //   JSON.stringify(zones, null, 2)
  // );
  const skills = loadSkills({ chronicle });
  const skillCard = loadSkillCard({ chronicle, skills });
  saveFile(
    `result/data/${chronicle}/skills.json`,
    JSON.stringify(Array.from(skillCard.values()), null, 2)
  );
  const items = loadItems({ chronicle });
  saveFile(
    `result/data/${chronicle}/items.json`,
    JSON.stringify(Array.from(items.values()), null, 2)
  );
  const weaponAbilities = loadWeaponAbilities({ chronicle, items });
  saveFile(
    `result/data/${chronicle}/weaponAbilities.json`,
    JSON.stringify(Array.from(weaponAbilities.values()), null, 2)
  );
  const sets = loadSets({ chronicle, items, skills });
  saveFile(
    `result/data/${chronicle}/sets.json`,
    JSON.stringify(Array.from(sets.values()), null, 2)
  );
  const quests = loadQuests({ chronicle, items });
  createDir(`result/data/${chronicle}/quests`);
  saveFile(
    `result/data/${chronicle}/quests/quests.json`,
    JSON.stringify(Array.from(quests.values()), null, 2)
  );
  const npcs = loadNpcs({ chronicle, items, skills });
  loadNpcBuffs({ chronicle, npcs, skills });
  loadNpcPos({ chronicle, npcs });
  loadNpcSeaLevel({ chronicle, npcs });
  saveFile(
    `result/data/${chronicle}/npcs.json`,
    JSON.stringify(Array.from(npcs.values()), null, 2)
  );
  const multisell = loadMultisell({ chronicle, items, npcs });
  saveFile(
    `result/data/${chronicle}/multisell.json`,
    JSON.stringify(Array.from(multisell.values()), null, 2)
  );
  const recipes = loadRecipes({ chronicle, items });
  saveFile(
    `result/data/${chronicle}/recipes.json`,
    JSON.stringify(Array.from(recipes.values()), null, 2)
  );
  const profs = loadProfs({ chronicle, skills, items });
  saveFile(
    `result/data/${chronicle}/profs.json`,
    JSON.stringify(Array.from(profs.values()), null, 2)
  );
  const ai = loadAi({ chronicle, npcs, items });
  saveFile(
    `result/data/${chronicle}/ai.json`,
    JSON.stringify(Array.from(ai.values()), null, 2)
  );
  console.log("Finish.");
}

init();
