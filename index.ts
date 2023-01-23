import { loadItems } from './import/items';
import { loadNpcs } from './import/npcs';
import { svg } from './import/svg';
import { loadMaps } from './utils/Fs';

function init() {
  const npcs = loadNpcs()
  const items = loadItems()
  // const _svg = svg()
  // console.log(_svg);

  
}

init();
