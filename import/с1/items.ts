import { z } from "zod";
import { loadItemDataC1 } from "../../datapack/c1/itemdata";
import { Item } from "../../result/types";

export function loadItems() {
  let items = loadItemData();

  console.log("Items loaded.");

  return items;
}

function loadItemData() {
  const itemData = loadItemDataC1();
  const items = new Map<number, Item>();

  for (const item of itemData) {
    if (item.item_type) {
      items.set(item.$[1], {
        id: item.$[1]!,
        itemName: item.$[2]!.toString().replace(":", "_"),
        //name: itemC2.name.length ? itemC2.name : itemnameGF?.name ?? itemC4.$[2]!.toString().replace(":", "_"),
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
