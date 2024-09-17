import { z } from 'zod';
import { Effect } from '../../result/types';

// p_physical_defence
// p_magical_defence
// p_physical_attack
// p_magical_attack
// p_speed
const PerDiff = z.object({ effectName: z.string(), app: z.string().array(), value: z.number(), valueType: z.enum(["per", "diff"]) })
export type PerDiff = z.infer<typeof PerDiff>;

const Effect = z.union([
  PerDiff,
  z.object({ effectName: z.string(), huy: z.number() })
])

export function getEffects(effects: any) {
  const effectMap = new Map<
    string,
    Effect
  >();
  if (effects) {
    for (const effect of effects) {
      const effectName: string = effect.$[0];

      if (effectName === "p_physical_defence") {
        const app: string[] = effect.$[1].$;
        const value: number = effect.$[2];
        const per: boolean = effect.$[3] === "per";
        effectMap.set(effectName, { effectName, app, value, per });
        //  const data = Effect.parse({ effectName, app, value, valueType: effect.$[3] })


        //     if (data instanceof PerDiff) {

        // }

      }

      if (effectName === "p_max_hp" ||
        effectName === "p_max_mp"
      ) {
        const value: number = effect.$[1];
        const per: boolean = effect.$[2] === "per";
        effectMap.set(effectName, { effectName, value, per });
      }

      if (effectName === "p_physical_attack" ||
        effectName === "p_magical_attack" ||
        effectName === "p_magical_defence" ||
        effectName === "p_physical_defence" ||
        effectName === "p_magic_speed" ||
        effectName === "p_attack_speed" ||
        effectName === "p_mp_regen" ||
        effectName === "p_hp_regen" ||
        effectName === "p_speed" ||
        effectName === "p_hit" ||
        effectName === "p_avoid") {
        const app: string[] = effect.$[1].$;
        const value: number = effect.$[2];
        const per: boolean = effect.$[3] === "per";
        effectMap.set(effectName, { effectName, app, value, per });
      }

      if (effectName === "p_resist_dispel_by_category" || effectName === "p_resist_abnormal_by_category") {
        const value: number = effect.$[2];
        const descValue: string = effect.$[1];
        const per: boolean = effect.$[3] === "per";
        effectMap.set(effectName, { effectName, value, descValue, per });
      }

      if (effectName === "i_heal") {
        const value: number[] = [effect.$[1]];
        const descValue = ["power"]
        effectMap.set(effectName, { effectName, value, descValue });
      }

      if (effectName === "i_hp_drain") {
        const value: number[] = [effect.$[1], effect.$[2]];
        const descValue = ["power", "absorb_hp"]
        effectMap.set(effectName, { effectName, value, descValue });
      }


      if (effectName === "i_p_attack") {
        // c4 length = 3
        if (effect.$.length) {
          const value: number[] = [effect.$[1], effect.$[2]];
          const descValue = ["power", "crit_chance"]
          effectMap.set(effectName, { effectName, value, descValue });
        }
        // gf length = 4 & 5
        //
      }

      if (effectName === "i_fatal_blow") {
        const descValue = ["power", "blow_rate", "crit_chance"]
        const value: number[] = [];

        for (let i = 0; i < descValue.length; i++) {
          const v = typeof effect.$[i + 1] === "undefined" ? 0 : effect.$[i + 1];
          value.push(v)
        }

        effectMap.set(effectName, { effectName, value, descValue });
      }

      if (effectName === "i_dispel_by_slot") {
        const descValue = ["abnormal_type", "abnormal_lv"]
        const value: [string, number] = [effect.$[1], effect.$[2]];
        effectMap.set(effectName, { effectName, value, descValue });
      }

      if (effectName === "p_target_me" || effectName === "i_get_agro") {
        effectMap.set(effectName, { effectName });
      }

      // if (effectName === "i_p_attack") {
      //   const app: string[] = effect.$[1].$;
      //   const value: number = effect.$[2];
      //   const per: boolean = effect.$[3] === "per";
      //   effectMap.set(effectName, { effectName, app, value, per });
      // }
    }
  }
  return Array.from(effectMap.values());
}

