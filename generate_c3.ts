import { loadAiC3 } from "./import/c3/ai";
import { getExistingSkillsC3 } from "./import/c3/existingSkills";
import { loadItemsC3 } from "./import/c3/items";
import { loadMultisellC3 } from "./import/c3/multisell";
import { loadNpcPosC3 } from "./import/c3/npcpos";
import { loadNpcsC3, npcSkillsC3 } from "./import/c3/npcs";
import { loadProfsC3, profSkillsC3 } from "./import/c3/profs";
import { loadRecipesC3 } from "./import/c3/recipes";
import { loadSetsC3, setSkillsC3 } from "./import/c3/sets";
import { loadAllSkillsC3 } from "./import/c3/skills";
import { loadItemAbilityListC3 } from "./import/c3/weaponAbilities";
import { createDir, saveFile } from "./utils/Fs";

const VERSION = "C3";
function init() {
  const items = loadItemsC3();
  const itemAbilityList = loadItemAbilityListC3({ items });
  const allSkills = loadAllSkillsC3();
  const npcs = loadNpcsC3({ items, skills: allSkills });
  loadNpcPosC3({ npcs });
  const multisell = loadMultisellC3({ items, npcs });
  const recipes = loadRecipesC3({ items });
  const profs = loadProfsC3({ skills: allSkills, items });
  const sets = loadSetsC3({ items, skills: allSkills });
  const ai = loadAiC3({ items, npcs });
  const skills = getExistingSkillsC3({
    skills: new Map([...profSkillsC3, ...npcSkillsC3, ...setSkillsC3]),
  });

  createDir(`result/data/${VERSION}`);

  saveFile(
    `result/data/${VERSION}/items.json`,
    JSON.stringify(Array.from(items.values()), null, 2)
  );
  saveFile(
    `result/data/${VERSION}/npcs.json`,
    JSON.stringify(Array.from(npcs.values()), null, 2)
  );
  saveFile(
    `result/data/${VERSION}/profs.json`,
    JSON.stringify(Array.from(profs.values()), null, 2)
  );
  saveFile(
    `result/data/${VERSION}/multisell.json`,
    JSON.stringify(Array.from(multisell.values()), null, 2)
  );
  saveFile(
    `result/data/${VERSION}/sets.json`,
    JSON.stringify(Array.from(sets.values()), null, 2)
  );
  saveFile(
    `result/data/${VERSION}/recipes.json`,
    JSON.stringify(Array.from(recipes.values()), null, 2)
  );
  saveFile(
    `result/data/${VERSION}/skills.json`,
    JSON.stringify(Array.from(skills.values()), null, 2)
  );
  saveFile(
    `result/data/${VERSION}/weaponAbilities.json`,
    JSON.stringify(Array.from(itemAbilityList.values()), null, 2)
  );
  saveFile(
    `result/data/${VERSION}/ai.json`,
    JSON.stringify(Array.from(ai.values()), null, 2)
  );

  console.log("Finish.");
}

init();