import { Crystal, Item } from "../result/types";
import { Chronicle } from "./types";

export function calcWeaponAtk(deps: {
  chronicle: Chronicle;
  level: number;
  item: Item;
}) {
  let pAtk = 0;
  let mAtk = 0;
  if (deps.item.type === "weapon") {
    let bonus;
    switch (deps.chronicle) {
      case "c1":
      case "c2":
        bonus = watkC1(deps.item.crystalType);
        break;
      case "c3":
        bonus = watkC3(deps.item.crystalType);
        break;
      case "c4":
        bonus = watkC3(deps.item.crystalType);
        break;
      case "c5":
        bonus = watkC3(deps.item.crystalType);
        break;
      case "il":
        bonus = watkC3(deps.item.crystalType);
        break;
      case "gf":
        bonus = watkGF(deps.item.crystalType);
        break;
    }

    if (deps.level <= 3) {
      if (isBow(deps.item)) {
        pAtk = Math.floor(
          bonus.bow * deps.level + (deps.item.physicalDamage ?? 0)
        );
      } else if (isOneHand(deps.item)) {
        pAtk = Math.floor(
          bonus.oneHand * deps.level + (deps.item.physicalDamage ?? 0)
        );
      } else if (isTwoHand(deps.item)) {
        pAtk = Math.floor(
          bonus.twoHand * deps.level + (deps.item.physicalDamage ?? 0)
        );
      } else {
        pAtk = deps.item.physicalDamage ?? 0;
      }
      mAtk = Math.floor(
        bonus.magic * deps.level + (deps.item.magicalDamage ?? 0)
      );
    } else {
      if (isBow(deps.item)) {
        pAtk = Math.floor(
          bonus.bow * 3 +
            bonus.bow * 2 * (deps.level - 3) +
            (deps.item.physicalDamage ?? 0)
        );
      } else if (isOneHand(deps.item)) {
        pAtk = Math.floor(
          bonus.oneHand * 3 +
            bonus.oneHand * 2 * (deps.level - 3) +
            (deps.item.physicalDamage ?? 0)
        );
      } else if (isTwoHand(deps.item)) {
        pAtk = Math.floor(
          bonus.twoHand * 3 +
            bonus.twoHand * 2 * (deps.level - 3) +
            (deps.item.physicalDamage ?? 0)
        );
      } else {
        pAtk = deps.item.physicalDamage ?? 0;
      }

      mAtk = Math.floor(
        bonus.magic * 3 +
          bonus.magic * 2 * (deps.level - 3) +
          (deps.item.magicalDamage ?? 0)
      );
    }
  }
  return { pAtk, mAtk };
}

export function calcArmorDef(deps: { level: number; item: Item }) {
  let pDef = 0;
  let mDef = 0;
  const bonus = 1;
  if (deps.item.type === "armor") {
    if (deps.level <= 3) {
      pDef = Math.floor(bonus * deps.level + (deps.item.physicalDefense ?? 0));
    } else {
      pDef = Math.floor(
        bonus * 3 +
          bonus * 3 * (deps.level - 3) +
          (deps.item.physicalDefense ?? 0)
      );
    }
  }
  if (deps.item.type === "accessary") {
    if (deps.level <= 3) {
      mDef = Math.floor(bonus * deps.level + (deps.item.magicalDefense ?? 0));
    } else {
      mDef = Math.floor(
        bonus * 3 +
          bonus * 3 * (deps.level - 3) +
          (deps.item.magicalDefense ?? 0)
      );
    }
  }
  return { pDef, mDef };
}

export function calcСrystals(deps: { level: number; item: Item }) {
  const crystals: number[] = [];

  if (deps.item.type === "weapon") {
    const bonus = wcb(deps.item.crystalType);
    if (bonus) {
      if (deps.level <= 3) {
        crystals.push(
          Math.floor(bonus * deps.level + (deps.item.crystalCount ?? 0))
        );
        crystals.push(
          //Math.floor(bonus * deps.level + (deps.item.crystalCount ?? 0) / 2)
          0
        );
      } else {
        crystals.push(
          Math.floor(
            bonus * 3 +
              bonus * 2 * (deps.level - 3) +
              (deps.item.crystalCount ?? 0)
          )
        );
        crystals.push(
          Math.floor(
            bonus * 3 +
              bonus * 2 * (deps.level - 3) +
              (deps.item.crystalCount ?? 0) / 2
          )
        );
      }
    }
  }
  if (deps.item.type === "accessary" || deps.item.type === "armor") {
    const bonus = acb(deps.item.crystalType);
    if (bonus) {
      if (deps.level <= 3) {
        crystals.push(
          Math.floor(bonus * deps.level + (deps.item.crystalCount ?? 0))
        );
        crystals.push(
          // Math.floor(bonus * deps.level + (deps.item.crystalCount ?? 0) / 2)
          0
        );
      } else {
        crystals.push(
          Math.floor(
            bonus * 3 +
              bonus * 3 * (deps.level - 3) +
              (deps.item.crystalCount ?? 0)
          )
        );
        crystals.push(
          Math.floor(
            bonus * 3 +
              bonus * 3 * (deps.level - 3) +
              (deps.item.crystalCount ?? 0) / 2
          )
        );
      }
    }
  }

  return crystals;
}

