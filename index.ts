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
import { getExistingSkills } from "./import/existingSkills";
import { loadShortNpcs } from "./import/shortNpcs";
import { loadNpcSeaLevel } from "./import/npcSeaLevel";
import { loadQuestsC2 } from "./import/quests";
import { loadSkillCard } from "./import/с1/skillCard";
import { Skill } from "./result/types";

function init() {
  const AllSkills = loadSkills();
  const items = loadItems();
  const quests = loadQuestsC2({ items });
  const itemAbilityList = loadItemAbilityList({ items });
  const itemSetList = loadItemSetList({ items, skills: AllSkills });
  const npcs = loadNpcs({ items, skills: AllSkills });
  // const shortNpcs = loadShortNpcs({ npcs });
  const multisell = loadMultisell({ items, npcs });
  const recipes = loadRecipes({ items });
  loadNpcPos({ npcs });
  loadNpcSeaLevel({ npcs });
  const profs = loadProfs({ skills: AllSkills, items });
  const skills = getExistingSkills({
    skills: new Map([
      ...profSkills,
      ...npcSkills,
      ...setSkills,
      ...fixSkills({ skills: AllSkills }),
    ]),
  });

  const skillCards = loadSkillCard({ chronicle: "c2", skills });

  const ai = loadAi({ npcs, items });

  createDir("result/data/c2");

  saveFile(
    "result/data/c2/items.json",
    JSON.stringify(Array.from(items.values()), null, 2)
  );
  createDir(`result/data/c2/quests`);
  saveFile(
    `result/data/c2/quests/quests.json`,
    JSON.stringify(Array.from(quests.values()), null, 2)
  );
  saveFile(
    "result/data/c2/sets.json",
    JSON.stringify(Array.from(itemSetList.values()), null, 2)
  );
  saveFile(
    "result/data/c2/weaponAbilities.json",
    JSON.stringify(Array.from(itemAbilityList.values()), null, 2)
  );
  saveFile(
    "result/data/c2/npcs.json",
    JSON.stringify(Array.from(npcs.values()), null, 2)
  );
  saveFile(
    "result/data/c2/npcs.json",
    JSON.stringify(Array.from(npcs.values()), null, 2)
  );
  //dlyz enota
  // saveFile(
  //   "result/data/_npcs.json",
  //   JSON.stringify(Array.from(shortNpcs.values()), null, 2)
  // );
  saveFile(
    "result/data/c2/skills.json",
    JSON.stringify(Array.from(skillCards.values()), null, 2)
  );
  saveFile(
    "result/data/c2/multisell.json",
    JSON.stringify(Array.from(multisell.values()), null, 2)
  );
  saveFile(
    "result/data/c2/recipes.json",
    JSON.stringify(Array.from(recipes.values()), null, 2)
  );
  saveFile(
    "result/data/c2/profs.json",
    JSON.stringify(Array.from(profs.values()), null, 2)
  );
  saveFile(
    "result/data/c2/ai.json",
    JSON.stringify(Array.from(ai.values()), null, 2)
  );
  console.log("Finish.");
}

init();

function fixSkills(deps: { skills: Map<string, Skill> }) {
  const fixSkills = new Map<string, Skill>();
  for (const idlvl of ["4275_1", "4275_2"]) {
    const skill = deps.skills.get(idlvl);
    if (skill) {
      fixSkills.set(idlvl, skill);
    }
  }
  return fixSkills;
}
