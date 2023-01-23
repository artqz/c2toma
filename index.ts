import { loadItems } from "./import/items";
import { loadNpcs } from "./import/npcs";
import { svg } from "./import/svg";
import { loadMaps, saveFile } from "./utils/Fs";

function init() {
  const items = loadItems();
  const npcs = loadNpcs({ items });
  // const _svg = svg()
  // console.log(_svg);

  saveFile(
    "result/data/items.json",
    JSON.stringify(Array.from(items.values()), null, 2)
  );
  saveFile(
    "result/data/npcs.json",
    JSON.stringify(Array.from(npcs.values()), null, 2)
  );
}

init();
