import {
  ProfSkillAcquireC1,
  loadSkillAcquireDataC1,
} from "../../datapack/c1/skillacquire";
import { loadSkillAcquireDataC4 } from "../../datapack/c4/skillacquire";
import { loadSkillAcquireDataGF } from "../../datapack/gf/skillacquire";
import { loadItemDataIL } from '../../datapack/il/itemdata';
import { loadSkillAcquireDataIL } from "../../datapack/il/skillacquire";
import { Item, Prof, ProfSkill, Skill } from "../../result/types";
import { Chronicle } from "../types";

export function loadProfs(deps: {
  chronicle: Chronicle;
  items: Map<number, Item>;
  skills: Map<string, Skill>;
}) {
  let profs = loadSkillAcquireData(deps);
  profs = skillsLevelFilter({ profs });
  console.log("Profs loaded.");

  return profs;
}

function loadSkillAcquireData(deps: {
  chronicle: Chronicle;
  items: Map<number, Item>;
  skills: Map<string, Skill>;
}) {
  let profData = [];
  switch (deps.chronicle) {
    case "c1":
      profData = loadSkillAcquireDataC1();
      break;
    case "c4":
      profData = loadSkillAcquireDataC4();
      break;
    case "il":
      profData = loadSkillAcquireDataIL();
      break;
    case "gf":
      profData = loadSkillAcquireDataGF();
      break;
    default:
      profData = loadSkillAcquireDataC1();
      break;
  }

  const profMap = new Map<string, Prof>();

  for (const prof of profData.filter((x) => !notClass.includes(x.t))) {
    let parentProf: Prof | null = null;

    if (typeof prof.$[0] === "string") {
      const parentName = prof.$[0].replace("include_", "");
      const parent = profMap.get(parentName);

      if (parent) {
        parentProf = parent;
      }
    }

    const skills = parentProf
      ? parentProf.skills.concat(
          getSkills({
            ...deps,
            profSkills: prof.$,
          })
        )
      : getSkills({
          ...deps,
          profSkills: prof.$,
        });

    profMap.set(prof.t, {
      profName: prof.t,
      skills,
      parent: parentProf?.profName ?? null,
    });
  }
  return profMap;
}

function getSkills(deps: {
  chronicle: Chronicle;
  items: Map<number, Item>;
  skills: Map<string, Skill>;
  profSkills: ProfSkillAcquireC1;
}) {
  const skillMap = new Map<string, ProfSkill>();
  const skillsByName = new Map(
    Array.from(deps.skills.values()).map((s) => [s.skillName, s])
  );

  for (const pSkill of deps.profSkills) {
    if (typeof pSkill !== "string") {
      const reqLvl = pSkill.get_lv;

      const skill = skillsByName.get(pSkill.skill_name);
      if (skill) {
        skillMap.set(skill.skillName, {
          skillName: pSkill.skill_name,
          skillLevel: pSkill.get_lv,
          autoGet: pSkill.auto_get === "true",
          getLv: pSkill.get_lv,
          lvUpSp: pSkill.lv_up_sp,
          hp: skill.hp_consume,
          mp: skill.mp_consume1 + skill.mp_consume2,
          isMagic: true,
          itemNeeded: getItems({ ...deps, itemsNeeded: pSkill.item_needed }),
          operateType: skill.operateType ?? "",
          range: skill.castRange,
        });
      }
    }
  }
  return Array.from(skillMap.values());
}

function skillsLevelFilter(deps: { profs: Map<string, Prof> }) {
  const ranks: [number, number][] = [
    [0, 19],
    [20, 39],
    [40, 75],
    [76, 84],
  ];

  return new Map(
    Array.from(deps.profs.values()).map((prof) => [
      prof.profName,
      {
        ...prof,
        skills: prof.skills.filter(
          (skill) =>
            skill.getLv >= ranks[profRank.get(prof.profName)!][0] &&
            skill.getLv <= ranks[profRank.get(prof.profName)!][1]
        ),
      },
    ])
  );
}

