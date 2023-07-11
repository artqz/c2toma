import { loadQuestNamesC3, QuestNameEntryC3 } from '../../datapack/c3/questnames';
import { loadQuestNamesGF } from '../../datapack/gf/questnames';
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


const questsRuById = new Map(
    loadQuestNamesGF().map((q) => [q.id + "_" + q.progId, q])
  );

    const quests: Quest[] = []
    for (const progs of Array.from(map.values()) as QuestNameEntryC3[][]) {
       const questProgs:QusetProg[] = []
      for (const quest of progs) {
        const questRu = questsRuById.get(quest.id+"_"+quest.progId)
        questProgs.push({id: quest.progId, name: {en: quest.progName, ru: questRu?.name.ru ?? ""}, desc: {en: quest.desc, ru: questRu?.desc.ru ?? ""}, items: getItems({...deps, tabs1: quest.tabs1, tabs2: quest.tabs2})})
      }
      const questRu = questsRuById.get(progs[0].id+"_"+progs[0].progId)
      quests.push({id: progs[0].id, name: {en: progs[0].name, ru: questRu?.name.ru ?? ""}, desc:{en: progs[0].desc, ru: questRu?.desc.ru ?? ""}, progs: questProgs})
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