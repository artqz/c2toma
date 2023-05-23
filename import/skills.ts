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
      `${govno(e.$[0])} ${e.$[1]} ${e.$[2]} ${e.$[3]} ${e.$[4]}`
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
  return postfix;
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
    return `string: ${param}`;
  }
  if (typeof param === "number") {
    return `number: ${param}`;
  }
  if (typeof param === "object") {
    return `object: ${JSON.stringify(param.$)}`;
  } else {
    return `govno: ${param}`;
  }
}

// {
//   'i_p_attack_over_hit' => 'i_p_attack_over_hit',
//   'p_speed' => 'p_speed',
//   'i_fatal_blow' => 'i_fatal_blow',
//   'i_dispel_by_slot' => 'i_dispel_by_slot',
//   'i_heal' => 'i_heal',
//   'i_hp_drain' => 'i_hp_drain',
//   'p_physical_attack' => 'p_physical_attack',
//   'p_physical_defence' => 'p_physical_defence',
//   'p_avoid' => 'p_avoid',
//   'p_block_act' => 'p_block_act',
//   'p_attack_speed_by_weapon' => 'p_attack_speed_by_weapon',
//   'i_m_attack' => 'i_m_attack',
//   'p_defence_attribute' => 'p_defence_attribute',
//   'p_attack_range' => 'p_attack_range',
//   'p_attack_speed' => 'p_attack_speed',
//   'p_max_hp' => 'p_max_hp',
//   'i_hp_per_max' => 'i_hp_per_max',
//   't_hp' => 't_hp',
//   'p_critical_rate' => 'p_critical_rate',
//   'p_magical_defence' => 'p_magical_defence',
//   'p_shield_defence_rate' => 'p_shield_defence_rate',
//   'p_magic_speed' => 'p_magic_speed',
//   'p_reuse_delay' => 'p_reuse_delay',
//   'p_mp_regen' => 'p_mp_regen',
//   'p_critical_damage' => 'p_critical_damage',
//   'p_luck' => 'p_luck',
//   'p_max_cp' => 'p_max_cp',
//   'p_hp_regen' => 'p_hp_regen',
//   'p_max_mp' => 'p_max_mp',
//   'p_hit_number' => 'p_hit_number',
//   'c_rest' => 'c_rest',
//   'p_remove_equip_penalty' => 'p_remove_equip_penalty',
//   'i_holything_possess' => 'i_holything_possess',
//   'i_mp_by_level' => 'i_mp_by_level',
//   'p_magical_attack' => 'p_magical_attack',
//   'p_reduce_cancel' => 'p_reduce_cancel',
//   'i_summon' => 'i_summon',
//   'p_block_move' => 'p_block_move',
//   'p_hit' => 'p_hit',
//   'p_hp_regen_by_move_mode' => 'p_hp_regen_by_move_mode',
//   'p_mp_regen_by_move_mode' => 'p_mp_regen_by_move_mode',
//   'p_avoid_by_move_mode' => 'p_avoid_by_move_mode',
//   'p_attack_attribute' => 'p_attack_attribute',
//   'i_install_camp' => 'i_install_camp',
//   'i_randomize_hate' => 'i_randomize_hate',
//   'i_add_hate' => 'i_add_hate',
//   'i_unlock' => 'i_unlock',
//   'i_give_contribution' => 'i_give_contribution',
//   'i_focus_energy' => 'i_focus_energy',
//   'i_energy_attack' => 'i_energy_attack',
//   'p_create_item' => 'p_create_item',
//   'p_safe_fall_height' => 'p_safe_fall_height',
//   'p_breath' => 'p_breath',
//   'p_crystallize' => 'p_crystallize',
//   'c_mp' => 'c_mp',
//   'i_resurrection' => 'i_resurrection',
//   'i_delete_hate' => 'i_delete_hate',
//   'i_run_away' => 'i_run_away',
//   't_mp' => 't_mp',
//   'i_confuse' => 'i_confuse',
//   'i_consume_body' => 'i_consume_body',
//   'i_hp_by_level_self' => 'i_hp_by_level_self',
//   'i_mp' => 'i_mp',
//   'i_sweeper' => 'i_sweeper',
//   'i_mp_by_level_self' => 'i_mp_by_level_self',
//   'i_spoil' => 'i_spoil',
//   'c_mp_by_level' => 'c_mp_by_level',
//   'i_summon_dd_cubic' => 'i_summon_dd_cubic',
//   'i_delete_hate_of_me' => 'i_delete_hate_of_me',
//   'i_summon_drain_cubic' => 'i_summon_drain_cubic',
//   'i_backstab' => 'i_backstab',
//   'i_summon_debuff_cubic' => 'i_summon_debuff_cubic',
//   'c_fake_death' => 'c_fake_death',
//   'p_avoid_agro' => 'p_avoid_agro',
//   'i_summon_heal_cubic' => 'i_summon_heal_cubic',
//   'i_p_attack' => 'i_p_attack',
//   'p_damage_shield' => 'p_damage_shield',
//   'p_passive' => 'p_passive',
//   'p_cubic_mastery' => 'p_cubic_mastery',
//   'p_weight_limit' => 'p_weight_limit',
//   'c_hp' => 'c_hp',
//   'i_summon_poison_cubic' => 'i_summon_poison_cubic',
//   'i_escape' => 'i_escape',
//   'i_dispel_by_category' => 'i_dispel_by_category',
//   'p_block_spell' => 'p_block_spell',
//   'i_death_link' => 'i_death_link',
//   'i_distrust' => 'i_distrust',
//   'p_pvp_magical_skill_dmg_bonus' => 'p_pvp_magical_skill_dmg_bonus',
//   'i_register_siege_golem' => 'i_register_siege_golem',
//   'p_weight_penalty' => 'p_weight_penalty',
//   'p_mana_charge' => 'p_mana_charge',
//   'p_transfer_damage_summon' => 'p_transfer_damage_summon',
//   'p_physical_attack_by_hp1' => 'p_physical_attack_by_hp1',
//   'p_physical_defence_by_hp1' => 'p_physical_defence_by_hp1',
//   'p_physical_attack_by_hp2' => 'p_physical_attack_by_hp2',
//   'p_critical_rate_by_hp2' => 'p_critical_rate_by_hp2',
//   'p_2h_sword_bonus' => 'p_2h_sword_bonus',
//   'p_2h_blunt_bonus' => 'p_2h_blunt_bonus',
//   'i_m_attack_over_hit' => 'i_m_attack_over_hit',
//   'p_vampiric_attack' => 'p_vampiric_attack',
//   'p_hit_at_night' => 'p_hit_at_night',
//   'p_area_damage' => 'p_area_damage',
//   'p_heal_effect' => 'p_heal_effect',
//   'c_chameleon_rest' => 'c_chameleon_rest',
//   'i_summon_paralyze_cubic' => 'i_summon_paralyze_cubic',
//   'i_summon_water_dot_cubic' => 'i_summon_water_dot_cubic',
//   'i_summon_shock_cubic' => 'i_summon_shock_cubic',
//   'i_transmit_m_power' => 'i_transmit_m_power',
//   'i_remove_m_power' => 'i_remove_m_power',
//   'i_physical_attack_hp_link' => 'i_physical_attack_hp_link',
//   'p_physical_shield_defence_angle_all' => 'p_physical_shield_defence_angle_all',
//   'p_physical_polarm_target_single' => 'p_physical_polarm_target_single',
//   'p_physical_shield_defence' => 'p_physical_shield_defence',
//   'p_physical_armor_hit' => 'p_physical_armor_hit',
//   'p_magic_critical_rate' => 'p_magic_critical_rate',
//   'i_cp' => 'i_cp',
//   'i_restoration_random' => 'i_restoration_random',
//   'i_fishing_cast' => 'i_fishing_cast',
//   'i_fishing_pumping' => 'i_fishing_pumping',
//   'i_fishing_reeling' => 'i_fishing_reeling',
//   'p_fishing_mastery' => 'p_fishing_mastery',
//   'p_create_common_item' => 'p_create_common_item',
//   'i_open_dwarf_recipebook' => 'i_open_dwarf_recipebook',
//   'i_open_common_recipebook' => 'i_open_common_recipebook',
//   'p_preserve_abnormal' => 'p_preserve_abnormal',
//   'i_install_camp_ex' => 'i_install_camp_ex',
//   'i_restoration' => 'i_restoration',
//   'p_reduce_drop_penalty' => 'p_reduce_drop_penalty',
//   'p_skill_critical' => 'p_skill_critical',
//   'p_enlarge_storage' => 'p_enlarge_storage',
//   'p_skill_critical_probability' => 'p_skill_critical_probability',
//   'p_magic_mp_cost' => 'p_magic_mp_cost',
//   'p_reflect_skill' => 'p_reflect_skill',
//   'p_resist_dispel_by_category' => 'p_resist_dispel_by_category',
//   'p_resist_abnormal_by_category' => 'p_resist_abnormal_by_category',
//   'i_death' => 'i_death',
//   'i_target_cancel' => 'i_target_cancel',
//   'i_rebalance_hp' => 'i_rebalance_hp',
//   'p_block_skill_physical' => 'p_block_skill_physical',
//   'p_fatal_blow_rate' => 'p_fatal_blow_rate',
//   'p_critical_damage_position' => 'p_critical_damage_position',
//   'p_critical_rate_position_bonus' => 'p_critical_rate_position_bonus',
//   'i_align_direction' => 'i_align_direction',
//   'p_block_getdamage' => 'p_block_getdamage',
//   'p_block_buff' => 'p_block_buff',
//   'p_block_debuff' => 'p_block_debuff',
//   'i_dispel_by_slot_probability' => 'i_dispel_by_slot_probability',
//   'i_target_me' => 'i_target_me',
//   'i_summon_npc' => 'i_summon_npc',
//   'i_enchant_weapon' => 'i_enchant_weapon',
//   'i_enchant_armor' => 'i_enchant_armor',
//   'i_hp' => 'i_hp',
//   'i_soul_shot' => 'i_soul_shot',
//   'i_summon_pet' => 'i_summon_pet',
//   'i_spirit_shot' => 'i_spirit_shot',
//   'i_food_for_pet' => 'i_food_for_pet',
//   'i_sowing' => 'i_sowing',
//   'i_harvesting' => 'i_harvesting',
//   'i_change_face' => 'i_change_face',
//   'i_change_hair_color' => 'i_change_hair_color',
//   'i_change_hair_style' => 'i_change_hair_style',
//   'i_mp_per_max' => 'i_mp_per_max',
//   'i_sp' => 'i_sp',
//   'i_fishing_shot' => 'i_fishing_shot',
//   'i_summon_soul_shot' => 'i_summon_soul_shot',
//   'i_summon_spirit_shot' => 'i_summon_spirit_shot',
//   'i_teleport' => 'i_teleport',
//   'p_set_collected' => 'p_set_collected',
//   'p_pvp_physical_attack_dmg_bonus' => 'p_pvp_physical_attack_dmg_bonus',
//   'i_hp_self' => 'i_hp_self',
//   'p_avoid_rate_by_hp2' => 'p_avoid_rate_by_hp2',
//   'p_attack_speed_by_hp2' => 'p_attack_speed_by_hp2',
//   'p_pvp_physical_skill_dmg_bonus' => 'p_pvp_physical_skill_dmg_bonus',
//   'p_abnormal_rate_limit' => 'p_abnormal_rate_limit',
//   'cub_m_attack' => 'cub_m_attack',
//   'cub_hp_drain' => 'cub_hp_drain',
//   'cub_heal' => 'cub_heal',
//   'cub_hp' => 'cub_hp',
//   'cub_physical_attack' => 'cub_physical_attack',
//   'cub_physical_defence' => 'cub_physical_defence',
//   'cub_attack_speed' => 'cub_attack_speed',
//   't_hp_fatal' => 't_hp_fatal',
//   'i_dispel_all' => 'i_dispel_all',
//   'i_fly_away' => 'i_fly_away',
//   'p_fear' => 'p_fear',
//   'p_block_controll' => 'p_block_controll',
//   'i_save_position' => 'i_save_position',
//   'i_m_attack_by_dist' => 'i_m_attack_by_dist',
//   'cub_block_act' => 'cub_block_act'
// }

