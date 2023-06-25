import { z } from "zod";
import { loadItemGrpC2 } from "../../datapack/c2/itemgrp";
import { ItemEntryC2, loadItemNamesC2 } from "../../datapack/c2/itemnames";
import { loadItemDataC4 } from "../../datapack/c4/itemdata";
import { loadItemNamesGF } from "../../datapack/gf/itemnames";
import { Item, lstring } from "../../result/types";

import { calcArmorDef, calcWeaponAtk, calcСrystals } from "../enchantBonuses";

export function loadItems() {
  const itemnamesC2 = new Map(loadItemNamesC2().map((npc) => [npc.id, npc]));
  let items: Map<number, Item>;
  items = loadC4Items(itemnamesC2);
  items = loadC2Icons(items);
  items = loadItemEnchantBonuses({ itemData: items });
  items = adjustment({ itemData: items });
  console.log("Items loaded.");

  return items;
}

function loadC4Items(itemnamesC2: Map<number, ItemEntryC2>) {
  const items = new Map<number, Item>();
  const itemsC4 = new Map(loadItemDataC4().map((item) => [item.$[1], item]));

  const namesGF = loadNamesGf();
  // for (const tItem of loadItemDataGF()) {
  //   if (tItem.$.length > 3) {
  //     console.log(tItem.t);
  //   }
  // }

  for (const itemC2 of Array.from(itemnamesC2.values())) {
    const itemC4 = itemsC4.get(itemC2.id);
    if (!itemC4) {
      console.log("Нет", itemC2.id, itemC2.name);
    } else {
      // if (itemC4.t === "item") {
      const itemnameGF = namesGF.get(itemC2.id);
      items.set(itemC2.id, {
        id: itemC4.$[1]!,
        itemName: itemC4.$[2]!.toString().replace(":", "_"),
        //name: itemC2.name.length ? itemC2.name : itemnameGF?.name ?? itemC4.$[2]!.toString().replace(":", "_"),
        name: {
          en: itemC2.name.trim() ?? "",
          ru: itemnameGF?.name.ru.trim() ?? "",
        },
        addName: {
          en:
            itemC2.name !== itemC2.additionalname.trim()
              ? itemC2.additionalname.trim()
              : "",
          ru: itemnameGF?.add_name.ru.trim() ?? "",
        },
        desc: {
          en: itemC2.description.trim() ?? "",
          ru: itemC2.description.trim() ?? "",
        },
        icon: "",
        armorType: itemC4.armor_type!,
        attackRange: itemC4.attack_range!,
        attackSpeed: itemC4.attack_speed!,
        avoidModify: itemC4.avoid_modify!,
        canPenetrate: Boolean(itemC4.can_penetrate!),
        consumeType: itemC4.consume_type!,
        critical: itemC4.critical!,
        criticalAttackSkill: itemC4.critical_attack_skill!,
        crystalCount: itemC4.crystal_count!,
        crystalType: itemC4.crystal_type ?? "none",
        damageRange: itemC4.damage_range ? itemC4.damage_range.$ + "" : "none",
        defaultPrice: itemC4.default_price!,
        dualFhitRate: itemC4.dual_fhit_rate!,
        durability: itemC4.durability!,
        etcitemType: itemC4.etcitem_type!,
        hitModify: itemC4.hit_modify!,
        immediateEffect: Boolean(itemC4.immediate_effect!),
        initialCount: itemC4.initial_count!,
        isDestruct: Boolean(itemC4.is_destruct!),
        isDrop: Boolean(itemC4.is_drop!),
        isTrade: Boolean(itemC4.is_trade!),
        itemSkill: itemC4.item_skill!,
        magicalDamage: itemC4.magical_damage!,
        magicalDefense: itemC4.magical_defense!,
        magicWeapon: Boolean(itemC4.magic_weapon!),
        materialType: itemC4.material_type!,
        maximumCount: itemC4.maximum_count!,
        mpBonus: itemC4.mp_bonus!,
        mpConsume: itemC4.mp_consume!,
        physicalDamage: itemC4.physical_damage!,
        physicalDefense: itemC4.physical_defense!,
        randomDamage: itemC4.random_damage!,
        reuseDelay: itemC4.reuse_delay!,
        shieldDefense: itemC4.shield_defense!,
        shieldDefenseRate: itemC4.shield_defense_rate!,
        slotBitType: asSlot(itemC4.slot_bit_type!.$.toString()),
        soulshotCount:
          itemC4.$[0].toString() === "weapon" && itemC4.default_price! < 54000
            ? 0
            : itemC4.soulshot_count!,
        spiritshotCount:
          itemC4.$[0].toString() === "weapon" && itemC4.default_price! < 54000
            ? 0
            : itemC4.spiritshot_count!,
        type: itemC4.$[0].toString(),
        weaponType: itemC4.weapon_type!,
        weight: itemC4.weight!,
        enchantBonus: [],
        // recipe: [],
        // sellList: [],
        // multisell:[],
        // product: [],
        // material: [],
        // dropList: [],
        // spoilList: []
      });
      // }
    }
  }

  return items;
}

