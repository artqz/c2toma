import {
  SkillEnffect,
  SkillOperateCond,
  loadSkillDataC4,
} from "../datapack/c4/skilldata";
import { Skill } from "../result/types";
import { saveFile } from "../utils/Fs";
const effectNameMap = new Map();
const effects = new Map<string, { skillName: string; list: string }>();
const operateCondNameMap = new Map();
const map = new Map<
  string,
  { skillName: string; effect: string; operateCond: string }
>();

export function loadEffects(deps: { skills: Map<string, Skill> }) {
  const skillC4ByName = new Map(
    loadSkillDataC4().map((s) => [s.skill_name, s])
  );
  const skillByName = new Map(
    Array.from(deps.skills.values()).map((s) => [s.skillName, s])
  );
  for (const skill of deps.skills.values()) {
    const skillC4 = skillC4ByName.get(skill.skillName);
    if (skillC4) {
      effectReader({ effect: skillC4.effect, skillName: skill.skillName });
      operateCondReader({
        operateCond: skillC4.operate_cond,
        skillName: skill.skillName,
      });
    }
  }

  for (const effect of effects.values()) {
    const skill = skillByName.get(effect.skillName);
    if (skill) {
      skill.effect = effect.list;
    }
  }
  //delete
  saveFile(
    "result/data/effects.json",
    JSON.stringify(Array.from(effectNameMap.values()), null, 2)
  );
  //  saveFile("result/data/operateConds.json", JSON.stringify(Array.from(operateCondNameMap.values()), null, 2))
  //

  return deps.skills;
}

export function effectReader(deps: {
  effect: SkillEnffect;
  skillName: string;
}) {
  type EffectObject = {
    inc: string[];
  };
  const array: string[] = [];
  deps.effect.$?.map((e) => {
    array.push(
      effect({
        effectName: e.$[0],
        prop1: getParam(e.$[1]),
        prop2: getParam(e.$[2]),
        prop3: getParam(e.$[3]),
        prop4: getParam(e.$[4]),
      })
    );
    effectNameMap.set(
      // deps.skillName,
      e.$[0],
      `skillName: ${deps.skillName}, effect: ${e.$[0]}: ${effect({
        effectName: e.$[0],
        prop1: getParam(e.$[1]),
        prop2: getParam(e.$[2]),
        prop3: getParam(e.$[3]),
        prop4: getParam(e.$[4]),
      })} ${getParam(e.$[1])} ${e.$[2]} ${e.$[3]} ${e.$[4]}`
    );
    // map.set(deps.skillName, {skillName: deps.skillName, effect: effect({effectName: e.$[0], prop1: getParam(e.$[1]), prop2: getParam(e.$[2]), prop3: getParam(e.$[3])}), operateCond: ""})
  });
  effects.set(deps.skillName, {
    skillName: deps.skillName,
    list: array.join(", "),
  });
  return [];
}

function getParam(
  param:
    | string
    | number
    | {
        $: string[];
      }
    | {
        $: {
          $: any[];
        }[];
      }
    | undefined
) {
  if (typeof param === "string") {
    return `${param}`;
  }
  if (typeof param === "number") {
    return `${param}`;
  }
  if (typeof param === "object") {
    // console.log(param.$.length);
    const toStr =
      param.$.length === 1
        ? param.$.join("")
        : param.$.length === 2
        ? param.$.join(" or ")
        : param.$.join(", ");
    return toStr !== "all" ? toStr : null;
  }
  if (param === undefined) {
    return "undefined";
  } else {
    return `{gouno: ${param}}`;
  }
}

