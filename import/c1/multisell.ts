import { loadMultisellDataC1 } from "../../datapack/c1/miltisell";
import { loadMultisellDataC4 } from "../../datapack/c4/miltisell";
import { loadMultisellDataGF } from "../../datapack/gf/miltisell";
import { loadMultisellDataIL } from "../../datapack/il/miltisell";
import { Item, Multisell, Npc, SellList } from "../../result/types";
import { Chronicle } from "../types";
import { fixC5Multisell } from "./c5/multisell";

export function loadMultisell(deps: {
  chronicle: Chronicle;
  items: Map<number, Item>;
  npcs: Map<number, Npc>;
}) {
  let multisell = loadMultisellData(deps);
  handFix({ ...deps, multisell });

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
      multisellData = loadMultisellDataGF();
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
          (item) => itemsByName.get(item.$[0].toLowerCase()) && item
        ).map((item) => {
          return { itemName: item.$[0].toLowerCase(), count: item.$[1] };
        }),
        resultItems: sell.$[0].$.filter(
          (item) => itemsByName.get(item.$[0].toLowerCase()) && item
        ).map((item) => {
          return {
            itemName: item.$[0].toLowerCase(),
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
    case "fish_trade":
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
        { npcName: "fisher_platis", show: true },
      ];
    case "ssq_exchange_for_a":
    case "ssq_exchange_for_b":
    case "ssq_weapon_yupgrade":
    case "ssq_weapon_upgrade":
    case "ssq_acce_exchange_for_a":
    case "ssq_sealexchange_for_a":
    case "ssq_acce_exchange_for_s":
    case "ssq_exchange_for_s":
    case "ssq_dual_for_s":
    case "ssq_weapon_variation_s":
    case "ssq_dualweapon_yupgrade":
    case "ssq_sealexchange_for_b":
    case "ssq_dual_for_a":
    case "ssq_weapon_variation_a":
      return [{ npcName: "blacksmith_of_mammon", show: false }];
    case "ssq_merchant_etcsell":
      return [{ npcName: "merchant_of_mammon", show: true }];
    case "ssq_priest":
      return [
        { npcName: "dusk_priestessess_gludin", show: true },
        { npcName: "dusk_priestessess_godard", show: true },
        { npcName: "dusk_priestessess_rune", show: true },
        { npcName: "dusk_priestess_gludio", show: true },
        { npcName: "dusk_priestess_dion", show: true },
        { npcName: "dusk_priestess_giran", show: true },
        { npcName: "dusk_priestess_heiness", show: true },
        { npcName: "dusk_priestess_oren", show: true },
        { npcName: "dusk_priestess_aden", show: true },
        { npcName: "dusk_priestess_hunter", show: true },
        { npcName: "dawn_priest_gludin", show: true },
        { npcName: "dawn_priest_godard", show: true },
        { npcName: "dawn_priest_rune", show: true },
        { npcName: "dawn_priest_gludio", show: true },
        { npcName: "dawn_priest_dion", show: true },
        { npcName: "dawn_priest_giran", show: true },
        { npcName: "dawn_priest_heiness", show: true },
        { npcName: "dawn_priest_oren", show: true },
        { npcName: "dawn_priest_aden", show: true },
        { npcName: "dawn_priest_hunter", show: true },
      ];
    case "bytime3":
      return [
        { npcName: "stany", show: true },
        { npcName: "grabner", show: true },
      ];
    case "quest_bytime":
      return [
        // GM
        { npcName: "kai", show: true },
        { npcName: "brecson", show: true },
        { npcName: "master_rains", show: true },
        { npcName: "master_xenos", show: true },
        { npcName: "master_tobias", show: true },
        { npcName: "grandmaster_ramos", show: true },
        { npcName: "grandmaster_tronix", show: true },
        { npcName: "grandmaster_angus", show: true },
        { npcName: "grandmaster_siria", show: true },
        { npcName: "grandmaster_medown", show: true },
        { npcName: "grandmaster_sedrick", show: true },
        { npcName: "grandmaster_oltlin", show: true },
        { npcName: "grandmaster_marcus", show: true },
        { npcName: "grandmaster_xairakin", show: true },
        { npcName: "grandmaster_bernhard", show: true },
        { npcName: "grandmaster_samael", show: true },
        { npcName: "grandmaster_siegmund", show: true },
        { npcName: "grandmaster_andromeda", show: true },
        { npcName: "grandmaster_hexter", show: true },
        { npcName: "grandmaster_drizit", show: true },
        { npcName: "grandmaster_shull", show: true },
        { npcName: "grandmaster_helminter", show: true },
        { npcName: "pabris", show: true },
        { npcName: "hannavalt", show: true },
        // HP
        { npcName: "levian", show: true },
        { npcName: "maximilian", show: true },
        { npcName: "hollin", show: true },
        { npcName: "bishop_raimund", show: true },
        { npcName: "highpriest_orven", show: true },
        { npcName: "highpriest_squillari", show: true },
        { npcName: "highpriest_gregor", show: true },
        { npcName: "highpriest_innocentin", show: true },
        { npcName: "highpriest_baorl", show: true },
        { npcName: "highpriest_mattew", show: true },
        { npcName: "sylvain", show: true },
        // Head Blacksmith
        { npcName: "head_blacksmith_tapoy", show: true },
        { npcName: "head_blacksmith_mendio", show: true },
        { npcName: "head_blacksmith_kusto", show: true },
        { npcName: "head_blacksmith_opix", show: true },
        { npcName: "head_blacksmith_flutter", show: true },
        { npcName: "head_blacksmith_vergara", show: true },
        { npcName: "head_blacksmith_ferris", show: true },
        { npcName: "head_blacksmith_roman", show: true },
        { npcName: "head_blacksmith_noel", show: true },
        { npcName: "head_blacksmith_lombert", show: true },
        { npcName: "head_blacksmith_newyear", show: true },
        { npcName: "head_blacksmith_boillin", show: true },
        // Warehouse Chief
        { npcName: "warehouse_chief_mona", show: true },
        { npcName: "warehouse_chief_donal", show: true },
        { npcName: "warehouse_chief_older", show: true },
        { npcName: "warehouse_chief_moke", show: true },
        { npcName: "warehouse_chief_rikadio", show: true },
        { npcName: "warehouse_chief_gesto", show: true },
        { npcName: "warehouse_chief_ranspo", show: true },
        { npcName: "warehouse_chief_croop", show: true },
        { npcName: "warehouse_chief_baxt", show: true },
        { npcName: "warehouse_chief_klump", show: true },
        { npcName: "warehouse_chief_natools", show: true },
        { npcName: "warehouse_chief_yaseni", show: true },
        // High Prefect
        { npcName: "high_prefect_finker", show: true },
        { npcName: "high_prefect_aklan", show: true },
        { npcName: "high_prefect_lambac", show: true },
        { npcName: "high_prefect_shaka", show: true },
        { npcName: "high_prefect_osborn", show: true },
        { npcName: "high_prefect_drikus", show: true },
        { npcName: "high_prefect_cional", show: true },
        { npcName: "high_prefect_penatus", show: true },
        { npcName: "high_prefect_karia", show: true },
        { npcName: "high_prefect_garvarentz", show: true },
        { npcName: "high_prefect_ladanza", show: true },
        { npcName: "high_prefect_tushku", show: true },
        // Grand Magister
        { npcName: "jurek", show: true },
        { npcName: "biralri", show: true },
        { npcName: "fairen", show: true },
        { npcName: "yan", show: true },
        { npcName: "grandmagister_scraide", show: true },
        { npcName: "grandmagister_drikiyan", show: true },
        { npcName: "grandmagister_valdis", show: true },
        { npcName: "grandmagister_tifaren", show: true },
        { npcName: "grandmagister_halaster", show: true },
        { npcName: "grandmagister_havrier", show: true },
        { npcName: "grandmagister_celes", show: true },
      ];
    default:
      console.log("Unhandled multisell: %s", multisellName);
      return [];
  }
}

function handFix(deps: {
  chronicle: Chronicle;
  multisell: Map<number, Multisell>;
}) {
  if (deps.chronicle === "c5") {
    fixC5Multisell(deps.multisell);
  }
}
