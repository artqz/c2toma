import {
  Item,
  ItemMultisell,
  Multisell,
  Npc,
  SellList,
} from "../../result/types";
import { loadMultisellDataC4 } from "../../datapack/c4/miltisell";

export function loadMultisellC3(deps: {
  items: Map<number, Item>;
  npcs: Map<number, Npc>;
}) {
  const itemByName = new Map(
    Array.from(deps.items.values()).map((item) => [item.itemName, item])
  );

  const multilisells = loadMultisellDataC4();

  const msArray: Multisell[] = [];

  for (const ms of multilisells) {
    if (!excludedMultisells.has(ms.$[0])) {
      const sellList = ms.selllist.$;
      const slArray: SellList[] = [];

      for (const sell of sellList) {
        const multisell = {
          requiredItems: sell.$[1].$.filter(
            (item) => itemByName.get(item.$[0]) && item
          ).map((item) => {
            return { itemName: item.$[0], count: item.$[1] };
          }),
          resultItems: sell.$[0].$.filter(
            (item) => itemByName.get(item.$[0]) && item
          ).map((item) => {
            return {
              itemName: item.$[0],
              count: item.$[1],
            };
          }),
        };

        //add adena
        // кроме са
        if (ms.$[0] !== "weapon_variation") {
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

  //add npcs
  // addInNpcsAndItems({...deps, multisell})
  console.log("Multisell loaded.");

  return multisell;
}

// function addInNpcsAndItems(deps: { items: Map<number, Item>, npcs:  Map<number, Npc>, multisell: Map<number, Multisell>}) {
//   const npcByName = new Map(Array.from(deps.npcs.values()).map(n => [n.npcName, n]))
//   const itemByName = new Map(Array.from(deps.items.values()).map(i => [i.itemName, i]))
//   const filteredMultisell = new Map<string, ItemMultisell>()

//   for (const ms of deps.multisell.values()) {
//      const npcNames: { npcName: string; show: boolean }[] =
//       getNpcNamesByMultisell(ms.multisellName);

//       for (const npcName of npcNames) {
//         const npc = npcByName.get(npcName.npcName);
//         if (npc) {
//           filteredMultisell.set(npc.id+"_"+ms.id, {...ms, npcName: npc.npcName})
//         }
//       }
//   }

//   for (const ms of filteredMultisell.values()) {
//     const npc = npcByName.get(ms.npcName)

//     if (npc) {
//       npc.multisell.push(ms)
//     }

//     for (const sList of ms.sellList) {
//       for (const rItem of sList.resultItems) {
//         const item =itemByName.get(rItem.itemName)
//         if (item) {
//           const ims: ItemMultisell = {id: ms.id, sellList: [sList], multisellName: ms.multisellName, npcName:ms.npcName}
//           item.multisell.push(ims)
//         }
//       }
//     }
//   }
// }

//c2
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
    case "0373_reagent_supplier_bandor":
      return [{ npcName: "bandor", show: true }];
    case "ssq_merchant_etcsell":
      return [{ npcName: "merchant_of_mammon", show: true }];
    case "ssq_priest":
      return [
        { npcName: "dawn_priest_gludin", show: true },
        { npcName: "dawn_priest_gludio", show: true },
        { npcName: "dawn_priest_dion", show: true },
        { npcName: "dawn_priest_giran", show: true },
        { npcName: "dawn_priest_heiness", show: true },
        { npcName: "dawn_priest_oren", show: true },
        { npcName: "dawn_priest_aden", show: true },
        { npcName: "dawn_priest_hunter", show: true },
        { npcName: "dusk_priestessess_gludin", show: true },
        { npcName: "dusk_priestessess_gludio", show: true },
        { npcName: "dusk_priestessess_dion", show: true },
        { npcName: "dusk_priestessess_giran", show: true },
        { npcName: "dusk_priestessess_heiness", show: true },
        { npcName: "dusk_priestessess_oren", show: true },
        { npcName: "dusk_priestessess_aden", show: true },
        { npcName: "dusk_priestessess_hunter", show: true },
      ];
    default:
      console.log("Unhandled multisell: %s", multisellName);
      return [];
  }
}

const excludedMultisells = new Set([
  "ssq_weapon_yupgrade",
  "ssq_dual_for_a",
  "ssq_dualweapon_yupgrade",
  "ssq_weapon_upgrade",
  "weapon_variation_sep_merchant",
  "weapon_variation_sep_smith",
]);
