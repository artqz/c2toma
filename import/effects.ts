import { SkillEnffect, SkillOperateCond, loadSkillDataC4 } from '../datapack/c4/skilldata';
import { Skill } from '../result/types';
import { saveFile } from '../utils/Fs';
const effectNameMap = new Map()
const operateCondNameMap  = new Map()
const map = new Map<string, {skillName: string, effect: string, operateCond: string}>()

export function loadEffects (deps: {
  skills: Map<string, Skill>
}) {
  const skillC4ByName = new Map(loadSkillDataC4().map(s => [s.skill_name, s]))
  for (const skill of deps.skills.values()) {
    const skillC4 = skillC4ByName.get(skill.skillName)
    if (skillC4) {
      effectReader({effect: skillC4.effect, skillName: skill.skillName})
      operateCondReader({operateCond: skillC4.operate_cond, skillName: skill.skillName})
    }
  }
  //delete
  saveFile("result/data/effects.json", JSON.stringify(Array.from(effectNameMap.values()), null, 2))
  //  saveFile("result/data/operateConds.json", JSON.stringify(Array.from(operateCondNameMap.values()), null, 2))
  //
  
  return deps.skills
}
  

export function effectReader(deps: {
  effect: SkillEnffect;
  skillName: string;
}) {
  type EffectObject = {
    inc: string[]
  }
  const array: string[] = []
  deps.effect.$?.map((e) => {
    array.push(effect({effectName: e.$[0], prop1: getParam(e.$[1]), prop2: getParam(e.$[2]), prop3: getParam(e.$[3])}))
    effectNameMap.set(
      // deps.skillName,
      e.$[0],
      `skillName: ${deps.skillName}, effect: ${e.$[0]}: ${effect({effectName: e.$[0], prop1: getParam(e.$[1]), prop2: getParam(e.$[2]), prop3: getParam(e.$[3])})} ${getParam(e.$[1])} ${e.$[2]} ${e.$[3]} ${e.$[4]}`
    );
    // map.set(deps.skillName, {skillName: deps.skillName, effect: effect({effectName: e.$[0], prop1: getParam(e.$[1]), prop2: getParam(e.$[2]), prop3: getParam(e.$[3])}), operateCond: ""})
  });
  // map.set(deps.skillName, {skillName: deps.skillName, effect: array.join(", "), operateCond: ""})
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
    const toStr = param.$.length === 1 ? param.$.join('') : param.$.length === 2 ? param.$.join(' or ') : param.$.join(', ') 
    return toStr !== "all" ? toStr : null;
  } else {
    return `{gouno: ${param}}`;
  }
}

