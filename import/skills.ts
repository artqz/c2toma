import { number, string } from "zod";
import { loadSkillGrpC2 } from "../datapack/c2/skillgrp";
import { loadSkillNamesC2 } from "../datapack/c2/skillnames";
import { SkillEnffect, loadSkillDataC4 } from "../datapack/c4/skilldata";
import { loadSkillGrpC4 } from "../datapack/c4/skillgrp";
import { loadSkillNamesC4 } from "../datapack/c4/skillnames";
import { loadSkillNamesGF } from "../datapack/gf/skillnames";
import { Skill } from "../result/types";

export function loadSkills() {
  let skills: Map<string, Skill>;
  skills = loadC4Skills();
  skills = loadC2Icons(skills);
  skills = loadC4Icons(skills);
  skills = loadC4Names(skills);
  console.log("Skills loaded.");

  return skills;
}

function loadC4Skills() {
  const skillnamesC2 = new Map(
    loadSkillNamesC2().map((skill) => [
      skill.skill_id + "_" + skill.skill_level,
      skill,
    ])
  );

  const skillsC4 = new Map(
    loadSkillDataC4().map((skill) => [
      skill.skill_id + "_" + skill.level,
      skill,
    ])
  );
  const skills = new Map<string, Skill>();
  // for (const skillC2 of Array.from(skillnamesC2.values())) {
  const effectNameMap = new Map<string, string>();
  for (const skillC4 of Array.from(skillsC4.values())) {
    // const skillC4 = skillsC4.get(skillC2.skill_id + "_" + skillC2.skill_level);
    const skillC2 = skillnamesC2.get(skillC4.skill_id + "_" + skillC4.level);
    // if (skillC4) {
    skills.set(skillC4.skill_id + "_" + skillC4.level, {
      id: skillC4.skill_id,
      skillName: skillC4.skill_name.replace(" ", "_"),
      name: { en: skillC2?.name.trim() ?? "", ru: "" },
      desc: { en: skillC2?.desc?.trim() ?? "", ru: "" },
      level: skillC4.level,
      icon: "",
      operateType: skillC4.operate_type,
      effect: effectReader({ map: effectNameMap, effect: skillC4.effect }),
      effectTime: skillC4.abnormal_time,
      effectType:
        skillC4.debuff === undefined
          ? undefined
          : skillC4.debuff
          ? "debuff"
          : skillC4.skill_name.search("song_") > 0 ||
            skillC4.skill_name.search("dance_") > 0
          ? "song"
          : "buff",
    });
  }
  console.log(effectNameMap);

  return skills;
}

function loadC2Icons(skills: Map<string, Skill>) {
  const skillGrp = new Map(
    loadSkillGrpC2().map((skill) => [
      skill.skill_id + "_" + skill.skill_level,
      skill,
    ])
  );
  const skillsNew = new Map<string, Skill>();

  for (const skill of Array.from(skills.values())) {
    const grp = skillGrp.get(skill.id + "_" + skill.level);

    skillsNew.set(skill.id + "_" + skill.level, {
      ...skill,
      icon: grp?.icon.replace("icon.", "") ?? "",
    });
  }
  return skillsNew;
}

function loadC4Icons(skills: Map<string, Skill>) {
  const skillGrp = new Map(
    loadSkillGrpC4().map((skill) => [skill.id + "_" + skill.level, skill])
  );
  const skillsNew = new Map<string, Skill>();

  for (const skill of Array.from(skills.values())) {
    const grp = skillGrp.get(skill.id + "_" + skill.level);
    if (grp) {
      const icon = !skill.icon ? grp.icon.replace("icon.", "") : skill.icon;
      skillsNew.set(skill.id + "_" + skill.level, {
        ...skill,
        icon: icon ?? "",
      });
    }
  }
  return skillsNew;
}

