import { loadItemDataC4 } from "../../datapack/c4/itemdata";
import { loadItemGrpC6 } from "../../datapack/c6/itemgrp";
import { loadItemNamesC6 } from "../../datapack/c6/itemnames";
import { ItemEntryGF, loadItemDataGF } from "../../datapack/gf/itemdata";
import { loadItemNamesGF } from "../../datapack/gf/itemnames";
import { ItemDataEntry, ItemNameEntry } from "../../datapack/types";
import { Item } from "../../result/types";
import { asSlot } from "../slots";

export function loadItemsC6() {
  let items: Map<number, Item>;
  items = getItems();
  items = getIcons({ items });
  items = getItemRuNames({ items });

  console.log("Items loaded.");
  return items;
}

type ItemNameC6 = {
  id: number;
  itemName: string;
  name: { en: string; ru: string };
  add_name: { en: string; ru: string };
  desc: { en: string; ru: string };
};

function getItems() {
  const items = new Map<string, Item>();
  const itemNames = new Map<number, ItemNameC6>();

  const ItemC4ByName = new Map(loadItemDataC4().map((i) => [i.$[2], i]));
  const ItemGFByName = new Map(loadItemDataGF().map((i) => [i.$[2], i]));
  const ItemGFById = new Map(loadItemDataGF().map((i) => [i.$[1], i]));

  // Находим все игровые имена в грации
  for (const itemName of loadItemNamesC6()) {
    const itemGF = ItemGFById.get(itemName.id);
    if (itemGF) {
      if (itemGF.t === "item") {
        itemNames.set(itemName.id, {
          ...itemName,
          itemName: itemGF.$[2].toString(),
        });
      }
    }
  }

  for (const itemName of itemNames.values()) {
    const itemC4 = ItemC4ByName.get(itemName.itemName);
    if (itemC4) {
      const { id, item } = addItem(itemC4, itemName);
      items.set(itemC4.$[2].toString(), item);
    } else {
      const itemGF = ItemGFByName.get(itemName.itemName);
      if (itemGF) {
        const { id, item } = addItem(itemGF, itemName);
        items.set(itemGF.$[2].toString(), item);
      }
    }
  }

  // for (const item of itemNames.values()) {
  //   if (!items.has(item.itemName)) {
  //     console.log(item.itemName, item.id);
  //   }
  // }
  // console.log();

  // console.log(loadItemNamesC6().length, Array.from(items.values()).length);

  return new Map(Array.from(items.values()).map((i) => [i.id, i]));
}

function getIcons(deps: { items: Map<number, Item> }) {
  for (const itemGrp of loadItemGrpC6()) {
    const item = deps.items.get(itemGrp.id);
    if (item) {
      item.icon = itemGrp.icon;
    }
  }
  return deps.items;
}

function getItemRuNames(deps: { items: Map<number, Item> }) {
  const itemNamesGF = new Map(loadItemNamesGF().map((item) => [item.id, item]));

  for (const item of deps.items.values()) {
    const itemNameGF = itemNamesGF.get(item.id);
    if (itemNameGF) {
      item.name.ru = itemNameGF.name.ru;
      item.addName.ru = itemNameGF.add_name.ru;
    }
  }

  return deps.items;
}

function addItem(
  itemData: ItemDataEntry | ItemEntryGF,
  itemName: ItemNameEntry
) {
  const id = itemData.$[1];
  const item: Item = {
    id: itemData.$[1]!,
    itemName: itemData.$[2]!.toString().replace(":", "_"),
    name: itemName.name,
    addName: itemName.add_name,
    desc: itemName.desc,
    icon: "",
    armorType: itemData.armor_type!,
    attackRange: itemData.attack_range!,
    attackSpeed: itemData.attack_speed!,
    avoidModify: itemData.avoid_modify!,
    canPenetrate: Boolean(itemData.can_penetrate!),
    consumeType: itemData.consume_type!,
    critical: itemData.critical!,
    criticalAttackSkill: itemData.critical_attack_skill!,
    crystalCount: itemData.crystal_count!,
    crystalType: itemData.crystal_type ?? "none",
    damageRange: itemData.damage_range ? itemData.damage_range.$ + "" : "none",
    defaultPrice: itemData.default_price!,
    dualFhitRate: itemData.dual_fhit_rate!,
    durability: itemData.durability!,
    etcitemType: itemData.etcitem_type!,
    hitModify: itemData.hit_modify!,
    immediateEffect: Boolean(itemData.immediate_effect!),
    initialCount: itemData.initial_count!,
    isDestruct: Boolean(itemData.is_destruct!),
    isDrop: Boolean(itemData.is_drop!),
    isTrade: Boolean(itemData.is_trade!),
    itemSkill: itemData.item_skill!,
    magicalDamage: itemData.magical_damage!,
    magicalDefense: itemData.magical_defense!,
    magicWeapon: Boolean(itemData.magic_weapon!),
    materialType: itemData.material_type!,
    maximumCount: itemData.maximum_count!,
    mpBonus: itemData.mp_bonus!,
    mpConsume: itemData.mp_consume!,
    physicalDamage: itemData.physical_damage!,
    physicalDefense: itemData.physical_defense!,
    randomDamage: itemData.random_damage!,
    reuseDelay: itemData.reuse_delay!,
    shieldDefense: itemData.shield_defense!,
    shieldDefenseRate: itemData.shield_defense_rate!,
    slotBitType: asSlot(itemData.slot_bit_type!.$.toString()),
    soulshotCount:
      itemData.$[0].toString() === "weapon" && itemData.default_price! < 54000
        ? 0
        : itemData.soulshot_count!,
    spiritshotCount:
      itemData.$[0].toString() === "weapon" && itemData.default_price! < 54000
        ? 0
        : itemData.spiritshot_count!,
    type: itemData.$[0].toString(),
    weaponType: itemData.weapon_type!,
    weight: itemData.weight!,
    enchantBonus: [],
  };

  return { id, item };
}
