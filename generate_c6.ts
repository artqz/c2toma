import { loadNpcsC6 } from "./import/c6/npcs";

import { createDir, saveFile } from "./utils/Fs";

const VERSION = "il";
function init() {
  const npcs = loadNpcsC6({});

  createDir(`result/data/${VERSION}`);

  saveFile(
    `result/data/${VERSION}/npcs.json`,
    JSON.stringify(Array.from(npcs.values()), null, 2)
  );

  console.log("Finish.");
}

init();
