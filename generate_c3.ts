import { loadItemsC3 } from "./import/c3/items";
import { loadNpcsC3 } from "./import/c3/npcs";
import { loadAllSkillsC3 } from "./import/c3/skills";
import { createDir, saveFile } from "./utils/Fs";

const VERSION = "C3";
function init() {
  const items = loadItemsC3();
  const allSkills = loadAllSkillsC3();
  const npcs = loadNpcsC3({ items, skills: allSkills });

  createDir(`result/data/${VERSION}`);

  saveFile(
    `result/data/${VERSION}/items.json`,
    JSON.stringify(Array.from(items.values()), null, 2)
  );
  saveFile(
    `result/data/${VERSION}/skills.json`,
    JSON.stringify(Array.from(allSkills.values()), null, 2)
  );
  saveFile(
    `result/data/${VERSION}/npcs.json`,
    JSON.stringify(Array.from(npcs.values()), null, 2)
  );

  console.log("Finish.");
}

init();
