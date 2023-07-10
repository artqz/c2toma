import { loadQuestNamesC2,  } from '../datapack/c2/questnames';
import { Item, Quest } from '../result/types';

export function loadQuestsC2(deps: {
  items: Map<number, Item>;
}) {
  let quests = loadC2Quests(deps)

  return quests;
}

function loadC2Quests(deps: {
  items: Map<number, Item>;
}) {
  
    const quests: Quest[] = [];
    loadQuestNamesC2().forEach((q) => {
        quests.push({id: q.id, name: q.name, desc: q.desc, progs: []})
    });

  return quests
}

