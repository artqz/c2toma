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
    Array.from(deps.items.values()).map((x) => [x.itemName, x])
  );

  return deps.sellLists.map((list) => list.filter((x) => itemByName.get(x[0])));
}
