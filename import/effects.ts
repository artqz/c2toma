import { SkillEnffect, loadSkillDataC4 } from '../datapack/c4/skilldata';
import { Skill } from '../result/types';
import { saveFile } from '../utils/Fs';
const effectNameMap = new Map()

export function loadEffects (deps: {
  skills: Map<string, Skill>
}) {
  const skillC4ByName = new Map(loadSkillDataC4().map(s => [s.skill_name, s]))
  for (const skill of deps.skills.values()) {
    const skillC4 = skillC4ByName.get(skill.skillName)
    if (skillC4) {
      effectReader({effect: skillC4.effect, skillName: skill.skillName})
    }
  }
  //delete
  saveFile("result/data/effects.json", JSON.stringify(Array.from(effectNameMap.values()), null, 2))
  //
  
  return deps.skills
}
  

export function effectReader(deps: {
  effect: SkillEnffect;
  skillName: string;
}) {
  deps.effect.$?.map((e) => {
    switch (e.$[0]) {
      case "i_p_attack_over_hit":
        // console.log(`Power: ${e.$[1]}`);
        break;
      case "p_speed":
        // console.log(`Movement Speed: ${getParam(e.$[1])}`);
        break;
      default:
        break;
    }
    effectNameMap.set(
      // deps.skillName,
      e.$[0],
      `skillName: ${deps.skillName}, effect: ${e.$[0]}: ${effect({effectName: e.$[0], prop1: getParam(e.$[1]), prop2: getParam(e.$[2]), prop3: getParam(e.$[3])})} (${govno(e.$[0])}) ${getParam(e.$[1])} ${e.$[2]} ${e.$[3]} ${e.$[4]}`
    );
  });

  return [];
}

function govno(param: string) {
  const split = param.split("_");
  const prefix = split[0];
  const postfix = split[split.length - 1];
  // if (prefix === "i") {
  //   return "i";
  // }
  // if (prefix === "p") {
  //   return "p";
  // }
  // if (prefix === "t") {
  //   return "t";
  // }
  // if (prefix === "c") {
  //   return "c";
  // }
  // //cub
  // else {
  return prefix+"_"+postfix;
  //   return "cub";
  // }
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
    return `{govno: ${param}}`;
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
    case "p_physical_defence":
      return chetko(`P. Def`, prop1, prop2, prop3)
    case "p_avoid":
      return chetko(`Evasion`, prop1, prop2, prop3)
    default: 
      return params;
  }
}

function chetko(text: string, prop1:string|null, prop2:string|null, prop3:string|null ) {
  return `${prop2?.indexOf("-") !== -1 ? 'Reduces' : 'Increases'} ${text}${prop1 ? prop1 : ''} by ${prop2}${prop3 === "per" ? "%" : ""}`
}