import { loadItemsC6 } from "./import/c6/items";
import { loadNpcsC6 } from "./import/c6/npcs";
import { loadSkillsC6 } from './import/c6/skills';

import { createDir, saveFile } from "./utils/Fs";

const VERSION = "il";
function init() {
  const items = loadItemsC6();
  const skills = loadSkillsC6();
  const npcs = loadNpcsC6({});

  createDir(`result/data/${VERSION}`);
  saveFile(
      `result/data/${VERSION}/skills.json`,
      JSON.stringify(Array.from(skills.values()), null, 2)
    );
  saveFile(
    `result/data/${VERSION}/items.json`,
    JSON.stringify(Array.from(items.values()), null, 2)
  );
  saveFile(
    `result/data/${VERSION}/npcs.json`,
    JSON.stringify(Array.from(npcs.values()), null, 2)
  );

  console.log("Finish.");
}

init();
