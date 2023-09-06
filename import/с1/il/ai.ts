import { AiProps } from '../../../datapack/c1/ai';
import { AiObjData, loadAiGf, AiSellList } from '../../../datapack/gf/aidata';
import { Ai, Item, Npc, AiSellList as AiSL } from '../../../result/types';

export function generaAiIL(deps:{items: Map <number, Item>, npcs: Map <number, Npc>}) {
  const aiMap = new Map<string, Ai>();
  
  for (const npc of deps.npcs.values()) {
    const list = applyAi({...deps, npc})
    if (list) {
      aiMap.set(npc.ai, list);
    }
  }
  
  return aiMap
}

function applyAi(deps: { items: Map <number, Item>, npc: Npc }): Ai | undefined {
    const { npc } = deps;
  const aiData = loadAiGf() 
  const data: AiObjData | undefined = aiData[npc.ai];

  if (data) {
    return {
      name: npc.ai,
      super: data.super,
      sell_lists: getSellList({...deps, aiProps: data.props}),
    };
  } else {
    return undefined;
  }

}

function getSellList(deps: {items: Map <number, Item>, aiProps: AiProps | undefined}): AiSL[] {
  const newList: AiSL[] = [];
  const {aiProps} = deps
  aiProps?.SellList0 && newList.push(addSellList({...deps, aiSellList: aiProps?.SellList0}));
  aiProps?.SellList1 && newList.push(addSellList({...deps, aiSellList: aiProps?.SellList1}));
  aiProps?.SellList2 && newList.push(addSellList({...deps, aiSellList: aiProps?.SellList2}));
  aiProps?.SellList3 && newList.push(addSellList({...deps, aiSellList: aiProps?.SellList3}));
  aiProps?.SellList4 && newList.push(addSellList({...deps, aiSellList: aiProps?.SellList4}));
  aiProps?.SellList5 && newList.push(addSellList({...deps, aiSellList: aiProps?.SellList5}));
  aiProps?.SellList6 && newList.push(addSellList({...deps, aiSellList: aiProps?.SellList6}));
  aiProps?.SellList7 && newList.push(addSellList({...deps, aiSellList: aiProps?.SellList7}));
  return newList;
}

function addSellList(deps: {items: Map <number, Item>, aiSellList: AiSellList | undefined}) {
  const itemByName = new Map(Array.from(deps.items.values()).map(i => [i.itemName, i]))

  const newList: AiSL = [];
  if (deps.aiSellList && deps.aiSellList.length > 0) {
    for (const [i, sell] of deps.aiSellList.entries()) {
      const item = itemByName.get(sell[0]!)
      if (item) {
        newList.push([sell[0]!, sell[1]!, 0, 0]);
      }
      
    }
  }
  return newList;
}