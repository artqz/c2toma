import { loadItemDataC4 } from "../../../datapack/c4/itemdata";
import { loadItemNamesC5 } from '../../../datapack/c5/itemnames';
import { loadItemDataGF } from "../../../datapack/gf/itemdata";
import { ItemDataEntry, ItemNameEntry } from "../../../datapack/types";
import { Item } from "../../../result/types";
import { asSlot } from "../../slots";

type ItemNameC5 = {
  id: number;
  itemName: string;
  name: { en: string; ru: string };
  add_name: { en: string; ru: string };
  desc: { en: string; ru: string };
};

export function generateItemsC5() {
  const items = new Map<string, Item>();
  const itemNames = new Map<number, ItemNameC5>();

  const ItemC4ByName = new Map(loadItemDataC4().map((i) => [i.$[2], i]));
  const ItemGFByName = new Map(loadItemDataGF().map((i) => [i.$[2], i]));
  const ItemGFById = new Map(loadItemDataGF().map((i) => [i.$[1], i]));

  // Находим все игровые имена в грации
  for (const itemName of loadItemNamesC5()) {
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

function addItem(itemData: ItemDataEntry, itemName: ItemNameEntry) {
  const id = itemData.$[1];
  const item: Item = {
    id: itemData.$[1]!,
    itemName: itemData.$[2]!.toString().replace(":", "_").toLowerCase(),
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
