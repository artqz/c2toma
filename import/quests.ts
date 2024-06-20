import { QuestNameEntryC2, loadQuestNamesC2,  } from '../datapack/c2/questnames';
import { loadQuestNamesGF } from '../datapack/gf/questnames';
import { Item, Quest, QusetProg } from '../result/types';

export function loadQuestsC2(deps: {
  items: Map<number, Item>;
}) {
  let quests = loadC2Quests(deps)

  return quests;
}

function loadC2Quests(deps: {
  items: Map<number, Item>;
}) {
  
  const map = new Map();
    loadQuestNamesC2().forEach((item) => {
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
    for (const progs of Array.from(map.values()) as QuestNameEntryC2[][]) {
       const questProgs:QusetProg[] = []
      for (const quest of progs) {
        const questRu = questsRuById.get(quest.id+"_"+quest.level)
        questProgs.push({id: quest.level, name: {en: `Step ${quest.level}`, ru: `Шаг ${quest.level}` ?? `Step ${quest.level}`}, desc: {en: quest.desc, ru: questRu?.desc.ru ?? quest.desc}, items: []})
      }
       const questRu = questsRuById.get(progs[0].id+"_"+progs[0].level)
      quests.push({id: progs[0].id, name: {en: progs[0].name, ru:  questRu?.name.ru ?? progs[0].name}, desc:{en:progs[0].desc, ru: questRu?.short_desc.ru ?? progs[0].desc}, progs: questProgs})
    }

  return quests

  }