function loadC4Names(skills: Map<string, Skill>) {
  const skillNames = new Map(
    loadSkillNamesC4().map((skill) => [skill.id + "_" + skill.level, skill])
  );
  const skillByNameGF = new Map(
    loadSkillNamesGF().map((skill) => [skill.id + "_" + skill.level, skill])
  );
  const skillsNew = new Map<string, Skill>();

  for (const skill of Array.from(skills.values())) {
    const sName = skillNames.get(skill.id + "_" + skill.level);
    if (sName) {
      const name = !skill.name.en ? sName.name : skill.name.en;
      const desc = !skill.desc.en ? sName.desc : skill.desc.en;

      const gfName = skillByNameGF.get(skill.id + "_" + skill.level);
      if (gfName) {
        skillsNew.set(skill.id + "_" + skill.level, {
          ...skill,
          name: { en: name.trim() ?? "", ru: gfName.name.ru.trim() },
          desc: { en: desc.trim() ?? "", ru: desc.trim() ?? "" },
        });
      }
    }
  }
  return skillsNew;
}

function effectReader(deps: {
  map: Map<string, string>;
  effect: SkillEnffect;
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
    deps.map.set(
      govno(e.$[0]),
      `${govno(e.$[0])} ${getParam(e.$[1])} ${e.$[2]} ${e.$[3]} ${e.$[4]}`
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
    return `object: ${toStr}`;
  } else {
    return `{govno: ${param}}`;
  }
}


function generateDesc(params: {type: string, prop1:string|number, prop2: string|number, prop3: string|number, prop4: string|number }) {
const {type, prop1, prop2, prop3, prop4} = params

switch (type) {
  case 'i_hit': 
  return `Power ${prop1}`;
  case 'p_speed':
  return `Moving speed + ${prop1}`
  case 'blow':
  case 'slot':
  case 'heal':
  case 'drain':
  case 'attack':
  case 'defence':
  case 'avoid':
  case 'act':
  case 'weapon':
  case 'attribute':
  case 'range':
  case 'hp':
  case 'max':
  case 'rate':
  case 'delay':
  case 'regen':
  case 'damage':
  case 'luck':
  case 'cp':
  case 'mp':
  case 'number':
  case 'rest':
  case 'penalty':
  case 'possess':
  case 'level':
  case 'cancel':
  case 'summon':
  case 'move':
  case 'mode':
  case 'camp':
  case 'hate':
  case 'unlock':
  case 'contribution':
  case 'energy':
  case 'item':
  case 'height':
  case 'breath':
  case 'crystallize':
  case 'resurrection':
  case 'away':
  case 'confuse':
  case 'body':
  case 'self':
  case 'sweeper':
  case 'spoil':
  case 'cubic':
  case 'me':
  case 'backstab':
  case 'death':
  case 'agro':
  case 'shield':
  case 'passive':
  case 'mastery':
  case 'limit': 
  case 'escape': 
  case 'category': 
  case 'spell': 
  case 'link' :
  case 'distrust': 
  case 'bonus' :
  case 'golem' :
  case 'charge':
  case 'hp1' :
  case 'hp2' :
  case 'night': 
  case 'effect': 
  case 'power' :
  case 'all' :
  case 'single': 
  case 'random' :
  case 'cast' :
  case 'pumping' :
  case 'reeling' :
  case 'recipebook':
  case 'abnormal' :
  case 'ex' :
  case 'restoration' :
  case 'critical' :
  case 'storage':
  case 'probability':
  case 'cost':
  case 'skill':
  case 'physical':
  case 'position':
  case 'direction':
  case 'getdamage':
  case 'buff':
  case 'debuff':
  case 'npc':
  case 'armor':
  case 'shot':
  case 'pet':
  case 'sowing':
  case 'harvesting':
  case 'face':
  case 'color':
  case 'style':
  case 'sp':
  default: 
  break
}
}

// 'i_hit' => 'i_hit 0 0 undefined undefined',
//   'p_speed' => 'p_speed [object Object] 50 per undefined',
//   'i_blow' => 'i_blow 33780 670 0 undefined',
//   'i_slot' => 'i_slot big_body 1 undefined undefined',
//   'i_heal' => 'i_heal 5421 undefined undefined undefined',
//   'i_drain' => 'i_drain 65 100 undefined undefined',
//   'p_attack' => 'p_attack [object Object] 50 per undefined',
//   'p_defence' => 'p_defence [object Object] 30 per undefined',
//   'p_avoid' => 'p_avoid [object Object] 10 diff undefined',
//   'p_act' => 'p_act undefined undefined undefined undefined',
//   'p_weapon' => 'p_weapon [object Object] 12 per undefined',
//   'i_attack' => 'i_attack 95790 0 undefined undefined',
//   'p_attribute' => 'p_attribute attr_valakas 8 undefined undefined',
//   'p_range' => 'p_range [object Object] 400 diff undefined',
//   'p_hp' => 'p_hp 30 per undefined undefined',
//   'i_max' => 'i_max 14 undefined undefined undefined',
//   't_hp' => 't_hp 388 1 undefined undefined',
//   'p_rate' => 'p_rate 30 per undefined undefined',
//   'p_delay' => 'p_delay 1 -35 per undefined',
//   'p_regen' => 'p_regen [object Object] 35 per undefined',
//   'p_damage' => 'p_damage 25 per undefined undefined',
//   'p_luck' => 'p_luck undefined undefined undefined undefined',
//   'p_cp' => 'p_cp 50 per undefined undefined',
//   'p_mp' => 'p_mp 35 per undefined undefined',
//   'p_number' => 'p_number 4 diff undefined undefined',
//   'c_rest' => 'c_rest -2 5 undefined undefined',
//   'p_penalty' => 'p_penalty 9000 undefined undefined undefined',
//   'i_possess' => 'i_possess undefined undefined undefined undefined',
//   'i_level' => 'i_level 155 undefined undefined undefined',
//   'p_cancel' => 'p_cancel -25 per undefined undefined',
//   'i_summon' => 'i_summon cursed_man_ep_30 85 crystal_c 4',
//   'p_move' => 'p_move undefined undefined undefined undefined',
//   'p_hit' => 'p_hit [object Object] 3 diff undefined',
//   'p_mode' => 'p_mode stand 4.9 diff undefined',
//   'i_camp' => 'i_camp undefined undefined undefined undefined',
//   'i_hate' => 'i_hate 100 undefined undefined undefined',
//   'i_unlock' => 'i_unlock 100 100 100 undefined',
//   'i_contribution' => 'i_contribution 10 undefined undefined undefined',
//   'i_energy' => 'i_energy 2 undefined undefined undefined',
//   'p_item' => 'p_item 9 undefined undefined undefined',
//   'p_height' => 'p_height 100 diff undefined undefined',
//   'p_breath' => 'p_breath 200 diff undefined undefined',
//   'p_crystallize' => 'p_crystallize s undefined undefined undefined',
//   'c_mp' => 'c_mp -10 5 undefined undefined',
//   'i_resurrection' => 'i_resurrection 200 undefined undefined undefined',
//   'i_away' => 'i_away undefined undefined undefined undefined',
//   't_mp' => 't_mp 372.2 5 undefined undefined',
//   'i_confuse' => 'i_confuse 20 20 undefined undefined',
//   'i_body' => 'i_body undefined undefined undefined undefined',
//   'i_self' => 'i_self -17.46 undefined undefined undefined',
//   'i_mp' => 'i_mp 5 per undefined undefined',
//   'i_sweeper' => 'i_sweeper undefined undefined undefined undefined',
//   'i_spoil' => 'i_spoil undefined undefined undefined undefined',
//   'c_level' => 'c_level -0.5 5 undefined undefined',
//   'i_cubic' => 'i_cubic 20 undefined undefined undefined',
//   'i_me' => 'i_me undefined undefined undefined undefined',
//   'i_backstab' => 'i_backstab 5479 300 0 undefined',
//   'c_death' => 'c_death -10 5 undefined undefined',
//   'p_agro' => 'p_agro 100 undefined undefined undefined',
//   'p_shield' => 'p_shield 20 undefined undefined undefined',
//   'p_passive' => 'p_passive undefined undefined undefined undefined',
//   'p_mastery' => 'p_mastery 5 undefined undefined undefined',
//   'p_limit' => 'p_limit 25 per undefined undefined',
//   'c_hp' => 'c_hp -50 5 undefined undefined',
//   'i_escape' => 'i_escape castle undefined undefined undefined',
//   'i_category' => 'i_category slot_debuff 100 undefined undefined',
//   'p_spell' => 'p_spell undefined undefined undefined undefined',
//   'i_link' => 'i_link 65 undefined undefined undefined',
//   'i_distrust' => 'i_distrust 20 20 undefined undefined',
//   'p_bonus' => 'p_bonus back 100 per undefined',
//   'i_golem' => 'i_golem undefined undefined undefined undefined',
//   'p_charge' => 'p_charge 81 undefined undefined undefined',
//   'p_summon' => 'p_summon 50 undefined undefined undefined',
//   'p_hp1' => 'p_hp1 215.75 diff undefined undefined',
//   'p_hp2' => 'p_hp2 13 diff undefined undefined',
//   'p_night' => 'p_night 3 diff undefined undefined',
//   'p_effect' => 'p_effect -100 per undefined undefined',
//   'i_power' => 'i_power undefined undefined undefined undefined',
//   'p_all' => 'p_all undefined undefined undefined undefined',
//   'p_single' => 'p_single undefined undefined undefined undefined',
//   'i_cp' => 'i_cp 5000 diff undefined undefined',
//   'i_random' => 'i_random [object Object] undefined undefined undefined',
//   'i_cast' => 'i_cast undefined undefined undefined undefined',
//   'i_pumping' => 'i_pumping 5 undefined undefined undefined',
//   'i_reeling' => 'i_reeling 5 undefined undefined undefined',
//   'i_recipebook' => 'i_recipebook undefined undefined undefined undefined',
//   'p_abnormal' => 'p_abnormal undefined undefined undefined undefined',
//   'i_ex' => 'i_ex undefined undefined undefined undefined',
//   'i_restoration' => 'i_restoration blessed_spiritshot_s 1000 undefined undefined',
//   'p_critical' => 'p_critical int undefined undefined undefined',
//   'p_storage' => 'p_storage inventory_normal 8 undefined undefined',
//   'p_probability' => 'p_probability 1000 per undefined undefined',
//   'p_cost' => 'p_cost 1 -16 per undefined',
//   'p_skill' => 'p_skill 1 10 undefined undefined',
//   'p_category' => 'p_category slot_debuff -20 per undefined',
//   'i_death' => 'i_death 6 undefined undefined undefined',
//   'i_cancel' => 'i_cancel undefined undefined undefined undefined',
//   'i_hp' => 'i_hp 781 diff undefined undefined',
//   'p_physical' => 'p_physical undefined undefined undefined undefined',
//   'p_position' => 'p_position back 20 per undefined',
//   'i_direction' => 'i_direction undefined undefined undefined undefined',
//   'p_getdamage' => 'p_getdamage block_mp undefined undefined undefined',
//   'p_buff' => 'p_buff undefined undefined undefined undefined',
//   'p_debuff' => 'p_debuff undefined undefined undefined undefined',
//   'i_probability' => 'i_probability silence 100 undefined undefined',
//   'i_npc' => 'i_npc x_mas_tree_b 1 undefined undefined',
//   'i_weapon' => 'i_weapon undefined undefined undefined undefined',
//   'i_armor' => 'i_armor undefined undefined undefined undefined',
//   'i_shot' => 'i_shot 300 40 2.4 undefined',
//   'i_pet' => 'i_pet 0 0 450 undefined',
//   'i_sowing' => 'i_sowing undefined undefined undefined undefined',
//   'i_harvesting' => 'i_harvesting undefined undefined undefined undefined',
//   'i_face' => 'i_face 2 undefined undefined undefined',
//   'i_color' => 'i_color 3 undefined undefined undefined',
//   'i_style' => 'i_style 6 undefined undefined undefined',
//   'i_sp' => 'i_sp 100000 diff undefined undefined',
//   'i_teleport' => 'i_teleport 83378 147999 -3400 undefined',
//   'p_collected' => 'p_collected undefined undefined undefined undefined',
//   'cub_attack' => 'cub_attack -23 per undefined undefined',
//   'cub_drain' => 'cub_drain 53 40 undefined undefined',
//   'cub_heal' => 'cub_heal 68 undefined undefined undefined',
//   'cub_hp' => 'cub_hp -118 1 undefined undefined',
//   'cub_defence' => 'cub_defence -23 per undefined undefined',
//   'cub_speed' => 'cub_speed -23 per undefined undefined',
//   't_fatal' => 't_fatal -20 5 undefined undefined',
//   'i_all' => 'i_all undefined undefined undefined undefined',
//   'p_fear' => 'p_fear undefined undefined undefined undefined',
//   'p_controll' => 'p_controll undefined undefined undefined undefined',
//   'i_position' => 'i_position undefined undefined undefined undefined',
//   'i_dist' => 'i_dist 379 undefined undefined undefined',
//   'cub_act' => 'cub_act undefined undefined undefined undefined'