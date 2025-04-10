import { Item, ItemAbilityList, ShortItem } from "../../result/types";

export function loadItemAbilityListC3(deps: { items: Map<number, Item> }) {
  const ability = loadC3SpecialAbility(deps);
  console.log("Items: Abilitiy list loaded.");

  return ability;
}

function loadC3SpecialAbility(deps: { items: Map<number, Item> }) {
  const itemAbility = new Map<string, ItemAbilityList>();
  const itemByNamme = new Map(
    Array.from(deps.items.values()).map((i) => [i.itemName, i])
  );

  for (const item of deps.items.values()) {
    const abilityList: ShortItem[] = [];

    for (const sa of saList) {
      const rItem = itemByNamme.get(`${item.itemName}_${sa}`);

      if (rItem) {
        const nItem = itemByNamme.get(rItem.itemName.replace(`_${sa}`, ""));

        if (nItem) {
          abilityList.push({ itemName: rItem.itemName });
        }
      }
    }

    if (abilityList.length) {
      itemAbility.set(item.itemName, { itemName: item.itemName, abilityList });
    }
  }

  for (const iterator of itemAbility.values()) {
  }

  return itemAbility;
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
