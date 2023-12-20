import { loadMultisellDataC1 } from "../../datapack/c1/miltisell";
import { loadMultisellDataC4 } from "../../datapack/c4/miltisell";
import { loadMultisellDataGF } from "../../datapack/gf/miltisell";
import { loadMultisellDataIL } from "../../datapack/il/miltisell";
import { Item, Multisell, Npc, SellList } from "../../result/types";
import { Chronicle } from "../types";
import { fixC5Multisell } from './c5/multisell';

export function loadMultisell(deps: {
  chronicle: Chronicle;
  items: Map<number, Item>;
  npcs: Map<number, Npc>;
}) {
  let multisell = loadMultisellData(deps);
  handFix({...deps, multisell});

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
    case "c4":
      multisellData = loadMultisellDataC4();
      break;
    case "c5":
      // нужен фикс
      multisellData = loadMultisellDataC4();
      break;
    case "il":
      multisellData = loadMultisellDataIL();
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
    case "0426_get_fishing_shot":
      return [
        { npcName: "fisher_klufe", show: true },
        { npcName: "fisher_perelin", show: true },
        { npcName: "fisher_mishini", show: true },
        { npcName: "fisher_ogord", show: true },
        { npcName: "fisher_ropfi", show: true },
        { npcName: "fisher_bleaker", show: true },
        { npcName: "fisher_pamfus", show: true },
        { npcName: "fisher_cyano", show: true },
        { npcName: "fisher_lanosco", show: true },
        { npcName: "fisher_ofulle", show: true },
        { npcName: "fisher_monakan", show: true },
        { npcName: "fisher_willeri", show: true },
        { npcName: "fisher_litulon", show: true },
        { npcName: "fisher_berix", show: true },
        { npcName: "fisher_linneaus", show: true },
        { npcName: "fisher_hilgendorf", show: true },
        { npcName: "fisher_klaw", show: true },
        { npcName: "fisher_platis", show: true }
    ];
    default:
      console.log("Unhandled multisell: %s", multisellName);
      return [];
  }
}


function handFix(deps: {chronicle: Chronicle, multisell: Map<number, Multisell>}) {
  if (deps.chronicle === "c5") {
    fixC5Multisell(deps.multisell)
  }
}