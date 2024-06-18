import { AbilityItem, Item, ItemAbilityList, Multisell, ShortItem } from "../../result/types";
import { Chronicle } from "../types";

export function loadWeaponAbilities(deps: {
  chronicle: Chronicle;
  items: Map<number, Item>;
  multisell: Map<number, Multisell>
}) {
  let items = loadWeaponAbilitiesData(deps);

  console.log("Weapon Abilities loaded.");

  return items;
}

function loadWeaponAbilitiesData(deps: {
  chronicle: Chronicle;
  items: Map<number, Item>;
  multisell: Map<number, Multisell>
}) {
  const msMap = new Map<string, string>()
  for (const i of [4, 204, 215]) {
    const multisellSA = deps.multisell.get(i)
    if (multisellSA) {      
      multisellSA.sellList.map(sl => msMap.set(sl.resultItems[0].itemName, sl.requiredItems.filter(ri => ri.itemName.includes("_soul_crystal_"))[0].itemName))
    }  
  }
  
  
  const abilityMap = new Map<string, ItemAbilityList>();
  const itemsByNamme = new Map(
    Array.from(deps.items.values())
      .filter((i) => i.type === "weapon")
      .map((i) => [i.itemName, i])
  );

  for (const item of deps.items.values()) {
    const abilityList: AbilityItem[] = [];
    let level: number = 0

    for (const sa of saList) {
      const rItem = itemsByNamme.get(`${item.itemName}_${sa}`);

      if (rItem) {       
        const nItem = itemsByNamme.get(rItem.itemName.replace(`_${sa}`, ""));

        if (nItem) {           
          const crystal = msMap.get(rItem.itemName)     
          if (crystal) {           
            level = parseInt(crystal.replace(/.*\D/, ''))
            abilityList.push({ soulCrystal:  crystal, itemName: rItem.itemName });
          }
          
        }
      }
    }

    if (abilityList.length) {
      abilityMap.set(item.itemName, { itemName: item.itemName, type: item.weaponType, level, abilityList });
    }
  }

  return abilityMap;
}

const saList = [
  "guidence",
  "evasion",
  "focus",
  "anger",
  "health",
  "backblow",
  "crt.bleed",
  "crt.damage",
  "crt.anger",
  "crt.drain",
  "crt.stun",
  "crt.poison",
  "rsk.focus",
  "rsk.evasion",
  "rsk.haste",
  "mightmotal", //mightmortal
  "manaup",
  "light",
  "quickrecovery",
  "cheapshot",
  "haste",
  "longblow",
  "wideblow",
  // "magicmentalshield",
  "magicfocus",
  "magicblessthebody",
  "magichold",
  "magicpoison",
  "magicweakness",
  "magicchaos",
  "magicregen", //есть в ц2?
  "magicmshield", //есть в ц2?
  "miser", //есть в ц2?
  //gf
  "crt.slow",
  "empower",
  "mpregen",
  "acumen",
  "hpregen",
  "hpdrain",
  "guidance",
  "updown",
  "magicparalysis",
  "magicpower",
  "magicsilence",
  "magicdamage",
  "m.focus",
];
