import { AiProps } from "../../../datapack/c1/ai";
import {
  AiObjData,
  loadAiGf,
  AiSellList,
  AiObj,
} from "../../../datapack/gf/aidata";
import { Ai, Item, Npc, AiSellList as AiSL } from "../../../result/types";

export function generaAiIL(deps: {
  items: Map<number, Item>;
  npcs: Map<number, Npc>;
}) {
  let aiMap = new Map<string, Ai>();
  const aiData = loadAiGf();

  for (const npc of deps.npcs.values()) {
    const list = applyAi(aiData, npc);
    if (list) {
      aiMap.set(npc.ai, list);
    }
  }

  aiMap = filterAi({ ...deps, aiMap });

  return aiMap;
}

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
          if (!EXTRA_ITEMS.has(item[0])) {
            newSell.push([item[0], item[1], item[2], item[3]]);
          }
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

const EXTRA_ITEMS = new Set([
  "sb_greater_heal11",
  "sb_greater_group_heal11",
  "sb_resist_shock1",
  "sb_return1",
  "sb_mana_regeneration",
  "sb_might_of_heaven11",
  "sb_mass_summon_aqua_cubic",
  "sb_bless_shield1",
  "sb_surrender_to_water1",
  "sb_summon_life_cubic1",
  "sb_summon_storm_cubic1",
  "sb_summon_aqua_cubic1",
  "sb_summon_unicorn_merrow1",
  "sb_servitor_cure1",
  "sb_servitor_physical_shield1",
  "sb_solar_flare1",
  "sb_spirit_barrier1",
  "sb_aura_bolt1",
  "sb_aura_flare11",
  "sb_curse_fear1",
  "sb_transfer_pain",
  "sb_frost_bolt11",
  "sb_freezing_skin1",
  "sb_hydro_blast11",
  "sb_servitor_magic_shield1",
  "sb_servitor_haste1",
  "sb_serenade_of_eva1",
  "sb_sleeping_cloud1",
  "sb_ice_dagger1",
  "sb_freezing_shackle1",
  "sb_vitalize1",
  "sb_cancel1",
  "sb_party_recall1",
  "sb_servitor_empower1",
  "sb_frost_wall1",
  "sb_mana_burn",
  "sb_major_heal",
  "sb_betray",
  "sb_summon_unicorn_seraphim",
  "sb_summon_friend",
  "sb_erase",
  "sb_invocation1",
  "sb_turn_undead",
  "sb_trance",
  "sb_auqa_resist1",
  "sb_resist_unholy",
  "sb_mass_surrender_to_water",
  "sb_aqua_splash1",
  "sb_advanced_block1",
  "sb_aura_flash1",
  "sb_clarity",
  "sb_summon_attract_cubic1",
  "sb_servitor_blessing",
  "sb_wild_magic1",
  "sb_seed_of_water",
  "sb_aura_symphony1",
  "sb_blizzard1",
  "sb_elemental_symphony_e1",
]);
