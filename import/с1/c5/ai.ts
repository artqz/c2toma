import { AiProps } from "../../../datapack/c1/ai";
import { AiEntryC4, loadAiDataC4 } from '../../../datapack/c4/aidata';
import { loadNpcDataC4 } from '../../../datapack/c4/npcdata';
import {
  AiObjData,
  loadAiGf,
  AiSellList,
  AiObj,
} from "../../../datapack/gf/aidata";
import { loadNpcDataGF } from '../../../datapack/gf/npcdata';
import { Ai, Item, Npc, AiSellList as AiSL } from "../../../result/types";

export function generaAiC5(deps: {
  items: Map<number, Item>;
  npcs: Map<number, Npc>;
}) {
  let aiMap = new Map<string, Ai>();
  const aiData = loadAiGf();
  const aiDataC4 = new Map(loadAiDataC4().map(a=> [a.name, a]));
  const npcByNameC4 = new Map(loadNpcDataC4().map(n => [n.$[2], n]))
  const npcByNameGF = new Map(loadNpcDataGF().map(n => [n.$[2], n]))

  for (const npc of deps.npcs.values()) {
    const npcC4 = npcByNameC4.get(npc.npcName)
    if (npcC4) {
      const list = getAiC4(aiDataC4, npc);
      if (list) {
        aiMap.set(npc.ai, list);
      }
    } else {
      const npcGF = npcByNameGF.get(npc.npcName)
      if (npcGF) {
        const list = applyAi(aiData, npc);
        if (list) {
          aiMap.set(npc.ai, list);
        }
      }
    }
    
  }

  aiMap = filterAi({ ...deps, aiMap });

  return aiMap;
}

function getAiC4(aiData: Map<string, AiEntryC4>, npc: Npc): Ai | undefined {
  const data = aiData.get(npc.ai);
  if (data) {
    return {
      name: npc.ai,
      super: data.super,
      sell_lists: data.sell_lists,
    };
  } else {
    return undefined;
  }
}

function filterSellList(deps: { sellLists: AiSL[]; items: Map<number, Item> }) {
  const itemByName = new Map(
    Array.from(deps.items.values()).map((x) => [
      x.itemName.replace("'", "_"),
      x,
    ])
  );

  const lists = new Map<number, AiSL>();
  for (const [i, list] of deps.sellLists.entries()) {
    const newList: AiSL = [];
    for (const x of list.values()) {
      if (!excludedItems.has(x[0])) {
        const item = itemByName.get(x[0]);
        if (item) {
          newList.push([item.itemName, x[1], x[2], x[3]]);
        }
      } else {
        console.log(`------------ ${x[0]}`);
      }
    }
    lists.set(i, newList);
  }

  return Array.from(lists.values());
}

const excludedItems = new Set([""]);

function applyAi(aiData: AiObj, npc: Npc): Ai | undefined {
  const data: AiObjData | undefined = aiData[npc.ai];
  if (data) {
    return {
      name: npc.ai,
      super: data.super,
      sell_lists: getSellList(data.props),
    };
  } else {
    return undefined;
  }
}

function getSellList(aiProps: AiProps | undefined) {
  const newList: AiSL[] = [];

  aiProps?.SellList0 && newList.push(addSellList(aiProps?.SellList0));
  aiProps?.SellList1 && newList.push(addSellList(aiProps?.SellList1));
  aiProps?.SellList2 && newList.push(addSellList(aiProps?.SellList2));
  aiProps?.SellList3 && newList.push(addSellList(aiProps?.SellList3));
  aiProps?.SellList4 && newList.push(addSellList(aiProps?.SellList4));
  aiProps?.SellList5 && newList.push(addSellList(aiProps?.SellList5));
  aiProps?.SellList6 && newList.push(addSellList(aiProps?.SellList6));
  aiProps?.SellList7 && newList.push(addSellList(aiProps?.SellList7));
  return newList;
}

function addSellList(aiSellList: AiSellList | undefined) {
  const newList: AiSL = [];
  if (aiSellList && aiSellList.length > 0) {
    for (const [i, sell] of aiSellList.entries()) {
      newList.push([sell[0]!, sell[1]!, 0, 0]);
    }
  }
  return newList;
}

function filterAi(deps: { items: Map<number, Item>; aiMap: Map<string, Ai> }) {
  const itemByName = new Map(
    Array.from(deps.items.values()).map((i) => [i.itemName, i])
  );

  const newMapAi = new Map<string, Ai>();
  for (const ai of deps.aiMap.values()) {
    const newList: AiSL[] = [];
    for (const list of ai.sell_lists) {
      const newSell: AiSL = [];
      for (const item of list) {
        if (itemByName.has(item[0])) {
          newSell.push([item[0], item[1], item[2], item[3]]);
        }
      }
      newList.push(newSell);
    }
    newMapAi.set(ai.name, {
      name: ai.name,
      super: ai.super,
      sell_lists: newList,
    });
  }

  return newMapAi;
}
