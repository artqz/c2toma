import { loadItems } from "./import/items";
import { loadMultisell } from "./import/multisell";
import { loadNpcs } from "./import/npcs";
import { loadSkills } from "./import/skills";
import { saveFile } from "./utils/Fs";

function init() {
  const items = loadItems();
  const skills = loadSkills();
  const npcs = loadNpcs({ items });
  const multisell = loadMultisell({ items });

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
  saveFile(
    "result/data/skills.json",
    JSON.stringify(Array.from(skills.values()), null, 2)
  );
  saveFile(
    "result/data/multisell.json",
    JSON.stringify(Array.from(multisell.values()), null, 2)
  );
}

init();
