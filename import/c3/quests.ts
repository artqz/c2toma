import { loadQuestNamesC3, QuestNameEntryC3 } from '../../datapack/c3/questnames';
import { Item, Quest, QusetProg } from '../../result/types';

export function loadQuestsC3(deps: {
  items: Map<number, Item>;
}) {
  let quests = loadC3Quests(deps)

  return quests;
}

function loadC3Quests(deps: {
  items: Map<number, Item>;
}) {
  
    const map = new Map();
    loadQuestNamesC3().forEach((item) => {
         const key = item.id;
         const collection = map.get(key);
         if (!collection) {
             map.set(key, [item]);
         } else {
             collection.push(item);
         }
    });


    const quests: Quest[] = []
    for (const progs of map.values()) {
       const questProgs:QusetProg[] = []
      for (const quest of progs as QuestNameEntryC3[]) {
        questProgs.push({id: quest.progId, name: quest.progName, desc: quest.desc, items: getItems({...deps, tabs1: quest.tabs1, tabs2: quest.tabs2})})
      }
      quests.push({id: progs[0].id, name: progs[0].name, desc:progs[0].desc, progs: questProgs})
    }


  return quests
}

function getItems(deps: {
  items: Map<number, Item>;
  tabs1: number[],
  tabs2: number[]
}) {
  const items: {itemName: string, count: number}[] = []

  deps.tabs1.forEach((_item, i) => {
    const item = deps.items.get(_item)
    if (item) {
      items.push({itemName: item.itemName, count: deps.tabs2[i]})
    }
  })

  return items
}