import { loadMultisellDataC1 } from "../../datapack/c1/miltisell";
import { loadMultisellDataGF } from "../../datapack/gf/miltisell";
import { Item, Multisell, Npc, SellList } from "../../result/types";
import { Chronicle } from "../types";

export function loadMultisell(deps: {
  chronicle: Chronicle;
  items: Map<number, Item>;
  npcs: Map<number, Npc>;
}) {
  let multisell = loadMultisellData(deps);

  console.log("Multisell loaded.");

  return multisell;
}

function loadMultisellData(deps: {
  chronicle: Chronicle;
  items: Map<number, Item>;
  npcs: Map<number, Npc>;
}) {
  let multisellData = [];
  switch (deps.chronicle) {
    case "c1":
      multisellData = loadMultisellDataC1();
      break;
    case "gf":
      multisellData = loadMultisellDataGF();
      break;
    default:
      multisellData = loadMultisellDataC1();
      break;
  }
  const itemsByName = new Map(
    Array.from(deps.items.values()).map((i) => [i.itemName, i])
  );
  const msArray: Multisell[] = [];

  for (const ms of multisellData) {
    const sellList = ms.selllist.$;
    const slArray: SellList[] = [];

    for (const sell of sellList) {
      const multisell = {
        requiredItems: sell.$[1].$.filter(
          (item) => itemsByName.get(item.$[0]) && item
        ).map((item) => {
          return { itemName: item.$[0], count: item.$[1] };
        }),
        resultItems: sell.$[0].$.filter(
          (item) => itemsByName.get(item.$[0]) && item
        ).map((item) => {
          return {
            itemName: item.$[0],
            count: item.$[1],
          };
        }),
      };

      // In GF adena goes as a third tuple element
      if (deps.chronicle === "gf") {
        if (sell.$[2]) {
          multisell.requiredItems.push({
            itemName: "adena",
            count: sell.$[2].$[0],
          });
        }
      }

      if (!multisell.requiredItems.length || !multisell.resultItems.length) {
      } else {
        slArray.push(multisell);
      }
    }

    msArray.push({
      id: ms.$[1],
      multisellName: ms.$[0],
      sellList: slArray,
      npcList: [],
    });
  }

  let multisell = new Map(
    msArray.filter((ms) => ms.sellList.length > 0).map((x) => [x.id, x])
  );

  for (const ms of multisell.values()) {
    const npcList = getNpcNamesByMultisell(ms.multisellName);
    for (const npc of npcList) {
      ms.npcList.push({ npcName: npc.npcName, show: npc.show });
    }
  }

  return multisell;
}

function getNpcNamesByMultisell(multisellName: string) {
  switch (multisellName) {
    case "blackmerchant_weapon":
      return [{ npcName: "galladuchi", show: true }];
    case "blackmerchant_armor":
      return [{ npcName: "alexandria", show: true }];
    case "dualsword_d":
      return [
        { npcName: "blacksmith_sumari", show: false },
        { npcName: "blacksmith_kluto", show: false },
        { npcName: "blacksmith_pinter", show: false },
        { npcName: "blacksmith_rupio", show: false },
        { npcName: "blacksmith_alltran", show: false },
        { npcName: "blacksmith_poitan", show: false },
        { npcName: "blacksmith_pushkin", show: false },
        { npcName: "blacksmith_duning", show: false },
        { npcName: "blacksmith_aios", show: false },
        { npcName: "blacksmith_bronp", show: false },
        { npcName: "blacksmith_silvery", show: false },
        { npcName: "blacksmith_helton", show: false },
        { npcName: "blacksmith_karoyd", show: false },
        { npcName: "blacksmith_wilbert", show: false },
      ];
    case "weapon_variation":
      return [
        { npcName: "blacksmith_sumari", show: false },
        { npcName: "blacksmith_kluto", show: false },
        { npcName: "blacksmith_pinter", show: false },
        { npcName: "blacksmith_rupio", show: false },
        { npcName: "blacksmith_alltran", show: false },
        { npcName: "blacksmith_poitan", show: false },
        { npcName: "blacksmith_pushkin", show: false },
        { npcName: "blacksmith_duning", show: false },
        { npcName: "blacksmith_aios", show: false },
        { npcName: "blacksmith_bronp", show: false },
        { npcName: "blacksmith_silvery", show: false },
        { npcName: "blacksmith_helton", show: false },
        { npcName: "blacksmith_karoyd", show: false },
        { npcName: "blacksmith_wilbert", show: false },
      ];
    case "0336_magical_coin_3rd":
      return [{ npcName: "warehouse_keeper_sorint", show: true }];
    case "0336_magical_coin_2nd":
      return [{ npcName: "warehouse_keeper_sorint", show: true }];
    case "0336_magical_coin_1nd":
      return [{ npcName: "warehouse_keeper_sorint", show: true }];
    case "0351_head_blacksmith_vergara":
      return [{ npcName: "head_blacksmith_roman", show: true }];
    default:
      console.log("Unhandled multisell: %s", multisellName);
      return [];
  }
}
