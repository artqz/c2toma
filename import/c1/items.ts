import { z } from "zod";
import { loadItemDataC1 } from "../../datapack/c1/itemdata";
import { Item } from "../../result/types";
import { loadItemNamesC1 } from "../../datapack/c1/itemnames";
import { loadItemGrpC1 } from "../../datapack/c1/itemgrp";
import { loadItemNamesGF } from "../../datapack/gf/itemnames";
import { Chronicle } from "../types";
import {
  calcArmorDef,
  calcChance,
  calcWeaponAtk,
  calcСrystals,
} from "../enchantBonuses";
import { loadItemDataGF } from "../../datapack/gf/itemdata";
import { loadItemGrpGF } from "../../datapack/gf/itemgrp";
import { loadItemDataC4 } from "../../datapack/c4/itemdata";
import { loadItemGrpC4 } from "../../datapack/c4/itemgrp";
import { loadItemNamesC4 } from "../../datapack/c4/itemnames";
import { loadItemNamesIL } from "../../datapack/il/itemnames";
import { loadItemGrpIL } from "../../datapack/il/itemgrp";
import { ItemDataEntry } from "../../datapack/types";
import { generateItemsIL } from "./il/items";
import { generateItemsC5 } from "./c5/items";
import { loadItemGrpC5 } from "../../datapack/c5/itemgrp";
import { getTypeMaterials } from "./items/materials";
import { loadItemNamesC5 } from "../../datapack/c5/itemnames";
import { generateItemsCT1 } from "./ct1/items";
import { loadItemNamesCT1 } from "../../datapack/ct1/itemnames";
import { loadItemGrpCT1 } from "../../datapack/ct1/itemgrp";

export function loadItems(deps: { chronicle: Chronicle }) {
  let items = loadItemData(deps);
  items = loadItemNames({ ...deps, itemData: items });
  items = loadItemGrps({ ...deps, itemData: items });
  items = loadItemRuNames({ ...deps, itemData: items });
  items = loadItemEnchantBonuses({ ...deps, itemData: items });
  getTypeMaterials({ items });
  console.log(`Items loaded (${Array.from(items.values()).length}).`);

  return items;
}

function loadItemData(deps: { chronicle: Chronicle }) {
  switch (deps.chronicle) {
    case "c1":
      return addItems(loadItemDataC1());
    case "c4":
      return addItems(loadItemDataC4());
    case "c5":
      return addItemsC5();
    case "il":
      return addItemsIL();
      case "ct1":
      return addItemsCT1();
    case "gf":
      return addItems(loadItemDataGF());

    default:
      return addItems(loadItemDataC1());
  }
}

function addItems(itemsData: ItemDataEntry[]) {
  const items = new Map<number, Item>();

  for (const item of itemsData) {
    if (item.item_type) {
      items.set(item.$[1], {
        id: item.$[1]!,
        itemName: item.$[2]!.toString().replace(/:|\s/g, "_").toLowerCase(),
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
        crystalType: item.crystal_type ?? "none",
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
        enchantBonus: [],
        defaultAction: item.default_action,
      });
    }
  }
  return items;
}

function addItemsC5() {
  return generateItemsC5();
}

function addItemsIL() {
  return generateItemsIL();
}

function addItemsCT1() {
  return generateItemsCT1();
}

function loadItemNames(deps: {
  chronicle: Chronicle;
  itemData: Map<number, Item>;
}) {
  switch (deps.chronicle) {
    case "c1":
      addNamesC1(deps);
      break;
    case "c4":
      addNamesC4(deps);
      break;
    case "c5":
      addNamesC5(deps);
      break;
    case "il":
      addNamesIL(deps);
      break;
    case "ct1":
      addNamesCT1(deps);
      break;
    case "gf":
      addNamesGF(deps);
      break;
    default:
      addNamesC1(deps);
      break;
  }

  return deps.itemData;
}

