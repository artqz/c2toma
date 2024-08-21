import { Item, } from "../../../result/types";

type CapsuleContains = {items: {itemName: string, count: number}[], chance: number}

export function loadCapsuleItems(props: {effects: Map<string,any>, items: Map<number,Item>}) {
    const capsules = addCapsuleItems({...props})
    return capsules;
}

function addCapsuleItems(props: { effects: Map<string,any>, items: Map<number, Item> }) {
    const effectByName = props.effects;
    const map = new Map<string, CapsuleContains[]>()
    for (const item of props.items.values()) {
      if (item.defaultAction === "action_capsule") {
        if(item.itemSkill) {      
            const effect = effectByName.get(item.itemSkill)
            if (effect) {
                // console.log(item.name.en, skill.name.en);                
                // item.contains = getItemsFromSkills({effects: effect})
                map.set(item.itemName, getItemsFromSkills({effects: effect}))
            }
        }        
      }
    }

    return map
  }

function getItemsFromSkills(props: {effects: any}) {
    
    
    const arr: CapsuleContains[] = []
    if (props.effects) {
        for (const effect of props.effects) {           
            const effectName: string = effect.$[0];
            if (effectName === "i_restoration") {           
                arr.push({items: [{itemName: effect.$[1], count: effect.$[2]}], chance: 100})   
            }
            if (effectName === "i_restoration_random") {                                
                for (const e of effect.$[1].$) {
                    const items:{itemName: string, count: number}[] = []
                    let chance = 0      
                                                          
                    for (const e2 of e.$) {                
                        if (typeof e2 === "object" ) {                           
                            for (const e3 of e2.$) {                                                 
                                items.push({itemName: e3.$[0], count: e3.$[1]})
                            }
                        }
                        if (typeof e2 === "number" ) {
                            chance = e2
                        }                    
                    }                     
                arr.push({items, chance})       
                }
                
            }
        }
    }    
    return arr;    
}