// 'hit'
//   'speed'
//   'blow'
//   'slot'
//   'heal'
//   'drain'
//   'attack'
//   'defence'
//   'avoid'
//   'act'
//   'weapon'
//   'attribute'
//   'range'
//   'hp'
//   'max'
//   'rate'
//   'delay'
//   'regen'
//   'damage'
//   'luck'
//   'cp'
//   'mp'
//   'number'
//   'rest'
//   'penalty'
//   'possess'
//   'level'
//   'cancel'
//   'summon'
//   'move'
//   'mode'
//   'camp'
//   'hate'
//   'unlock'
//   'contribution'
//   'energy'
//   'item'
//   'height'
//   'breath'
//   'crystallize'
//   'resurrection'
//   'away'
//   'confuse'
//   'body'
//   'self'
//   'sweeper'
//   'spoil'
//   'cubic'
//   'me'
//   'backstab'
//   'death' => 'death 6 undefined undefined undefined',
//   'agro' => 'agro 100 undefined undefined undefined',
//   'shield' => 'shield 20 undefined undefined undefined',
//   'passive' => 'passive undefined undefined undefined undefined',
//   'mastery' => 'mastery 5 undefined undefined undefined',
//   'limit' => 'limit 25 per undefined undefined',
//   'escape' => 'escape castle undefined undefined undefined',
//   'category' => 'category slot_debuff 100 undefined undefined',
//   'spell' => 'spell undefined undefined undefined undefined',
//   'link' => 'link 65 undefined undefined undefined',
//   'distrust' => 'distrust 20 20 undefined undefined',
//   'bonus' => 'bonus back 100 per undefined',
//   'golem' => 'golem undefined undefined undefined undefined',
//   'charge' => 'charge 81 undefined undefined undefined',
//   'hp1' => 'hp1 215.75 diff undefined undefined',
//   'hp2' => 'hp2 13 diff undefined undefined',
//   'night' => 'night 3 diff undefined undefined',
//   'effect' => 'effect -100 per undefined undefined',
//   'power' => 'power undefined undefined undefined undefined',
//   'all' => 'all undefined undefined undefined undefined',
//   'single' => 'single undefined undefined undefined undefined',
//   'random' => 'random [object Object] undefined undefined undefined',
//   'cast' => 'cast undefined undefined undefined undefined',
//   'pumping' => 'pumping 5 undefined undefined undefined',
//   'reeling' => 'reeling 5 undefined undefined undefined',
//   'recipebook' => 'recipebook undefined undefined undefined undefined',
//   'abnormal' => 'abnormal undefined undefined undefined undefined',
//   'ex' => 'ex undefined undefined undefined undefined',
//   'restoration' => 'restoration blessed_spiritshot_s 1000 undefined undefined',
//   'critical' => 'critical int undefined undefined undefined',
//   'storage'
//   'probability'
//   'cost'
//   'skill'
//   'physical'
//   'position'
//   'direction'
//   'getdamage'
//   'buff'
//   'debuff'
//   'npc'
//   'armor'
//   'shot'
//   'pet'
//   'sowing'
//   'harvesting'
//   'face'
//   'color'
//   'style'
//   'sp'
