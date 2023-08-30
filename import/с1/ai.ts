import {
  AiObj,
  AiObjData,
  AiProps,
  AiSellList,
  loadAiDataC1,
} from "../../datapack/c1/ai";
import { AiEntryC4, loadAiDataC4 } from "../../datapack/c4/aidata";
import { loadAiGf } from "../../datapack/gf/aidata";
import { Ai, AiSellList as AiSL, Item, Npc } from "../../result/types";
import { Chronicle } from "../types";

export function loadAi(deps: {
  chronicle: Chronicle;
  npcs: Map<number, Npc>;
  items: Map<number, Item>;
}) {
  let ai = loadAiData(deps);

  console.log("NPCs AI loaded.");

  return ai;
}

function loadAiData(deps: {
  chronicle: Chronicle;
  npcs: Map<number, Npc>;
  items: Map<number, Item>;
}) {
  switch (deps.chronicle) {
    case "c1":
      return getAi({ ...deps, aiData: loadAiDataC1() });
    case "c4":
      return getAiC4({ ...deps, aiData: loadAiDataC4() });
    case "il":
      return getAi({ ...deps, aiData: loadAiGf() });
    case "gf":
      return getAi({ ...deps, aiData: loadAiGf() });
    default:
      return getAi({ ...deps, aiData: loadAiDataC1() });
  }
}

function getAi(deps: {
  chronicle: Chronicle;
  npcs: Map<number, Npc>;
  aiData: AiObj;
}) {
  const aiMap = new Map<string, Ai>();

  for (const npc of deps.npcs.values()) {
    const list = applyAi({ ...deps, npc });
    if (list) {
      aiMap.set(npc.ai, list);
    }
  }

  return aiMap;
}

function getAiC4(deps: {
  chronicle: Chronicle;
  npcs: Map<number, Npc>;
  items: Map<number, Item>;
  aiData: AiEntryC4[];
}) {
  const aiMap = new Map<string, Ai>();

  for (const ai of deps.aiData.values()) {
    aiMap.set(ai.name, {
      name: ai.name,
      super: ai.super,
      sell_lists: filterSellList({ ...deps, sellLists: ai.sell_lists }),
    });
  }

  return aiMap;
}

// function addSellList(listTitle: string, aiSellList: AiSellList | undefined) {
//   if (aiSellList && aiSellList.length > 0) {
//     if (npc.merchant == null) {
//       npc.merchant = { npc, sellLists: [], tax: aiSellList[0]?.[1] ?? 0 };
//     }
//     const sellList: SellList = { name: listTitle, items: [] };
//     for (const [itemNameRaw, _tax, _unkn1, _unkn2] of aiSellList) {
//       if (itemNameRaw === null) {
//         continue;
//       }
//       const itemName = itemNameRaw.replace(/:/g, "_");
//       const item = deps.items.get(itemName);
//       if (item) {
//         sellList.items.push({ item, price: null });
//         if (item.sellList.findIndex((x) => x.npc.id === npc.id) === -1) {
//           item.sellList.push(npc.merchant);
//         }
//       } else {
//         console.log("Merchant item not found: %s", itemName);
//       }
//     }
//     npc.merchant.sellLists.push(sellList);
//   }
// }

function applyAi(deps: { npc: Npc; aiData: AiObj }) {
  const { aiData, npc } = deps;
  const data: AiObjData | undefined = aiData[npc.ai];

  const aiMap = new Map<string, Ai>();
  if (data) {
    return {
      name: npc.ai,
      super: data.super,
      sell_lists: getSellList(data.props),
    };
  } else {
    return null;
  }
  // if (data) {
  //   addSellList("SellList0", data.props?.SellList0);
  //   addSellList("SellList1", data.props?.SellList1);
  //   addSellList("SellList2", data.props?.SellList2);
  //   addSellList("SellList3", data.props?.SellList3);
  //   addSellList("SellList4", data.props?.SellList4);
  //   addSellList("SellList5", data.props?.SellList5);
  //   addSellList("SellList6", data.props?.SellList6);
  //   addSellList("SellList7", data.props?.SellList7);
  // }
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