function effect(params: {effectName: string, prop1:string|null, prop2:string|null, prop3:string|null}) {
  const {effectName, prop1, prop2, prop3} = params
  switch (effectName) {
    case "i_p_attack_over_hit":
      return `Power ${prop1}`
    case "p_speed":
      return chetko(`Movement speed`, prop1, prop2, prop3)
    case "i_fatal_blow":
      return  `Power ${prop1}`
    case "i_dispel_by_slot":
      return `Self-cures ${prop1}. Effect ${prop2}`
    case "i_heal":
      return `Power ${prop1}`
    case "i_hp_drain":
      return `Absorbs HP. Power ${prop1}`
    case "i_backstab":
      return `Power ${prop1}`
    case "p_remove_equip_penalty":
      return `Becomes familiar with ${prop1?.toUpperCase()} grade equipment`
    case "p_physical_attack":
      return chetko(`P. Atk`, prop1, prop2, prop3)
    case "p_physical_defence":
      return chetko(`P. Def`, prop1, prop2, prop3)
    case "p_avoid":
      return chetko(`Evasion`, prop1, prop2, prop3)
    case "p_magic_speed":
      return chetko(`Casting Spd.`, prop1, prop2, prop3)
    case "p_attack_speed":
      return chetko(`Atk. Spd.`, prop1, prop2, prop3)
    case "t_hp":
      return hpmp("HP", prop1, prop2)
    case "i_m_attack":
      return `Power ${prop1}`
    case "c_mp_by_level":
      return `MP is continuously consumed proportional to user's level`
    case "p_critical_damage":
      return `Power ${prop1}`
    case "i_unlock":
      return `Door level 1 - ${prop1}%, level 2 - ${prop2}%, and level 3 - ${prop3}%`
    case "i_give_contribution":
      return `i_give_contribution: ${prop1}`
    case "c_mp":
      return hpmp("MP", prop1, prop2)
    case "p_avoid_agro":
      return `Protected from a monster's pre-emptive attack (${prop1})`
    case "i_randomize_hate":
      return `i_randomize_hate: ${prop1}`
    case "p_passive":
      return `p_passive`
    case "p_avoid_by_move_mode":
      return moveMode(`Evasion`, prop1, prop2, prop3)
    case "p_hp_regen_by_move_mode":
      return moveMode(`Regen HP`, prop1, prop2, prop3)
    case "p_mp_regen_by_move_mode":
      return moveMode(`Regen MP`, prop1, prop2, prop3)
    case "p_breath":
      return `Breath ${prop1?.indexOf("-") !== -1 ? '' : '+'}${prop1}${prop2 === "per" ? "%" : ""}`
    case "p_safe_fall_height":
      return `Safe Fall Height ${prop1?.indexOf("-") !== -1 ? '' : '+'}${prop1}${prop2 === "per" ? "%" : ""}`
    default: 
      return `${JSON.stringify(params)}`;
  }
}

function chetko(text: string, prop1:string|null, prop2:string|null, prop3:string|null ) {
  return `${text} ${prop2?.indexOf("-") !== -1 ? '' : '+'}${prop2}${prop3 === "per" ? "%" : ""}${prop1 ? prop1?.indexOf("armor_") !== -1 ? ` when one is wearing ${prop1}` : ` when using a ${prop1}` : ``}`
}

function moveMode(text: string, prop1:string|null, prop2:string|null, prop3:string|null ) {
  return `${text} ${prop2?.indexOf("-") !== -1 ? '' : '+'}${prop2}${prop3 === "per" ? "%" : ""}${prop1 ? prop1 === "run" ? ` when running` : prop1 === "stand" ? ` while standing` : prop1 === "walk" ? ` while walking` : ` when sitting` : ``}`
}

function hpmp(text: string, prop1:string|null, prop2:string|null) {
  return `${text} ${prop1?.indexOf("-") !== -1 ? '' : '+'}${prop1} every ${prop2} ${prop2 !== "1" ? 'seconds' : 'second'}`
}


function operateCondReader(deps: {
  operateCond: SkillOperateCond;
  skillName: string;
}) {
  deps.operateCond?.$.map((oc) => {
  operateCondNameMap.set(
      // deps.skillName,
      deps.skillName+"_"+oc.$[0],
      `skillName: ${deps.skillName}, operateCond: ${oc.$[0]}: ${operateCond({operateCondName: oc.$[0], prop1: ocGetParam(oc.$[1])})} ${oc.$[2]}`
    );
  // const m = map.get(deps.skillName)
  // if (m) map.set(deps.skillName, {skillName: deps.skillName, effect: m.effect, operateCond: operateCond({operateCondName: oc.$[0], prop1: ocGetParam(oc.$[1])})})
  })
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
    let toStr = param.$.length === 1 ? param.$.join('') : param.$.join(', ') 
    toStr = toStr.replace(/,(?=[^,]+$)/, ', or')
    
    return toStr;
  } else {
    return `{gouno: ${param}}`;
  }
}

function operateCond(params: {operateCondName: string, prop1:string}) {
  const {operateCondName, prop1} = params
  switch (operateCondName) {
    case "equip_weapon":
      return `Usable when a ${prop1}`
    default: 
      return `${params}`;
  }
}