import { loadAiDataC4 } from "../datapack/c4/aidata";
import { Ai, AiSellList, Item, Npc } from "../result/types";

export function loadAi(deps: {
  npcs: Map<number, Npc>;
  items: Map<number, Item>;
}) {
  const npcByName = new Map(
    Array.from(deps.npcs.values()).map((x) => [x.npcName, x])
  );
  const ais = loadAiDataC4();

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
    Array.from(deps.items.values()).map((x) => [x.itemName.replace("'", "_"), x])
  );

 
const lists = new Map<number, AiSellList>()
for (const [i, list] of deps.sellLists.entries()) {
  const newList: AiSellList = []
  for (const x of list.values()) {
    const item = itemByName.get(x[0])
    if (item) {
      newList.push([item.itemName, x[1], x[2], x[3]])
    }
  }
  lists.set(i, newList)
}

return Array.from(lists.values())

  
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
