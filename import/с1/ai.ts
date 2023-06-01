import {
  AiObj,
  AiObjData,
  AiProps,
  AiSellList,
  loadAiDataC1,
} from "../../datapack/c1/ai";
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

function loadAiData(deps: { chronicle: Chronicle; npcs: Map<number, Npc> }) {
  let aiData;
  switch (deps.chronicle) {
    case "c1":
      aiData = loadAiDataC1();
      break;
    default:
      aiData = loadAiDataC1();
      break;
  }

  for (const npc of deps.npcs.values()) {
    const data: AiObjData | undefined = aiData[npc.ai];

    applyAi({ ...deps, npc, aiData });
  }

  return [];
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
    aiMap.set(npc.ai, {
      name: npc.ai,
      super: data.super,
      sell_lists: getSellList(data.props),
    });
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
  const lists = new Map<number, AiSL>();
  addSellList(aiProps?.SellList0);
  addSellList(aiProps?.SellList1);
  addSellList(aiProps?.SellList2);
  addSellList(aiProps?.SellList3);
  addSellList(aiProps?.SellList4);
  addSellList(aiProps?.SellList5);
  addSellList(aiProps?.SellList6);
  addSellList(aiProps?.SellList7);
  // ["SellList0", "SellList1", "SellList2", "SellList3", "SellList4", "SellList5", "SellList6", "SellList7"].map(sl => {
  //   const newList: AiSL = [];
  //   if (aiProps?["sl"] ) {
  //     // for (const [i, sell] of aiProps?[sl].entries()) {
  //     //   newList.push([sell[0]!, sell[1]!, 0, 0]);
  //     // }
  //   }
  // })

  return [];
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
