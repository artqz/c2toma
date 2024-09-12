import { Skill } from "../../result/types";
import { CON_MOD } from "./mods/conMod";
import { DEX_MOD } from "./mods/dexMod";
import { INT_MOD } from "./mods/intMod";
import { LEVEL_BONUS } from "./mods/lvlBonus";
import { LVL_MOD } from "./mods/lvlMod";
import { MEN_MOD } from "./mods/menMod";
import { STR_MOD } from "./mods/strMod";
import { WEAPON_CRIT } from "./mods/weaponCrit";
import { WIT_MOD } from "./mods/witMod";

type SkillMod = {
  type: "per" | "diff";
  value: number;
};

export function calcHP(baseHP: number, CON: number) {
  return round(baseHP * CON_MOD[CON]);
}

export function calcHPRegen(baseMP: number, CON: number, LVL: number) {
  return round(baseMP * LVL_MOD[LVL] * CON_MOD[CON]);
}

export function calcMP(baseMP: number, MEN: number) {
  return round(baseMP * MEN_MOD[MEN]);
}

export function calcMPRegen(baseMP: number, MEN: number, LVL: number) {
  return round(baseMP * LVL_MOD[LVL] * MEN_MOD[MEN]);
}

export function calcPAtk(
  basePhysicalAttack: number,
  STR: number,
  LVL: number,
  skillMods: SkillMod[]
) {
  let stat = Math.round(Math.round(basePhysicalAttack) * LVL_MOD[LVL]) * STR_MOD[STR];
  for (const sm of skillMods) {
    if (sm.value !== 0) {
      continue;
    }
    if (sm.type === "per") {
      stat = Math.round(stat.percent(sm.value));
    } else {
      stat = stat + Math.round(sm.value);
    }
  }
  return Math.round(stat);
}

export function calcMAtk(
  baseMagicAttack: number,
  INT: number,
  LVL: number,
  skillMods: SkillMod[]
) {
  let stat = baseMagicAttack * INT_MOD[INT] ** 2 * LVL_MOD[LVL] ** 2;
  for (const sm of skillMods) {
    if (sm.type === "per") {
      stat = stat.percent(sm.value);
    } else {
      stat = stat + sm.value;
    }
  }
  return round(stat);
}

export function calcPDef(
  baseDefend: number,
  LVL: number,
  skillMods: SkillMod[]
) {
  // не сходится с томой
  // let stat = round((4 + baseDefend) * LVL_MOD[LVL]);
  let stat = Math.round(baseDefend) * LVL_MOD[LVL];

  for (const sm of skillMods) {
    // if (sm.value !== 0) {
    //   continue;
    // }
    if (sm.type === "per") {
      stat = stat.percent(sm.value);
    } else {
      stat = stat + sm.value;
    }
  }

  return Math.round(stat);
}

export function calcMDef(
  baseMagicDefend: number,
  MEN: number,
  LVL: number,
  skillMods: SkillMod[]
) {
  let stat = round(baseMagicDefend * LVL_MOD[LVL] * MEN_MOD[MEN]);
  for (const sm of skillMods) {
    if (sm.type === "per") {
      stat += stat.percent(sm.value);
    } else {
      stat = stat + sm.value;
    }
  }
  return round(stat);
}

export function calcMSpd(WIT: number, LVL: number) {
  return 333;
  return round(333 * LVL_MOD[LVL] * WIT_MOD[WIT]);
}

export function calcPSpd(baseAttackSpeed: number, DEX: number) {
  // return baseAttackSpeed;
  return round(baseAttackSpeed * DEX_MOD[DEX]);
}

export function calcSpeed(baseSpeed: number, DEX: number) {
  return round(baseSpeed * DEX_MOD[DEX]);
}

export function calcPCritical(base_critical: number, DEX: number) {
  return round(base_critical * DEX_MOD[DEX] * 10);
}

export function calcAccuracy(DEX: number, LVL: number) {
  // return round(Math.sqrt(DEX) * 6 + LEVEL_BONUS(LVL));
  return Math.round(Math.round(Math.sqrt(DEX)) * 6 + LVL + 6);
}

export function calcEvasion(DEX: number, LVL: number) {
  return round(Math.sqrt(DEX) * 6 + LEVEL_BONUS(LVL));
}

function round(int: number) {
  return Math.floor(int);
}

declare global {
  // to access the global type String
  interface Number {
    percent(percent: number): number;
  }
}

Number.prototype.percent = function (percent = 100) {
  const result =
    (this.valueOf() / 100) * Math.abs(parseFloat(percent.toString()));
  return Math.sign(parseFloat(percent.toString())) === -1
    ? this.valueOf() - result
    : result;
};

export function getSkillMod(deps: {
  skills: Map<string, Skill>;
  skillList: string[];
  effectName: string;
}) {
  const arr: { type: "per" | "diff"; value: number }[] = [];
  for (const id_lvl of deps.skillList) {
    const skill = deps.skills.get(id_lvl);
    if (skill && skill.effects && skill.operateType === "P") {
      if (skill.effects.length > 0) {
        for (const effect of skill.effects) {
          if (effect.effectName === deps.effectName) {
            // effect.effectName === "p_physical_attack" &&
            //   arr.push({
            //     type: effect.per ? "per" : "diff",
            //     value: effect.value,
            //   });
            switch (effect.effectName) {
              case "p_physical_attack":
                arr.push({
                  type: effect.per ? "per" : "diff",
                  value: effect.value,
                });
                break;
              case "p_physical_defence":
                arr.push({
                  type: effect.per ? "per" : "diff",
                  value: effect.value,
                });
              default:
                break;
            }
          }
        }
      }
    }
  }
  return arr;
}
