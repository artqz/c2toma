import { z } from "zod";
import { loadItemNamesC3 } from "../../datapack/c3/itemnames";
import { loadItemDataC4 } from "../../datapack/c4/itemdata";
import { loadItemNamesGF } from "../../datapack/gf/itemnames";
import { Item } from "../../result/types";

import { calcArmorDef, calcWeaponAtk, calcСrystals } from "../enchantBonuses";
import { loadItemGrpC3 } from "../../datapack/c3/itemgrp";
import { loadItemDataGF } from "../../datapack/gf/itemdata";
import { loadItemGrpC4 } from "../../datapack/c4/itemgrp";

export function loadItemsC3() {
  let items: Map<number, Item>;
  items = loadC4Items();
  items = loadC2Icons(items);
  items = loadItemEnchantBonuses({ itemData: items });
  items = loadItemRuNames({ itemData: items });
  // items = adjustment({ itemData: items });
  console.log("Items loaded. " + Array.from(items.values()).length);

  return items;
}

function loadC4Items() {
  const items = new Map<number, Item>();
  const itemsC4 = new Map(loadItemDataC4().map((item) => [item.$[1], item]));
  const itemnamesC3 = new Map(loadItemNamesC3().map((npc) => [npc.id, npc]));

  for (const itemC3 of Array.from(itemnamesC3.values())) {
    const itemC4 = itemsC4.get(itemC3.id);
    if (!itemC4) {
      console.log("Нет", itemC3.id, itemC3.name);
    } else {
      items.set(itemC3.id, {
        id: itemC4.$[1]!,
        itemName: itemC4.$[2]!.toString().replace(":", "_"),
        name: {
          en: itemC3.name.trim() ?? "",
          ru: itemC3.name.trim() ?? "",
        },
        addName: {
          en:
            itemC3.name !== itemC3.add_name.trim()
              ? itemC3.add_name.trim()
              : "",
          ru:
            itemC3.name !== itemC3.add_name.trim()
              ? itemC3.add_name.trim()
              : "",
        },
        desc: {
          en: itemC3.desc.trim() ?? "",
          ru: itemC3.desc.trim() ?? "",
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
      });
    }
  }

  return items;
}

function loadC2Icons(items: Map<number, Item>) {
  const itemGrpC3 = new Map(loadItemGrpC3().map((item) => [item.id, item]));
  const itemGrpC4 = new Map(loadItemGrpC4().map((item) => [item.id, item]));
  const itemsNew = new Map<number, Item>();

  for (const item of Array.from(items.values())) {
    const grpC3 = itemGrpC3.get(item.id.toString());
    if (grpC3) {
      itemsNew.set(item.id, {
        ...item,
        icon: grpC3["icon[4]"].replace("icon.", ""),
      });
    } else {
      const grpC4 = itemGrpC4.get(item.id.toString());
      if (grpC4) {
        itemsNew.set(item.id, {
          ...item,
          icon: grpC4["icon[0]"].replace("icon.", ""),
        });
      }
    }
  }
  return itemsNew;
}

function loadItemRuNames(deps: { itemData: Map<number, Item> }) {
  const itemData = deps.itemData;

  const itemDataGF = new Map(loadItemDataGF().map((item) => [item.$[1], item]));
  const itemNamesGF = new Map(loadItemNamesGF().map((item) => [item.id, item]));
  const itemNames = new Map<
    string,
    {
      id: number;
      itemName: string;
      name: { en: string; ru: string };
      add_name: { en: string; ru: string };
      desc: { en: string; ru: string };
    }
  >();

  for (const itemGF of itemDataGF.values()) {
    const itemName = itemNamesGF.get(itemGF.$[1]);
    if (itemName) {
      if (itemGF.t === "item") {
        itemNames.set(itemGF.$[2].toString(), {
          ...itemName,
          itemName: itemGF.$[2].toString(),
        });
      }
    }
  }

  for (const item of itemData.values()) {
    const _item = itemNames.get(item.itemName);
    if (_item) {
      itemData.set(item.id, {
        ...item,
        name: { ...item.name, ru: _item.name.ru },
        addName: { ...item.addName, ru: _item.add_name.ru },
      });
    }
  }

  return itemData;
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
          pAtk: calcWeaponAtk({ level: i, item }).pAtk,
          mAtk: calcWeaponAtk({ level: i, item }).mAtk,
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
