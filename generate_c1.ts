import { loadNpcPos } from "./import/c1/npcpos";
import { loadItems } from "./import/c1/items";
import { loadNpcs } from "./import/c1/npcs";
import { loadSkills } from "./import/c1/skills";
import { createDir, saveFile } from "./utils/Fs";
import { loadMultisell } from "./import/c1/multisell";
import { loadRecipes } from "./import/c1/recipes";
import { loadAi } from "./import/c1/ai";
import { loadSets } from "./import/c1/sets";
import { loadProfs } from "./import/c1/profs";
import { loadWeaponAbilities } from "./import/c1/weaponAbilities";
import { Chronicle } from "./import/types";
import { loadQuests } from "./import/c1/quests";
import { loadNpcBuffs } from "./import/c1/npcBuffs";
import { loadSkillCard } from "./import/c1/skillCard";
import { generateAgroPatch } from "./import/c1/npcAggroPatch";
import { loadCapsuleItems } from "./import/c1/capsule/items";
import { loadPetsData } from "./import/c1/pets";

const chronicle: Chronicle = "c4";

function init() {
  createDir(`result/data/${chronicle}`);
  // const zones = loadZones({ chronicle });
  // saveFile(
  //   `result/data/${chronicle}/zones.json`,
  //   JSON.stringify(zones, null, 2)
  // );
  const { skills, effects } = loadSkills({ chronicle });
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
  const capsules = loadCapsuleItems({ effects, items })
  saveFile(
    `result/data/${chronicle}/capsules.json`,
    JSON.stringify(Array.from(capsules.values()), null, 2)
  );
  const sets = loadSets({ chronicle, items, skills });
  saveFile(
    `result/data/${chronicle}/sets.json`,
    JSON.stringify(Array.from(sets.values()), null, 2)
  );
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
  // loadNpcSeaLevel({ chronicle, npcs });
  saveFile(
    `result/data/${chronicle}/npcs.json`,
    JSON.stringify(Array.from(npcs.values()), null, 2)
  );
  const multisell = loadMultisell({ chronicle, items, npcs });
  saveFile(
    `result/data/${chronicle}/multisell.json`,
    JSON.stringify(Array.from(multisell.values()), null, 2)
  );
  const weaponAbilities = loadWeaponAbilities({ chronicle, items, multisell });
  saveFile(
    `result/data/${chronicle}/weaponAbilities.json`,
    JSON.stringify(Array.from(weaponAbilities.values()), null, 2)
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
  loadPetsData({ npcs });
  // AGGR
  createDir(`result/patch/${chronicle}`);
  saveFile(
    `result/patch/${chronicle}/aggr.json`,
    JSON.stringify(generateAgroPatch({ npcs, ais: ai, skills }), null, 2)
  );
  // Fix Quests
  // if (chronicle === "c4") {
  //   loadNewQuestData({ npcs });
  // }
  console.log("Finish.");
}

init();