function loadC2Icons(items: Map<number, Item>) {
  const itemGrp = new Map(
    loadItemGrpC2().map((item) => [item.object_id, item])
  );
  const itemsNew = new Map<number, Item>();

  for (const item of Array.from(items.values())) {
    const grp = itemGrp.get(item.id);
    if (grp) {
      itemsNew.set(item.id, {
        ...item,
        icon: grp.icon.$[0].replace("icon.", ""),
      });
    }
  }
  return itemsNew;
}

// function loadC2Sets(items: Map<number, Item>) {
//   const itemByName = new Map(Array.from(items.values()).map(i => [i.itemName, i]))
//   const setsC4 = new Map(loadItemDataC4().filter(i => i.$.length === 1 && i.set_effect_skill !== "none").map((item) => [item.$[0], item]));
//   const setsItem = new Map<number, Item[]>()
//   for (const set of Array.from(setsC4.values())) {
//     const setItems: ShortItem[] = []
//     if (set.hasOwnProperty("slot_head") && set.slot_head) {
//       const item = items.get(set.slot_head)
//       if (item) {
//         setItems.push({itemName: item.itemName})
//       }
//     }
//     if (set.hasOwnProperty("slot_chest") && set.slot_chest) {
//       const item = items.get(set.slot_chest)
//       if (item) {
//         setItems.push({itemName: item.itemName})
//       }
//     }
//     if (set.hasOwnProperty("slot_legs") && set.slot_legs) {
//       const item = items.get(set.slot_legs)
//       if (item) {
//         setItems.push({itemName: item.itemName})
//       }
//     }
//     if (set.hasOwnProperty("slot_gloves") && set.slot_gloves) {
//       const item = items.get(set.slot_gloves)
//       if (item) {
//         setItems.push({itemName: item.itemName})
//       }
//     }
//     if (set.hasOwnProperty("slot_feet") && set.slot_feet) {
//       const item = items.get(set.slot_feet)
//       if (item) {
//         setItems.push({itemName: item.itemName})
//       }
//     }
//     if (set.hasOwnProperty("slot_lhand") && set.slot_lhand) {
//       const item = items.get(set.slot_lhand)
//       if (item) {
//         setItems.push({itemName: item.itemName})
//       }
//     }
//     if (setItems.length > 0) {
//       if (typeof set.$[0] === 'number') {
//         for (const si of setItems) {
//           const item = itemByName.get(si.itemName)
//           if (item) {
//             item.sets.push({id: set.$[0], setEffectSkill: set.set_effect_skill ?? "", items: setItems})
//             items.set(item.id, {...item})
//           }
//         }
//       }
//     }

//   }

//   return items
// }

function loadNamesGf() {
  const itemnameMap = new Map<
    number,
    { name: lstring; add_name: lstring; desc: lstring }
  >();
  for (const name of loadItemNamesGF()) {
    itemnameMap.set(name.id, {
      name: name.name,
      add_name: name.add_name,
      desc: name.desc,
    });
  }

  return itemnameMap;
}

function loadItemEnchantBonuses(deps: { itemData: Map<number, Item> }) {
  for (const item of deps.itemData.values()) {
    for (let i = 0; i <= 19; i++) {
      if (
        (item.crystalType !== "none" && item.type === "weapon") ||
        (item.crystalType !== "none" && item.type === "armor") ||
        (item.crystalType !== "none" && item.type === "accessary")
      ) {
        item.enchantBonus.push({
          level: i,
          pAtk: calcWeaponAtk({ chronicle: "c2", level: i, item }).pAtk,
          mAtk: calcWeaponAtk({ chronicle: "c2", level: i, item }).mAtk,
          pDef: calcArmorDef({ level: i, item }).pDef,
          mDef: calcArmorDef({ level: i, item }).mDef,
          crystals: calcСrystals({ level: i, item }),
        });
      }
    }
  }

  return deps.itemData;
}

export const Slot = z.enum([
  "rhand",
  "lrhand",
  "lhand",
  "chest",
  "legs",
  "feet",
  "head",
  "gloves",
  "back",
  "underwear",
  "none",
  "onepiece",
  "rear,lear",
  "rfinger,lfinger",
  "neck",
  // GF
  "rbracelet",
  "lbracelet",
  "hair",
  "hair2",
  "hairall",
  "alldress",
  "deco1",
  "waist",
]);
export type Slot = z.infer<typeof Slot>;
export const asSlot = Slot.parse;

type ItemC2 = {
  id: number;
  itemName: string;
};
const itemsC2 = new Map<number, ItemC2>([[1, { id: 1, itemName: "" }]]);

function adjustment(deps: { itemData: Map<number, Item> }) {
  console.log("adjustment");

  for (const item of deps.itemData.values()) {
    if (item.itemName === "mithril_boots") {
      deps.itemData.set(item.id, {
        ...item,
        crystalType: "d",
        crystalCount: 83,
        defaultPrice: 45900,
      });
      console.log("----- mithril_boots");
    }
  }
  return deps.itemData;
}
