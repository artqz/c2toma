import { Item, ItemAbilityList, ShortItem } from "../../result/types";
import { Chronicle } from "../types";

export function loadWeaponAbilities(deps: {
  chronicle: Chronicle;
  items: Map<number, Item>;
}) {
  let items = loadWeaponAbilitiesData(deps);

  console.log("Weapon Abilities loaded.");

  return items;
}

function loadWeaponAbilitiesData(deps: {
  chronicle: Chronicle;
  items: Map<number, Item>;
}) {
  const abilityMap = new Map<string, ItemAbilityList>();
  const itemsByNamme = new Map(
    Array.from(deps.items.values())
      .filter((i) => i.type === "weapon")
      .map((i) => [i.itemName, i])
  );

  for (const item of deps.items.values()) {
    const abilityList: ShortItem[] = [];

    for (const sa of saList) {
      const rItem = itemsByNamme.get(`${item.itemName}_${sa}`);

      if (rItem) {
        const nItem = itemsByNamme.get(rItem.itemName.replace(`_${sa}`, ""));

        if (nItem) {
          abilityList.push({ itemName: rItem.itemName });
        }
      }
    }

    if (abilityList.length) {
      abilityMap.set(item.itemName, { itemName: item.itemName, abilityList });
    }
  }
  for (const a of abilityMap.values()) {
    if (a.abilityList.length < 3) {
      console.log(a.itemName);
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
  "crt.drain",
  "magicpower",
  "magicsilence",
  "magicdamage",
  "m.focus",
];