function getItems(deps: {
  chronicle: Chronicle;
  itemsNeeded: { $?: { $: [string, number] }[] };
  items: Map<number, Item>;
}) {
  const ret: { itemName: string; count: number }[] = [];
  const itemsByName = new Map(
    Array.from(deps.items.values()).map((i) => [i.itemName, i])
  );
  deps.itemsNeeded.$?.map((itemData: { $: [string, number] }) => {
    if (itemData) {
      const itemName = itemData.$[0];
      const itemCount = itemData.$[1];
      const item = itemsByName.get(itemName.replace(":", "_"));
      if (item) {
        return ret.push({ itemName: item.itemName, count: itemCount });
      } else {
        if (deps.chronicle === "il") {
          const normItemName = checkILitems({...deps, itemName: itemName.replace(":", "_")})
          if(normItemName) {
            return ret.push({ itemName: normItemName, count: itemCount });
          }
        } else {
        console.log("нет такого говна: " + itemName);
        }
      }
    } else {
      return [];
    }
  });
  return ret;
}

const notClass = [
  "fishing",
  "pledge",
  "sub_pledge",
  "transform",
  "subjob",
  "collect",
];

const profRank = new Map([
  ["fighter", 0],
  ["warrior", 1],
  ["gladiator", 2],
  ["duelist", 3],
  ["warlord", 2],
  ["dreadnought", 3],
  ["knight", 1],
  ["paladin", 2],
  ["phoenix_knight", 3],
  ["dark_avenger", 2],
  ["hell_knight", 3],
  ["rogue", 1],
  ["treasure_hunter", 2],
  ["adventurer", 3],
  ["hawkeye", 2],
  ["sagittarius", 3],
  ["mage", 0],
  ["wizard", 1],
  ["sorcerer", 2],
  ["archmage", 3],
  ["necromancer", 2],
  ["soultaker", 3],
  ["warlock", 2],
  ["arcana_lord", 3],
  ["cleric", 1],
  ["bishop", 2],
  ["cardinal", 3],
  ["prophet", 2],
  ["hierophant", 3],
  ["elven_fighter", 0],
  ["elven_knight", 1],
  ["temple_knight", 2],
  ["evas_templar", 3],
  ["swordsinger", 2],
  ["sword_muse", 3],
  ["elven_scout", 1],
  ["plain_walker", 2],
  ["wind_rider", 3],
  ["silver_ranger", 2],
  ["moonlight_sentinel", 3],
  ["elven_mage", 0],
  ["elven_wizard", 1],
  ["spellsinger", 2],
  ["mystic_muse", 3],
  ["elemental_summoner", 2],
  ["elemental_master", 3],
  ["oracle", 1],
  ["elder", 2],
  ["evas_saint", 3],
  ["dark_fighter", 0],
  ["palus_knight", 1],
  ["shillien_knight", 2],
  ["shillien_templar", 3],
  ["bladedancer", 2],
  ["spectral_dancer", 3],
  ["assasin", 1],
  ["abyss_walker", 2],
  ["ghost_hunter", 3],
  ["phantom_ranger", 2],
  ["ghost_sentinel", 3],
  ["dark_mage", 0],
  ["dark_wizard", 1],
  ["spellhowler", 2],
  ["storm_screamer", 3],
  ["phantom_summoner", 2],
  ["spectral_master", 3],
  ["shillien_oracle", 1],
  ["shillien_elder", 2],
  ["shillien_saint", 3],
  ["orc_fighter", 0],
  ["orc_raider", 1],
  ["destroyer", 2],
  ["titan", 3],
  ["orc_monk", 1],
  ["tyrant", 2],
  ["grand_khavatari", 3],
  ["orc_mage", 0],
  ["orc_shaman", 1],
  ["overlord", 2],
  ["dominator", 3],
  ["warcryer", 2],
  ["doomcryer", 3],
  ["dwarven_fighter", 0],
  ["scavenger", 1],
  ["bounty_hunter", 2],
  ["fortune_seeker", 3],
  ["artisan", 1],
  ["warsmith", 2],
  ["maestro", 3],
  ["kamael_m_soldier", 0],
  ["trooper", 1],
  ["berserker", 2],
  ["doombringer", 3],
  ["m_soul_breaker", 2],
  ["m_soul_hound", 3],
  ["kamael_f_soldier", 0],
  ["warder", 1],
  ["arbalester", 2],
  ["trickster", 3],
  ["f_soul_breaker", 2],
  ["f_soul_hound", 3],
  ["inspector", 2],
  ["judicator", 3],
]);

