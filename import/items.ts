import { string, z } from "zod";
import { loadItemGrpC2 } from "../datapack/c2/itemgrp";
import { ItemEntryC2, loadItemNamesC2 } from "../datapack/c2/itemnames";
import { loadItemDataC4 } from "../datapack/c4/itemdata";
import { loadItemDataGF } from "../datapack/gf/itemdata";
import { loadItemNamesGF } from '../datapack/gf/itemnames';
import { Item } from "../result/types";

export function loadItems() {
  const itemnamesC2 = new Map(loadItemNamesC2().map((npc) => [npc.id, npc]));
  let items: Map<number, Item>;
  items = loadC4Items(itemnamesC2);
  items = loadC2Icons(items);
  console.log("Items loaded.");

  return items;
}

function loadC4Items(itemnamesC2: Map<number, ItemEntryC2>) {
  const items = new Map<number, Item>();
  const itemsC4 = new Map(loadItemDataC4().map((item) => [item.$[1], item]));
  const namesGF = loadNamesGf()
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
      const itemnameGF = namesGF.get(itemC2.id)
      items.set(itemC2.id, {
        id: itemC4.$[1]!,
        itemName: itemC4.$[2]!.toString().replace(":", "_"),
        name: itemC2.name.length ? itemC2.name : itemnameGF?.name ?? itemC4.$[2]!.toString().replace(":", "_"),
        addName: itemC2.additionalname,
        desc: itemC2.description.length ? itemC2.description : itemnameGF?.desc ?? "",
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
        crystalType: itemC4.crystal_type!,
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
        soulshotCount: itemC4.soulshot_count!,
        spiritshotCount: itemC4.spiritshot_count!,
        type: itemC4.$[0].toString(),
        weaponType: itemC4.weapon_type!,
        weight: itemC4.weight!,
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

function loadNamesGf() {
  const itemnameMap = new Map<number, {name: string, desc: string}> ()
  for (const name of loadItemNamesGF()) {
    itemnameMap.set(name.id, {name:name.name, desc:name.desc})
  }

  return itemnameMap
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