function loadItemGrps(deps: {
  chronicle: Chronicle;
  itemData: Map<number, Item>;
}) {
  switch (deps.chronicle) {
    case "c1":
      addIconsC1(deps);
      break;
    case "c4":
      addIconsC4(deps);
      break;
    case "c5":
      addIconsC5(deps);
      break;
    case "il":
      addIconsIL(deps);
      break;
    case "ct1":
      addIconsCT1(deps);
      break;
    case "gf":
      addIconsGF(deps);
      break;
    default:
      addIconsC1(deps);
      break;
  }
  return deps.itemData;
}

function loadItemRuNames(deps: {
  chronicle: Chronicle;
  itemData: Map<number, Item>;
}) {
  const itemData = deps.itemData;
  if (
    deps.chronicle === "c1" ||
    deps.chronicle === "c4" ||
    deps.chronicle === "c5" ||
    deps.chronicle === "il" ||
    deps.chronicle === "ct1"
  ) {
    const itemNames = loadItemNamesGF();

    for (const itemName of itemNames) {
      const item = itemData.get(itemName.id);
      if (item) {
        itemData.set(item.id, {
          ...item,
          addName: { ...item.addName, ru: itemName.add_name.ru },
          name: { ...item.name, ru: itemName.name.ru },
          desc: { ...item.desc, ru: item.desc.en },
        });
      }
    }
  }

  return itemData;
}

function loadItemEnchantBonuses(deps: {
  chronicle: Chronicle;
  itemData: Map<number, Item>;
}) {
  // пока только ц1 -ц2
  for (const item of deps.itemData.values()) {
    for (let i = 0; i <= (deps.chronicle === "c1" ? 16 : 20); i++) {
      if (
        (item.crystalType !== "none" && item.type === "weapon") ||
        (item.crystalType !== "none" && item.type === "armor") ||
        (item.crystalType !== "none" && item.type === "accessary")
      ) {
        if (!item.itemName.includes("_bytime")) {
          item.enchantBonus.push({
            level: i,
            pAtk: calcWeaponAtk({ chronicle: deps.chronicle, level: i, item })
              .pAtk,
            mAtk: calcWeaponAtk({ chronicle: deps.chronicle, level: i, item })
              .mAtk,
            pDef: calcArmorDef({ level: i, item }).pDef,
            mDef: calcArmorDef({ level: i, item }).mDef,
            crystals: calcСrystals({ level: i, item }),
            chance: calcChance({ level: i, item, chronicle: deps.chronicle }),
          });
        }
      }
    }
  }

  return deps.itemData;
}

function addIconsC1(deps: { itemData: Map<number, Item> }) {
  const itemData = deps.itemData;
  for (const itemGrp of loadItemGrpC1()) {
    const item = itemData.get(itemGrp.object_id);
    if (item) {
      itemData.set(item.id, {
        ...item,
        icon: itemGrp.icon.$[0].replace("icon.", ""),
      });
    }
  }
}

function addIconsC4(deps: { itemData: Map<number, Item> }) {
  const itemData = deps.itemData;
  for (const itemGrp of loadItemGrpC4()) {
    const item = itemData.get(parseInt(itemGrp.id));
    if (item) {
      itemData.set(item.id, {
        ...item,
        icon: itemGrp["icon[0]"].replace("icon.", ""),
      });
    }
  }
}

function addIconsC5(deps: { itemData: Map<number, Item> }) {
  const itemData = deps.itemData;
  for (const itemGrp of loadItemGrpC5()) {
    const item = itemData.get(itemGrp.id);
    if (item) {
      itemData.set(item.id, {
        ...item,
        icon: addIcon(itemGrp.icon, item.itemName),
      });
    }
  }
}

function addIconsIL(deps: { itemData: Map<number, Item> }) {
  const itemData = deps.itemData;
  for (const itemGrp of loadItemGrpIL()) {
    const item = itemData.get(itemGrp.id);
    if (item) {
      itemData.set(item.id, {
        ...item,
        icon: addIcon(itemGrp.icon, item.itemName),
      });
    }
  }
}

