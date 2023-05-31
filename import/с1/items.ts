import { z } from "zod";
import { loadItemDataC1 } from "../../datapack/c1/itemdata";
import { Item } from "../../result/types";
import { loadItemNamesC1 } from "../../datapack/c1/itemnames";
import { loadItemGrpC1 } from '../../datapack/c1/itemgrp';
import { loadItemNamesGF } from '../../datapack/gf/itemnames';
import { Chronicle } from '../types';


export function loadItems(deps: {chronicle: Chronicle}) {
  let items = loadItemData(deps);
  items = loadItemNames({...deps, itemData: items });
  items = loadItemGrps({...deps, itemData: items });
  items = loadItemRuNames({...deps, itemData: items });
  console.log("Items loaded.");

  return items;
}

function loadItemData(deps:{ chronicle: Chronicle}) {
  let itemData = []
  switch (deps.chronicle) {
    case "c1":
      itemData = loadItemDataC1();
      break;  
    default:
      itemData = loadItemDataC1();
      break;
  }
  const items = new Map<number, Item>();

  for (const item of itemData) {
    if (item.item_type) {
      items.set(item.$[1], {
        id: item.$[1]!,
        itemName: item.$[2]!.toString().replace(":", "_"),        
        name: {
          en: "",
          ru: "",
        },
        addName: {
          en: "",
          ru: "",
        },
        desc: {
          en: "",
          ru: "",
        },
        icon: "",
        armorType: item.armor_type!,
        attackRange: item.attack_range!,
        attackSpeed: item.attack_speed!,
        avoidModify: item.avoid_modify!,
        canPenetrate: Boolean(item.can_penetrate!),
        consumeType: item.consume_type!,
        critical: item.critical!,
        criticalAttackSkill: item.critical_attack_skill!,
        crystalCount: item.crystal_count!,
        crystalType: item.crystal_type!,
        damageRange: item.damage_range ? item.damage_range.$ + "" : "none",
        defaultPrice: item.default_price!,
        dualFhitRate: item.dual_fhit_rate!,
        durability: item.durability!,
        etcitemType: item.etcitem_type!,
        hitModify: item.hit_modify!,
        immediateEffect: Boolean(item.immediate_effect!),
        initialCount: item.initial_count!,
        isDestruct: Boolean(item.is_destruct!),
        isDrop: Boolean(item.is_drop!),
        isTrade: Boolean(item.is_trade!),
        itemSkill: item.item_skill!,
        magicalDamage: item.magical_damage!,
        magicalDefense: item.magical_defense!,
        magicWeapon: Boolean(item.magic_weapon!),
        materialType: item.material_type!,
        maximumCount: item.maximum_count!,
        mpBonus: item.mp_bonus!,
        mpConsume: item.mp_consume!,
        physicalDamage: item.physical_damage!,
        physicalDefense: item.physical_defense!,
        randomDamage: item.random_damage!,
        reuseDelay: item.reuse_delay!,
        shieldDefense: item.shield_defense!,
        shieldDefenseRate: item.shield_defense_rate!,
        slotBitType: asSlot(item.slot_bit_type!.$.toString()),
        soulshotCount: item.soulshot_count!,
        spiritshotCount: item.spiritshot_count!,
        type: item.$[0].toString(),
        weaponType: item.weapon_type!,
        weight: item.weight!,
      });
    }
  }

  return items;
}

function loadItemNames (deps: {chronicle: Chronicle, itemData: Map<number, Item> }) {
  let itemNames = [];
  switch (deps.chronicle) {
    case "c1":
      itemNames = loadItemNamesC1();
      break;  
    default:
      itemNames = loadItemNamesC1();
      break;
  }
  const itemData = deps.itemData;

  for (const itemName of itemNames) {
    const item = itemData.get(itemName.id);
    if (item) {
      itemData.set(item.id, {
        ...item,
        name: { en: itemName.name, ru: itemName.name },
        desc: { en: itemName.description, ru: itemName.description },
      });
    }
  }

  return itemData;
}

function loadItemGrps (deps: {chronicle: Chronicle, itemData: Map<number, Item> }) {
  let itemGrps = []
  switch (deps.chronicle) {
    case "c1":
      itemGrps = loadItemGrpC1();
      break;  
    default:
      itemGrps = loadItemGrpC1();
      break;
  }
  const itemData = deps.itemData;

  for (const itemGrp of itemGrps) {
    const item = itemData.get(itemGrp.object_id);
    if (item) {
      itemData.set(item.id, {
        ...item,
        icon: itemGrp.icon.$[0].replace("icon.", "")
      });
    }
  }
  return itemData;
}

function loadItemRuNames (deps: { itemData: Map<number, Item> }) {
  const itemData = deps.itemData;
  const itemNames = loadItemNamesGF()

  for (const itemName of itemNames) {
    const item = itemData.get(itemName.id);
    if (item) {
      itemData.set(item.id, {
        ...item,
        name: { ...item.name, ru: itemName.name.ru },
      });
    }
  }

  return itemData;
}

const Slot = z.enum([
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
type Slot = z.infer<typeof Slot>;
const asSlot = Slot.parse;