function wcb(type: Crystal) {
  switch (type) {
    case "d":
      return 90;
    case "c":
      return 45;
    case "b":
      return 67;
    case "a":
      return 145;
    case "s":
      return 250;
    default:
      return 1;
  }
}
function acb(type: Crystal) {
  switch (type) {
    case "d":
      return 11;
    case "c":
      return 6;
    case "b":
      return 11;
    case "a":
      return 20;
    case "s":
      return 25;
    default:
      return 1;
  }
}

//When enchanted,
//the P. Atk. of C grade weapons such as one-handed swords and blunt weapons, daggers and spears increases by 3.
//The P. Atk of two-handed swords and blunt weapons, dualswords, and two-handed fist-fighting weapons increases by 4.
//The P. Atk. of bow weapons increases by 6.
//The M. Atk. of all weapons increases by 3. From +4, P. Atk. and M. Atk. of all weapons are doubled.

//oneHand = one-handed swords and blunt weapons, daggers and spears
//twoHand = two-handed swords and blunt weapons, dualswords, and two-handed fist-fighting weapons

function isOneHand(item: Item) {
  if (item.slotBitType === "rhand" && item.weaponType === "sword") {
    return true;
  }
  if (item.slotBitType === "rhand" && item.weaponType === "blunt") {
    return true;
  }
  if (item.slotBitType === "rhand" && item.weaponType === "dagger") {
    return true;
  }
  if (item.slotBitType === "rhand" && item.weaponType === "etc") {
    return true;
  }
  if (item.weaponType === "pole") {
    return true;
  }
  return false;
}

function isTwoHand(item: Item) {
  if (item.slotBitType === "lrhand" && item.weaponType === "sword") {
    return true;
  }
  if (item.slotBitType === "lrhand" && item.weaponType === "blunt") {
    return true;
  }
  if (item.slotBitType === "lrhand" && item.weaponType === "blunt") {
    return true;
  }
  if (item.weaponType === "dual") {
    return true;
  }
  if (item.weaponType === "dualfist") {
    return true;
  }
  return false;
}

function isBow(item: Item) {
  if (item.weaponType === "bow") {
    return true;
  }
  return false;
}

// function watk(type: Crystal) {
//   switch (type) {
//     case "d":
//       return [2, 2];
//     case "c":
//       return [3, 3];
//     case "b":
//       return [3, 3];
//     case "a":
//       return [4, 3];
//     case "s":
//       return [5, 4];
//     default:
//       return [1, 1];
//   }
// }

function watkC1(type: Crystal) {
  switch (type) {
    case "d":
      return { oneHand: 2, twoHand: 2, bow: 2, magic: 2 };
    case "c":
      return { oneHand: 3, twoHand: 3, bow: 3, magic: 3 };
    case "b":
      return { oneHand: 3, twoHand: 3, bow: 3, magic: 3 };
    case "a":
      return { oneHand: 4, twoHand: 4, bow: 4, magic: 3 };
    case "s":
      return { oneHand: 5, twoHand: 5, bow: 5, magic: 4 };
    default:
      return { oneHand: 1, twoHand: 1, bow: 1, magic: 1 };
  }
}

function watkC3(type: Crystal) {
  switch (type) {
    case "d":
      return { oneHand: 2, twoHand: 2, bow: 4, magic: 2 };
    case "c":
      return { oneHand: 3, twoHand: 4, bow: 6, magic: 3 };
    case "b":
      return { oneHand: 3, twoHand: 4, bow: 6, magic: 3 };
    case "a":
      return { oneHand: 4, twoHand: 5, bow: 8, magic: 3 };
    case "s":
      return { oneHand: 5, twoHand: 6, bow: 10, magic: 4 };
    default:
      return { oneHand: 1, twoHand: 1, bow: 1, magic: 1 };
  }
}

function watkGF(type: Crystal) {
  switch (type) {
    case "d":
      return { oneHand: 2, twoHand: 2, bow: 4, magic: 2 };
    case "c":
      return { oneHand: 3, twoHand: 4, bow: 6, magic: 3 };
    case "b":
      return { oneHand: 3, twoHand: 4, bow: 6, magic: 3 };
    case "a":
      return { oneHand: 4, twoHand: 5, bow: 8, magic: 3 };
    case "s":
      return { oneHand: 5, twoHand: 6, bow: 10, magic: 4 };
    default:
      return { oneHand: 1, twoHand: 1, bow: 1, magic: 1 };
  }
}
