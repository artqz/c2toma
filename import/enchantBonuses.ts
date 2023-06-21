import { Crystal, Item } from "../result/types";

export function calcWeaponAtk(deps: { level: number; item: Item }) {
  let pAtk = 0;
  let mAtk = 0;
  if (deps.item.type === "weapon") {
    const bonus = watk(deps.item.crystalType);
    if (deps.level <= 3) {
      pAtk = Math.floor(
        bonus[0] * deps.level + (deps.item.physicalDamage ?? 0)
      );
      mAtk = Math.floor(bonus[1] * deps.level + (deps.item.magicalDamage ?? 0));
    } else {
      pAtk = Math.floor(
        bonus[0] * 3 +
          bonus[0] * 2 * (deps.level - 3) +
          (deps.item.physicalDamage ?? 0)
      );
      mAtk = Math.floor(
        bonus[1] * 3 +
          bonus[1] * 2 * (deps.level - 3) +
          (deps.item.magicalDamage ?? 0)
      );
    }
  }
  return { pAtk, mAtk };
}

export function calcWeaponAtk2(deps: { level: number; item: Item }) {
  let pAtk = 0;
  let mAtk = 0;
  if (deps.item.type === "weapon") {
    const bonus = watk(deps.item.crystalType);
    if (deps.level <= 3) {
      pAtk = Math.floor(
        bonus[0] * deps.level + (deps.item.physicalDamage ?? 0)
      );
      mAtk = Math.floor(bonus[1] * deps.level + (deps.item.magicalDamage ?? 0));
    } else {
      pAtk = Math.floor(
        bonus[0] * 3 +
          bonus[0] * 2 * (deps.level - 3) +
          (deps.item.physicalDamage ?? 0)
      );
      mAtk = Math.floor(
        bonus[1] * 3 +
          bonus[1] * 2 * (deps.level - 3) +
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

function watk(type: Crystal) {
  switch (type) {
    case "d":
      return [2, 2];
    case "c":
      return [3, 3];
    case "b":
      return [3, 3];
    case "a":
      return [4, 3];
    case "s":
      return [5, 4];
    default:
      return [1, 1];
  }
}