//   "i_p_attack",
//   "p_speed",
//   "i_fatal_blow",
//   "i_dispel_by_slot",
//   "p_target_me",
//   "i_get_agro",
//   "p_physical_defence",
//   "p_physical_attack",
//   "i_heal",
//   "i_hp_drain",
//   "p_avoid",
//   "p_block_act",
//   "p_defence_attribute",
//   "p_attack_speed_by_weapon",
//   "i_target_cancel",
//   "p_magical_defence",
//   "i_m_attack",
//   "p_defence_trait",
//   "p_attack_range",
//   "p_attack_speed",
//   "p_max_hp",
//   "t_hp",
//   "p_critical_rate",
//   "p_mp_regen",
//   "p_resist_dd_magic",
//   "p_shield_defence_rate",
//   "p_physical_shield_defence",
//   "p_magic_speed",
//   "p_reuse_delay",
//   "p_critical_damage",
//   "p_luck",
//   "p_trigger_skill_by_attack",
//   "p_max_cp",
//   "p_hp_regen",
//   "p_cp_regen",
//   "p_max_mp",
//   "p_hit_number",
//   "p_hate_attack",
//   "c_rest",
//   "p_resist_abnormal_by_category",
//   "p_defence_critical_damage",
//   "p_defence_critical_rate",
//   "p_mp_regen_by_move_mode",
//   "p_remove_equip_penalty",
//   "i_holything_possess",
//   "i_mp_by_level",
//   "p_magical_attack",
//   "p_reduce_cancel",
//   "p_attack_attribute",
//   "i_summon",
//   "i_m_attack_range",
//   "p_block_move",
//   "p_hit",
//   "p_hp_regen_by_move_mode",
//   "p_avoid_by_move_mode",
//   "i_install_camp",
//   "i_randomize_hate",
//   "i_add_hate",
//   "i_unlock",
//   "i_give_contribution",
//   "i_focus_energy",
//   "i_energy_attack",
//   "p_2h_sword_bonus",
//   "p_2h_blunt_bonus",
//   "i_hp_by_level_self",
//   "p_create_item",
//   "p_safe_fall_height",
//   "p_physical_attack_by_hp1",
//   "p_breath",
//   "p_crystallize",
//   "p_magic_speed_by_weapon",
//   "p_mp_vampiric_attack",
//   "c_mp",
//   "i_resurrection",
//   "i_delete_hate",
//   "p_fear",
//   "p_block_controll",
//   "i_m_attack_mp",
//   "t_mp",
//   "i_confuse",
//   "i_consume_body",
//   "i_mp",
//   "i_cp",
//   "i_sweeper",
//   "i_mp_by_level_self",
//   "i_spoil",
//   "p_resist_dispel_by_category",
//   "p_avoid_skill",
//   "c_mp_by_level",
//   "i_summon_cubic",
//   "i_delete_hate_of_me",
//   "i_backstab",
//   "i_death",
//   "c_fake_death",
//   "p_avoid_agro",
//   "p_attack_trait",
//   "p_damage_shield",
//   "p_passive",
//   "p_cubic_mastery",
//   "p_weight_limit",
//   "i_hp_per_max",
//   "c_hp",
//   "i_escape",
//   "i_dispel_by_category",
//   "p_block_spell",
//   "i_death_link",
//   "i_distrust",
//   "p_pvp_magical_skill_dmg_bonus",
//   "i_register_siege_golem",
//   "p_weight_penalty",
//   "p_mana_charge",
//   "p_transfer_damage_summon",
//   "p_physical_defence_by_hp1",
//   "p_critical_rate_by_hp2",
//   "p_critical_rate_by_hp1",
//   "p_physical_attack_by_hp2",
//   "i_m_attack_over_hit",
//   "p_vampiric_attack",
//   "p_hit_at_night",
//   "p_area_damage",
//   "p_heal_effect",
//   "c_chameleon_rest",
//   "p_pvp_physical_attack_dmg_bonus",
//   "p_pvp_physical_skill_dmg_bonus",
//   "i_physical_attack_hp_link",
//   "p_physical_shield_defence_angle_all",
//   "p_physical_polarm_target_single",
//   "p_physical_armor_hit",
//   "p_magic_critical_rate",
//   "i_align_direction",
//   "i_restoration_random",
//   "i_fishing_cast",
//   "i_fishing_pumping",
//   "i_fishing_reeling",
//   "p_fishing_mastery",
//   "p_create_common_item",
//   "i_open_dwarf_recipebook",
//   "i_open_common_recipebook",
//   "p_preserve_abnormal",
//   "i_install_camp_ex",
//   "i_restoration",
//   "p_reduce_drop_penalty",
//   "p_limit_cp",
//   "p_limit_hp",
//   "p_skill_critical",
//   "p_enlarge_storage",
//   "p_skill_critical_probability",
//   "p_magic_mp_cost",
//   "p_reflect_skill",
//   "i_rebalance_hp",
//   "p_block_skill_physical",
//   "p_fatal_blow_rate",
//   "p_critical_damage_position",
//   "p_critical_rate_position_bonus",
//   "p_block_getdamage",
//   "p_block_buff",
//   "p_block_debuff",
//   "i_dispel_by_slot_probability",
//   "p_magic_critical_dmg",
//   "p_block_buff_slot",
//   "i_target_me",
//   "p_channel_clan",
//   "i_run_away",
//   "p_betray",
//   "i_betray",
//   "i_npc_kill",
//   "i_call_pc",
//   "p_enlarge_abnormal_slot",
//   "p_resurrection_special",
//   "p_counter_skill",
//   "p_trigger_skill_by_dmg",
//   "i_skill_turning",
//   "i_call_party",
//   "i_dispel_by_slot_myself",
//   "i_summon_npc",
//   "p_soul_eating",
//   "i_m_soul_attack",
//   "i_detect_trap",
//   "i_defuse_trap",
//   "i_p_soul_attack",
//   "p_disarm",
//   "i_transfer_hate",
//   "i_focus_soul",
//   "i_soul_blow",
//   "i_m_attack_by_abnormal",
//   "i_steal_abnormal",
//   "i_summon_trap",
//   "p_transfer_damage_pc",
//   "p_block_attack",
//   "p_transform",
//   "i_convert_item",
//   "i_blink",
//   "i_mp_per_max",
//   "p_avoid_rate_by_hp1",
//   "p_limit_mp",
//   "p_trigger_skill_by_avoid",
//   "i_teleport_to_target",
//   "i_install_advance_base",
//   "i_uninstall_advance_base",
//   "i_capture_ownthing",
//   "p_stat_up",
//   "p_dominion_transform",
//   "p_reflect_dd",
//   "p_skill_power",
//   "i_focus_max_energy",
//   "p_hide",
//   "p_magical_attack_add",
//   "p_mp_regen_add",
//   "p_heal_effect_add",
//   "i_my_summon_kill",
//   "i_collecting",
//   "p_max_mp_add",
//   "p_cheapshot",
//   "p_trigger_skill_by_skill",
//   "i_enchant_weapon",
//   "i_enchant_armor",
//   "i_hp",
//   "i_soul_shot",
//   "i_summon_pet",
//   "i_spirit_shot",
//   "i_food_for_pet",
//   "i_sowing",
//   "i_harvesting",
//   "i_change_face",
//   "i_change_hair_color",
//   "i_change_hair_style",
//   "i_sp",
//   "i_fishing_shot",
//   "i_summon_soul_shot",
//   "i_summon_spirit_shot",
//   "i_teleport",
//   "p_change_fishing_mastery",
//   "i_change_skill_level",
//   "i_enchant_attribute",
//   "i_detect_object",
//   "i_set_skill",
//   "i_remove_soul",
//   "i_enchant_weapon_rate",
//   "i_enchant_armor_rate",
//   "p_recovery_vp",
//   "i_vp_up",
//   "i_bookmark_add_slot",
//   "i_bookmark_teleport",
//   "i_add_max_entrance_inzone",
//   "i_refuel_airship",
//   "i_pcbang_point_up",
//   "i_real_damage",
//   "p_set_collected",
//   "i_hp_self",
//   "p_avoid_rate_by_hp2",
//   "p_attack_speed_by_hp2",
//   "i_pledge_send_system_message",
//   "i_unsummon_agathion",
//   "i_summon_agathion",
//   "i_capture_flag",
//   "p_expand_deco_slot",
//   "p_set_cloak_slot",
//   "i_mount_for_event",
//   "i_dismount_for_event",
//   "p_pvp_magical_skill_defence_bonus",
//   "p_pvp_physical_skill_defence_bonus",
//   "p_pvp_physical_attack_defence_bonus",
//   "i_event_agathion_reuse_delay",
//   "p_abnormal_rate_limit",
//   "cub_m_attack",
//   "cub_hp_drain",
//   "cub_heal",
//   "cub_hp",
//   "cub_physical_attack",
//   "cub_physical_defence",
//   "cub_attack_speed",
//   "t_hp_fatal",
//   "i_dispel_all",
//   "i_fly_away",
//   "i_m_attack_by_dist",
//   "cub_block_act",
//   "p_block_skill_special",
//   "i_fly_self",
//   "i_p_attack_by_dist",
//   "p_pk_protect",
//   "i_m_attack_by_range",
//   "p_transform_hangover",
//   "p_magic_defence_critical_dmg",
//   "p_block_resurrection",
//   "i_despawn",
//   "p_block_chat",
//   "p_block_party",
//   "p_violet_boy",
//   "i_abnormal_time_change",
//   "p_exp_modify",
//   "p_sp_modify",
//   "p_crystal_grade_modify"

function generateEffect(effectName: string, effect: any, descValue: string[]) {
  const value: number[] = [];

  for (let i = 0; i < descValue.length; i++) {
    const v = typeof effect.$[i + 1] === "undefined" ? 0 : effect.$[i + 1];
    value.push(v)
  }

  return { effectName, value, descValue }
}