function addIconsCT1(deps: { itemData: Map<number, Item> }) {
  const itemData = deps.itemData;
  for (const itemGrp of loadItemGrpCT1()) {
    const item = itemData.get(itemGrp.id);
    if (item) {
      itemData.set(item.id, {
        ...item,
        icon: addIcon(itemGrp.icon, item.itemName),
      });
    }
  }
}

function addIconsGF(deps: { itemData: Map<number, Item> }) {
  const itemData = deps.itemData;
  for (const itemGrp of loadItemGrpGF()) {
    const item = itemData.get(parseInt(itemGrp.id));
    if (item) {
      itemData.set(item.id, {
        ...item,
        icon: itemGrp["icon[0]"].replace("icon.", ""),
      });
    }
  }
}

function addIcon(icon: string, itemName: string) {
  let _icon: string = "";
  if (icon !== "") {
    _icon = icon;
  } else {
    if (itemName.includes("herb_of_hp_a")) {
      _icon = "etc_hp_herb_i00";
    }
    if (itemName.includes("herb_of_mp_a")) {
      _icon = "etc_mp_herb_i00";
    }
    if (itemName.includes("herb_of_pa")) {
      _icon = "etc_herb_red_i00";
    }
    if (itemName.includes("herb_of_ma")) {
      _icon = "etc_herb_blue_i00";
    }
  }
  return _icon;
}

function addNamesC1(deps: { itemData: Map<number, Item> }) {
  const itemData = deps.itemData;
  for (const itemName of loadItemNamesC1()) {
    const item = itemData.get(itemName.id);
    if (item) {
      itemData.set(item.id, {
        ...item,
        name: { en: itemName.name, ru: itemName.name },
        desc: { en: itemName.description, ru: itemName.description },
      });
    }
  }
}

function addNamesC4(deps: { itemData: Map<number, Item> }) {
  const itemData = deps.itemData;
  for (const itemName of loadItemNamesC4()) {
    const item = itemData.get(itemName.id);
    if (item) {
      itemData.set(item.id, {
        ...item,
        addName: itemName.add_name,
        name: itemName.name,
        desc: itemName.desc,
      });
    }
  }
}

function addNamesC5(deps: { itemData: Map<number, Item> }) {
  const itemData = deps.itemData;
  for (const itemName of loadItemNamesC5()) {
    const item = itemData.get(itemName.id);
    if (item) {
      itemData.set(item.id, {
        ...item,
        addName: itemName.add_name,
        name: itemName.name,
        desc: itemName.desc,
      });
    }
  }
}

function addNamesIL(deps: { itemData: Map<number, Item> }) {
  const itemData = deps.itemData;
  for (const itemName of loadItemNamesIL()) {
    const item = itemData.get(itemName.id);
    if (item) {
      itemData.set(item.id, {
        ...item,
        addName: itemName.add_name,
        name: itemName.name,
        desc: itemName.desc,
      });
    }
  }
}

function addNamesCT1(deps: { itemData: Map<number, Item> }) {
  const itemData = deps.itemData;
  for (const itemName of loadItemNamesCT1()) {
    const item = itemData.get(itemName.id);
    if (item) {
      itemData.set(item.id, {
        ...item,
        addName: itemName.add_name,
        name: itemName.name,
        desc: itemName.desc,
      });
    }
  }
}

function addNamesGF(deps: { itemData: Map<number, Item> }) {
  const itemData = deps.itemData;
  for (const itemName of loadItemNamesGF()) {
    const item = itemData.get(itemName.id);
    if (item) {
      itemData.set(item.id, {
        ...item,
        addName: itemName.add_name,
        name: itemName.name,
        desc: itemName.desc,
      });
    }
  }
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