function effect(params: {
  effectName: string;
  prop1: string | null;
  prop2: string | null;
  prop3: string | null;
  prop4: string | null;
}) {
  const { effectName, prop1, prop2, prop3, prop4 } = params;
  switch (effectName) {
    case "i_p_attack_over_hit":
      return `Power ${prop1}`;
    case "p_speed":
      return p3(`Movement speed`, prop1, prop2, prop3);
    case "i_fatal_blow":
      return `Power ${prop1}`;
    case "i_dispel_by_slot":
      return `Self-cures ${prop1}. Effect ${prop2}`;
    case "i_heal":
      return `Power ${prop1}`;
    case "i_hp_drain":
      return `Absorbs HP. Power ${prop1}`;
    case "i_backstab":
      return `Power ${prop1}`;
    case "p_remove_equip_penalty":
      return `Becomes familiar with ${prop1?.toUpperCase()} grade equipment`;
    case "p_physical_attack":
      return p3(`P. Atk`, prop1, prop2, prop3);
    case "p_physical_defence":
      return p3(`P. Def`, prop1, prop2, prop3);
    case "p_avoid":
      return p3(`Evasion`, prop1, prop2, prop3);
    case "p_magic_speed":
      return p3(`Casting Spd.`, prop1, prop2, prop3);
    case "p_attack_speed":
      return p3(`Atk. Spd.`, prop1, prop2, prop3);
    case "t_hp":
      return tick("HP", prop1, prop2);
    case "t_mp":
      return tick("MP", prop1, prop2);
    case "i_m_attack":
      return `Power ${prop1}`;
    case "c_mp_by_level":
      return `MP is continuously consumed proportional to user's level`;
    case "p_critical_damage":
      return `Power ${prop1}`;
    case "i_unlock":
      return `Door level 1 - ${prop1}%, level 2 - ${prop2}%, and level 3 - ${prop3}%`;
    case "i_give_contribution":
      return `i_give_contribution: ${prop1}`;
    case "c_mp":
      return tick("MP", prop1, prop2);
    case "c_hp":
      return tick("HP", prop1, prop2);
    case "p_avoid_agro":
      return `Protected from a monster's pre-emptive attack (${prop1})`;
    case "i_randomize_hate":
      return `i_randomize_hate: ${prop1}`;
    case "p_passive":
      return `p_passive`;
    case "p_avoid_by_move_mode":
      return moveMode(`Evasion`, prop1, prop2, prop3);
    case "p_hp_regen_by_move_mode":
      return moveMode(`Regen HP`, prop1, prop2, prop3);
    case "p_mp_regen_by_move_mode":
      return moveMode(`Regen MP`, prop1, prop2, prop3);
    case "p_breath":
      return `Breath ${prop1?.indexOf("-") !== -1 ? "" : "+"}${prop1}${
        prop2 === "per" ? "%" : ""
      }`;
    case "p_safe_fall_height":
      return `Safe Fall Height ${
        prop1?.indexOf("-") !== -1 ? "" : "+"
      }${prop1}${prop2 === "per" ? "%" : ""}`;
    case "p_hit_number":
      return `Number of targets ${prop1}`;
    case "p_block_act":
      return `Block`;
    case "p_max_hp":
      return p2("Max HP", prop1, prop2);
    case "p_max_mp":
      return p2("Max MP", prop1, prop2);
    case "p_create_item":
      return `Level ${prop1}`;
    case "p_crystallize":
      return `Type ${prop1}`;
    case "p_crystallize":
      return `Type ${prop1}`;
    case "p_hp_regen":
      return pRegen("Regen HP", prop1, prop2, prop3);
    case "p_mp_regen":
      return pRegen("Regen MP", prop1, prop2, prop3);
    case "p_weight_limit":
      return `Wight limit ${prop1}`;
    case "i_summon":
      return `${prop1} ${prop2} ${prop3} ${prop4}`;
    case "p_attack_range":
      return p3(`P. Atk. Range`, prop1, prop2, prop3);
    case "p_hit":
      return p3(`Accuracy`, prop1, prop2, prop3);
    case "p_attack_speed_by_weapon":
      return p3(`Atk. Spd.`, prop1, prop2, prop3);
    case "p_magical_attack":
      return p3(`M. Atk.`, prop1, prop2, prop3);
    case "p_magical_defence":
      return p3(`M. Def.`, prop1, prop2, prop3);
    case "p_defence_attribute":
      return pAttribute("Resistance to", prop1, prop2, prop3);
    case "i_delete_hate":
      return `Delete hate (${prop1})`;
    case "i_delete_hate_of_me":
      return `Delete hate (${prop1})`;
    case "i_resurrection":
      return `Resurrection (${prop1})`;
    case "p_reuse_delay":
      return pDelay(prop1, prop2, prop3);
    case "p_attack_attribute":
      return pAttribute("Attack", prop1, prop2, prop3);
    case "i_hp_per_max":
      return `HP per max ${prop1}`;
    case "i_mp_per_max":
      return `MP per max ${prop1}`;
    case "p_reduce_cancel":
      return p2("Probability of canceling a magic spell", prop1, prop2);
    case "i_p_attack":
      return `Power ${prop1}`;
    case "p_area_damage":
      return p2("Terrain damage", prop1, prop2);
    case "p_vampiric_attack":
      return `Absorb Damage ${prop1}%`;
    case "c_fake_death":
      return `Consumes ${prop1} MP per second`;
    case "p_critical_rate":
      return p2("Critical Rate", prop1, prop2);
    case "p_2h_sword_bonus":
      return p2hBonus(prop1, prop2, prop3, prop4);
    case "p_2h_blunt_bonus":
      return p2hBonus(prop1, prop2, prop3, prop4);
    case "i_mp":
      return p2("MP regenerate", prop1, prop2);
    case "p_weight_penalty":
      return `Weight limit ${prop1}`;
    case "p_block_move":
      return `Block move`;
    case "i_hp_by_level_self":
      return `Absorb Damage ${prop1}%`;
    case "i_consume_body":
      return `Consume body`;
    case "i_mp_by_level":
      return `Power ${prop1}`;
    case "p_shield_defence_rate":
      return `Shield Defense ${prop1?.indexOf("-") !== -1 ? "" : "+"}${prop1}%`;
    case "p_heal_effect":
      return p2("Heal Effect", prop1, prop2);
    case "i_run_away":
      return `Run Away ${prop1} ${prop2}`;
    case "i_confuse":
      return `Confuse ${prop1} ${prop2}`;
    case "p_block_spell":
      return `Block Spell`;
    case "i_spoil":
      return `Spoil`;
    case "p_damage_shield":
      return `Reflect Damage ${prop1}%`;
    case "p_physical_defence_by_hp1":
      return p2("P. Def.", prop1, prop2);
    case "p_physical_attack_by_hp2":
      return p2("P. Atk.", prop1, prop2);
    case "p_physical_attack_by_hp1":
      return p2("P. Atk.", prop1, prop2);
    case "p_critical_rate_by_hp2":
      return p2("Rate Crit", prop1, prop2);
    case "p_luck":
      return `Luck`;
    case "p_hit_at_night":
      return p2("Accuracy at night", prop1, prop2);
    case "p_mana_charge":
      return `Gain Mp +${prop1}`;
    case "i_death_link":
      return `Power ${prop1}`;
    case "i_distrust":
      return `Distrust ${prop1} ${prop2}`;
    case "i_energy_attack":
      return `Power ${prop1}`;
    case "i_focus_energy":
      return `Focus energy level ${prop1}`;
    case "i_summon_dd_cubic":
      return `Summon dd cubic`;
    case "i_summon_paralyze_cubic":
      return `Summon paralyze cubic`;
    case "i_summon_heal_cubic":
      return `Summon heal cubic`;
    case "i_summon_water_dot_cubic":
      return "Summon water dot cubic";
    case "i_summon_drain_cubic":
      return `Summon drain cubic`;
    case "i_summon_debuff_cubic":
      return `Summon debuff cubic`;
    case "i_summon_shock_cubic":
      return `Summon shock cubic`;
    case "i_summon_poison_cubic":
      return `Summon poison cubic`;
    case "i_register_siege_golem":
      return "Register siege golem";
    case "p_abnormal_rate_limit":
      return `Abnormal rate limit`;
    case "i_remove_m_power":
      return `Remove M. Power`;
    case "p_block_debuff":
      return `Block debuff`;
    case "i_sweeper":
      return `Sweeper`;
    case "i_escape":
      return `Escape (${prop1})`;
    case "i_m_attack_over_hit":
      return `Power ${prop1}`;
    case "p_transfer_damage_summon":
      return `Trans Damage ${prop1}%`;
    case "i_add_hate":
      return `Power ${prop1}`;
    case "p_pvp_magical_skill_dmg_bonus":
      return p2("PvP magic damage", prop1, prop2);
    case "i_dispel_by_category":
      return `Dispel category ${prop1} ${prop2}`;
    case "i_transmit_m_power":
      return `Transmit M. Ppower ${prop1}`;
    case "p_cubic_mastery":
      return `Ability to summon ${prop1} Cubics`;
    case "c_rest":
      return `Regen HP +${prop2}, MP ${prop1} every 1 second`;
    case "c_chameleon_rest":
      return `Regen HP +${prop2}, MP ${prop1} every 1 second`;
    default:
      return `${JSON.stringify(params)}`;
  }
}

