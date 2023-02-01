import { loadAiDataC4 } from "../datapack/c4/aidata";
import { AiObj, AiObjData, loadAiGf } from "../datapack/gf/aidata";
import { Ai, AiSellList, Item, Npc } from "../result/types";

export function loadAi(deps: {
  npcs: Map<number, Npc>;
  items: Map<number, Item>;
}) {
  const npcByName = new Map(
    Array.from(deps.npcs.values()).map((x) => [x.npcName, x])
  );
  const ais = loadAiDataC4();
  getAiData({ ...deps, data: loadAiGf() });

  const AiMap = new Map<string, Ai>();
  for (const ai of ais) {
    const npc = npcByName.get(ai.name);
    if (npc) {
      AiMap.set(ai.name, {
        name: ai.name,
        super: ai.super,
        sell_lists: filterSellList({ ...deps, sellLists: ai.sell_lists }),
      });
    }
  }

  console.log("AI loaded.");
  return AiMap;
}

function filterSellList(deps: {
  sellLists: AiSellList[];
  items: Map<number, Item>;
}) {
  const itemByName = new Map(
    Array.from(deps.items.values()).map((x) => [x.itemName, x])
  );

  return deps.sellLists.map((list) => list.filter((x) => itemByName.get(x[0])));
}

function getAiData(deps: { data: AiObj; npcs: Map<number, Npc> }) {
  for (const npc of deps.npcs.values()) {
    const data = deps.data[npc.ai];

    // addSellList("SellList0", data.props?.SellList0);
    // addSellList("SellList1", data.props?.SellList1);
    // addSellList("SellList2", data.props?.SellList2);
    // addSellList("SellList3", data.props?.SellList3);
    // addSellList("SellList4", data.props?.SellList4);
    // addSellList("SellList5", data.props?.SellList5);
    // addSellList("SellList6", data.props?.SellList6);
    // addSellList("SellList7", data.props?.SellList7);
  }
}

// function addSellList(
//   listTitle: string,
//   aiSellList: AiSellList | undefined
// ) {
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
