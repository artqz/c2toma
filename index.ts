import { loadItems } from './import/items';
import { loadNpcs } from './import/npcs';
import { svg } from './import/svg';
import { loadMaps } from './utils/Fs';

function init() {
   const items = loadItems()
  const npcs = loadNpcs({items})
  // const _svg = svg()
  // console.log(_svg);

  
}

init();