function p3(
  text: string,
  prop1: string | null,
  prop2: string | null,
  prop3: string | null
) {
  return `${text} ${prop2?.indexOf("-") !== -1 ? "" : "+"}${prop2}${
    prop3 === "per" ? "%" : ""
  }${
    prop1 && prop1
      ? prop1?.indexOf("armor_") !== -1
        ? ` when one is wearing ${prop1}`
        : ` when using a ${prop1}`
      : ``
  }`;
}

function moveMode(
  text: string,
  prop1: string | null,
  prop2: string | null,
  prop3: string | null
) {
  return `${text} ${prop2?.indexOf("-") !== -1 ? "" : "+"}${prop2}${
    prop3 === "per" ? "%" : ""
  }${
    prop1
      ? prop1 === "run"
        ? ` when running`
        : prop1 === "stand"
        ? ` while standing`
        : prop1 === "walk"
        ? ` while walking`
        : ` when sitting`
      : ``
  }`;
}

function pAttribute(
  text: string,
  prop1: string | null,
  prop2: string | null,
  prop3: string | null
) {
  return `${text} ${prop1} ${
    prop2 !== "undefined"
      ? `${prop2?.indexOf("-") !== -1 ? "" : "+"}${prop2}${
          prop3 === "per" ? "%" : ""
        }`
      : ""
  }`;
}

