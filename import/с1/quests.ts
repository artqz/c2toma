import {
  loadQuestNamesC1,
  QuestNameEntryC1,
} from "../../datapack/c1/questnames";
import {
  loadQuestNamesC4,
  QuestNameEntryC4,
} from "../../datapack/c4/questnames";
import { loadQuestNamesC5 } from '../../datapack/c5/questnames';
import {
  loadQuestNamesGF,
  QuestNameEntryGF,
} from "../../datapack/gf/questnames";
import { loadQuestNamesIL } from "../../datapack/il/questnames";
import { Item, Quest, QusetProg } from "../../result/types";
import { Chronicle } from "../types";

export function loadQuests(deps: {
  chronicle: Chronicle;
  items: Map<number, Item>;
}) {
  let quests = loadQuestsData(deps);

  console.log("Quests loaded.");

  return quests;
}

function loadQuestsData(deps: {
  chronicle: Chronicle;
  items: Map<number, Item>;
}) {
  let questData = [];
  switch (deps.chronicle) {
    case "c1":
      questData = loadQuestsC1();
      break;
    case "c4":
      questData = loadQuestsC4(deps);
      break;
    case "c5":
      questData = loadQuestsC5(deps);
      break;
    case "il":
      questData = loadQuestsIL(deps);
      break;
    case "gf":
      questData = loadQuestsGf(deps);
      break;
    default:
      questData = loadQuestsC1();
      break;
  }

  return questData;
}

function loadQuestsC4(deps: { items: Map<number, Item> }) {
  const map = new Map();
  loadQuestNamesC4().forEach((item) => {
    const key = item.id;
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });

  const quests: Quest[] = [];
  for (const progs of Array.from(map.values()) as QuestNameEntryC4[][]) {
    const questProgs: QusetProg[] = [];
    for (const quest of progs) {
      questProgs.push({
        id: quest.progId,
        name: { en: quest.progName, ru: quest.progName },
        desc: { en: quest.desc, ru: quest.desc },
        items: getItems({ ...deps, tabs1: quest.tabs1, tabs2: quest.tabs2 }),
      });
    }
    quests.push({
      id: progs[0].id,
      name: { en: progs[0].name, ru: progs[0].name },
      desc: { en: progs[0].short_desc, ru: progs[0].short_desc },
      progs: questProgs,
    });
  }

  return quests;
}

function loadQuestsC5(deps: { items: Map<number, Item> }) {
  const map = new Map();
  loadQuestNamesC5().forEach((item) => {
    const key = item.id;
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });

  const questRuById = new Map(
    loadQuestNamesGF().map((q) => [q.id + "_" + q.progId, q])
  );

  const quests: Quest[] = [];
  for (const progs of Array.from(map.values()) as QuestNameEntryGF[][]) {
    const questProgs: QusetProg[] = [];
    for (const quest of progs) {
      const questRu = questRuById.get(quest.id + "_" + quest.progId);
      questProgs.push({
        id: quest.progId,
        name: { ...quest.progName, ru: questRu?.name.ru ?? quest.name.en },
        desc: { ...quest.desc, ru: questRu?.desc.ru ?? quest.desc.en },
        items: getItems({ ...deps, tabs1: quest.tabs1, tabs2: quest.tabs2 }),
      });
    }
    const questRu = questRuById.get(progs[0].id + "_" + progs[0].progId);
    quests.push({
      id: progs[0].id,
      name: { ...progs[0].name, ru: questRu?.name.ru ?? progs[0].name.en },
      desc: {
        ...progs[0].short_desc,
        ru: questRu?.short_desc.ru ?? progs[0].short_desc.en,
      },
      progs: questProgs,
    });
  }

  return quests;
}

function loadQuestsIL(deps: { items: Map<number, Item> }) {
  const map = new Map();
  loadQuestNamesIL().forEach((item) => {
    const key = item.id;
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });

  const questRuById = new Map(
    loadQuestNamesGF().map((q) => [q.id + "_" + q.progId, q])
  );

  const quests: Quest[] = [];
  for (const progs of Array.from(map.values()) as QuestNameEntryGF[][]) {
    const questProgs: QusetProg[] = [];
    for (const quest of progs) {
      const questRu = questRuById.get(quest.id + "_" + quest.progId);
      questProgs.push({
        id: quest.progId,
        name: { ...quest.progName, ru: questRu?.name.ru ?? quest.name.en },
        desc: { ...quest.desc, ru: questRu?.desc.ru ?? quest.desc.en },
        items: getItems({ ...deps, tabs1: quest.tabs1, tabs2: quest.tabs2 }),
      });
    }
    const questRu = questRuById.get(progs[0].id + "_" + progs[0].progId);
    quests.push({
      id: progs[0].id,
      name: { ...progs[0].name, ru: questRu?.name.ru ?? progs[0].name.en },
      desc: {
        ...progs[0].short_desc,
        ru: questRu?.short_desc.ru ?? progs[0].short_desc.en,
      },
      progs: questProgs,
    });
  }

  return quests;
}

function loadQuestsGf(deps: { items: Map<number, Item> }) {
  const map = new Map();
  loadQuestNamesGF().forEach((item) => {
    const key = item.id;
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });

  const quests: Quest[] = [];
  for (const progs of Array.from(map.values()) as QuestNameEntryGF[][]) {
    const questProgs: QusetProg[] = [];
    for (const quest of progs) {
      questProgs.push({
        id: quest.progId,
        name: quest.progName,
        desc: quest.desc,
        items: getItems({ ...deps, tabs1: quest.tabs1, tabs2: quest.tabs2 }),
      });
    }
    quests.push({
      id: progs[0].id,
      name: progs[0].name,
      desc: progs[0].short_desc,
      progs: questProgs,
    });
  }

  return quests;
}

function loadQuestsC1() {
  {
    const map = new Map();
    loadQuestNamesC1().forEach((item) => {
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

    const quests: Quest[] = [];
    for (const progs of Array.from(map.values()) as QuestNameEntryC1[][]) {
      const questProgs: QusetProg[] = [];
      for (const quest of progs) {
        const questRu = questsRuById.get(quest.id + "_" + quest.level);
        questProgs.push({
          id: quest.level,
          name: {
            en: quest.name + `Step ${quest.level}`,
            ru: `Шаг ${quest.level}` ?? `Step ${quest.level}`,
          },
          desc: { en: quest.desc, ru: questRu?.desc.ru ?? quest.desc },
          items: [],
        });
      }
      const questRu = questsRuById.get(progs[0].id + "_" + progs[0].level);
      quests.push({
        id: progs[0].id,
        name: { en: progs[0].name, ru: questRu?.name.ru ?? progs[0].name },
        desc: {
          en: progs[0].desc,
          ru: questRu?.short_desc.ru ?? progs[0].desc,
        },
        progs: questProgs,
      });
    }

    return quests;
  }
}

function getItems(deps: {
  items: Map<number, Item>;
  tabs1: number[];
  tabs2: number[];
}) {
  const items: { itemName: string; count: number }[] = [];

  deps.tabs1.forEach((_item, i) => {
    const item = deps.items.get(_item);
    if (item) {
      items.push({ itemName: item.itemName, count: deps.tabs2[i] });
    }
  });

  return items;
}