const t = new Map ([
["sb_divine_inspiration_modern_language_version", "sb_increase_of_divinity_b"],
["sb_divine_inspiration_original_language_version", "sb_increase_of_divinity_a"],
["sb_divine_inspiration_manuscript", "sb_increase_of_divinity_s"],
["sb_divine_inspiration_original_version", "sb_increase_of_divinity_hero"],
["sb_symbol_of_honor", "sb_symbol_of_fist1"],
["sb_symbol_of_energy", "sb_symbol_of_energy1"],
["spellbook_soul_of_the_phoenix1", "sb_soul_of_pnoenix1"],
["sb_symbol_of_defense", "sb_symbol_of_guardian1"],
["sb_symbol_of_the_assassin", "sb_symbol_of_assassin1"],
["sb_symbol_of_the_sniper", "sb_symbol_of_sniper1"],
["spellbook_summon_attractive_cubic1", "sb_summon_attract_cubic1"],
["sb_symbol_of_noise", "sb_symbol_of_noise1"],
["sb_symbol_of_resistance", "sb_symbol_of_resistance1"],
["blueprint_summon_swoop_cannon1", "sb_summon_swoop_cannon1"],
["spellbook_aura_flash1", "sb_aura_flash1"],
["sb_volcano", "sb_volcano1"],
["sb_magic_curse_fear1", "sb_mass_curse_fear"],
["sb_magic_curse_gloom1", "sb_mass_curse_gloom"],
["sb_summon_cursed_bones1", "sb_summon_cursed_bone"],
["sb_day_of_doom", "sb_day_of_doom1"],
["sb_gehenna", "sb_gehenna1"],
["sb_betray1", "sb_betray"],
["sb_surrender_to_fire_mass1", "sb_mass_surrender_to_fire"],
["sb_arcane_disruption1", "sb_arcane_disruption"],
["spellbook_summon_feline_king1", "sb_summon_king_of_cat1"],
["sb_anti_summoning_field", "sb_anti_summon_field1"],
["spellbook_invocation1", "sb_invocation1"],
// нет такого говна: sb_erase1
// нет такого говна: sb_trans1
// нет такого говна: sb_magic_backfire1
// нет такого говна: sb_mana_burn1
// нет такого говна: sb_mana_storm1
// нет такого говна: sb_turn_undead1
// нет такого говна: sb_major_heal1
// нет такого говна: sb_major_group_heal1
// нет такого говна: spellbook_celestial_shield1
// нет такого говна: spellbook_cleanse1
// нет такого говна: spellbook_salvation1
// нет такого говна: sb_purification_field
// нет такого говна: sb_miracle
// нет такого говна: sb_erase1
// нет такого говна: sb_great_might1
// нет такого говна: sb_great_shield1
// нет такого говна: sb_holy_resist1
// нет такого говна: sb_unholy_resist1

// нет такого говна: spellbook_mystic_immunity1
// нет такого говна: spellbook_spell_turning1

// нет такого говна: sb_raging_waves

// нет такого говна: sb_surrender_to_water_mass1
// нет такого говна: spellbook_summon_magnus_the_unicorn1


// нет такого говна: sb_erase1
// нет такого говна: sb_unholy_resist1
// нет такого говна: sb_trans1
// нет такого говна: sb_clarity1

// нет такого говна: sb_turn_undead1
// нет такого говна: sb_major_heal1
// нет такого говна: sb_mass_recharge




// нет такого говна: sb_cyclone

// нет такого говна: sb_surrender_to_wind_mass1
// нет такого говна: spellbook_summon_spectral_knight1


// нет такого говна: sb_erase1
// нет такого говна: sb_holy_resist1

// нет такого говна: sb_mass_recharge




// нет такого говна: amulet_pa_agrio_s_emblem1
// нет такого говна: amulet_victories_of_pa_agrio1
// нет такого говна: amulet_pa_agrio_s_fist1
// нет такого говна: sb_flames_of_invincibility
// нет такого говна: sb_war_chant1
// нет такого говна: sb_earth_chant1
// нет такого говна: amulet_gate_chant1
// нет такого говна: amulet_magnus_chant1
])

function checkILitems(deps: {items: Map<number, Item>; itemName: string}): string | undefined {
  const itemsILByName = new Map (loadItemDataIL().map(i => [i.$[2], i.$[1]]))

  const itemIdIL = itemsILByName.get(deps.itemName)
  if (itemIdIL) {
    const item = deps.items.get(itemIdIL)
    if (item) {
      return item.itemName
    }
  }
}