function p2(text: string, prop1: string | null, prop2: string | null) {
  return `${text} ${prop1?.indexOf("-") !== -1 ? "" : "+"}${prop1}${
    prop2 === "per" ? "%" : ""
  }`;
}

function p2hBonus(
  prop1: string | null,
  prop2: string | null,
  prop3: string | null,
  prop4: string | null
) {
  return `P. Atk. ${prop1?.indexOf("-") !== -1 ? "" : "+"}${prop1}${
    prop2 === "per" ? "%" : ""
  } and Accuracy ${prop3?.indexOf("-") !== -1 ? "" : "+"}${prop3}${
    prop4 === "per" ? "%" : ""
  }`;
}

function tick(text: string, prop1: string | null, prop2: string | null) {
  return `${text} ${
    prop1?.indexOf("-") !== -1 ? "" : "+"
  }${prop1} every ${prop2} ${prop2 !== "1" ? "seconds" : "second"}`;
}

function pRegen(
  text: string,
  prop1: string | null,
  prop2: string | null,
  prop3: string | null
) {
  return `${text} ${prop2?.indexOf("-") !== -1 ? "" : "+"}${prop2}${
    prop3 === "per" ? "%" : ""
  }`;
}

function pDelay(
  prop1: string | null,
  prop2: string | null,
  prop3: string | null
) {
  return `Skills (type: ${prop1}) re-use time ${
    prop2?.indexOf("-") !== -1 ? "" : "+"
  }${prop2}${prop3 === "per" ? "%" : ""}`;
}

function operateCondReader(deps: {
  operateCond: SkillOperateCond;
  skillName: string;
}) {
  deps.operateCond?.$.map((oc) => {
    operateCondNameMap.set(
      // deps.skillName,
      deps.skillName + "_" + oc.$[0],
      `skillName: ${deps.skillName}, operateCond: ${oc.$[0]}: ${operateCond({
        operateCondName: oc.$[0],
        prop1: ocGetParam(oc.$[1]),
      })} ${oc.$[2]}`
    );
    // const m = map.get(deps.skillName)
    // if (m) map.set(deps.skillName, {skillName: deps.skillName, effect: m.effect, operateCond: operateCond({operateCondName: oc.$[0], prop1: ocGetParam(oc.$[1])})})
  });
}

function ocGetParam(
  param:
    | string
    | number
    | {
        $: string[];
      }
    | {
        $: {
          $: any[];
        }[];
      }
    | undefined
): string {
  if (typeof param === "string") {
    return `${param}`;
  }
  if (typeof param === "number") {
    return `${param}`;
  }
  if (typeof param === "object") {
    // console.log(param.$.length);
    let toStr = param.$.length === 1 ? param.$.join("") : param.$.join(", ");
    toStr = toStr.replace(/,(?=[^,]+$)/, ", or");

    return toStr;
  } else {
    return `{gouno: ${param}}`;
  }
}

function operateCond(params: { operateCondName: string; prop1: string }) {
  const { operateCondName, prop1 } = params;
  switch (operateCondName) {
    case "equip_weapon":
      return `Usable when a ${prop1}`;
    default:
      return `${params}`;
  }
}
