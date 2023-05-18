import { Item, ItemAbilityList, ShortItem } from '../result/types';

export function loadItemAbilityList(deps: { items: Map<number, Item>}) {
  const ability = loadC2SpecialAbility(deps)
  console.log("Items: Abilitiy list loaded.");
  
  return ability
}

function loadC2SpecialAbility(deps: {items: Map<number, Item>}) {
  const itemAbility = new Map<string, ItemAbilityList>()
  const itemByNamme = new Map(Array.from(deps.items.values()).map(i => [i.itemName, i]))

  for (const item of deps.items.values()) {
    const abilityList: ShortItem[] = []

    for (const sa of saList) {
      const rItem = itemByNamme.get(`${item.itemName}_${sa}`)

      if (rItem) {
        const nItem = itemByNamme.get(rItem.itemName.replace(`_${sa}`, ""))

        if (nItem) {
          abilityList.push({itemName: rItem.itemName})
        }
      }
    }   

    if (abilityList.length) {
      itemAbility.set(item.itemName, {itemName: item.itemName, abilityList})
    }    
  }
  
  return itemAbility
}

const saList = [
  "guidence",
  "evasion",
  "focus",	
  "anger",	
  "health",	
  "backblow",	
  "crt.bleed ",
  "crt.damage",
  "crt.anger",
  "crt.drain",	
  "crt.stun",	
  "crt.poison",	
  "rsk.focus",
  "rsk.evasion",	
  "rsk.haste",
  "mightmortal",	
  "manaup",	
  "light",	
  "quickrecovery",	
  "cheapshot",	
  "haste",	
  "longblow",	
  "wideblow",	
  "magicmentalshield",	
  "magicfocus",	
  "magicblessthebody",	
  "magichold",	
  "magicpoison",	
  "magicweakness",	
  "magicchaos",	
]