import { Npc, NpcBuff, Skill } from "../../result/types";
import { Chronicle } from "../types";

export function loadNpcBuffs(deps: {
  chronicle: Chronicle;
  npcs: Map<number, Npc>;
  skills: Map<string, Skill>;
}) {
  loadNpcBuffsData(deps);
  console.log("NPCs buffs loaded.");
}

function loadNpcBuffsData(deps: {
  chronicle: Chronicle;
  npcs: Map<number, Npc>;
  skills: Map<string, Skill>;
}) {
  switch (deps.chronicle) {
    case "c3":
    case "c4":
    case "c5":
    case "il":
    case "gf":
      return load({ ...deps });
  }
}

function load(deps: {
  chronicle: Chronicle;
  npcs: Map<number, Npc>;
  skills: Map<string, Skill>;
}) {
  const buffList: NpcBuff[] = [];
  const skillByName = new Map(
    Array.from(deps.skills.values()).map((s) => [s.skillName, s])
  );
  const npcByName = new Map(
    Array.from(deps.npcs.values()).map((n) => [n.npcName, n])
  );

  for (const buff of BUFF_LIST) {
    const skill = skillByName.get(buff.skill);
    if (skill) {
      buffList.push({
        skill: skill.id + "_" + skill.level,
        minLevel: buff.minLvl,
        maxLevel: buff.maxLvl,
        group: buff.group as any,
      });
    } else {
      "Нет такого баффа " + buff.skill;
    }
  }

  for (const buffer of NPCS.values()) {
    const npc = npcByName.get(buffer);
    if (npc) {
      npc.buffList = buffList;
    } else {
      "Нет такого баффера " + buffer;
    }
  }
}
const BUFF_LIST = [
  { skill: "s_wind_walk_for_newbie", minLvl: 8, maxLvl: 24, group: "fighter" },
  { skill: "s_shield_for_newbie", minLvl: 11, maxLvl: 23, group: "fighter" },
  {
    skill: "s_vampiric_rage_for_newbie",
    minLvl: 13,
    maxLvl: 21,
    group: "fighter",
  },
  {
    skill: "s_regeneration_for_newbie",
    minLvl: 14,
    maxLvl: 20,
    group: "fighter",
  },
  { skill: "s_haste_for_newbie", minLvl: 15, maxLvl: 19, group: "fighter" },
  {
    skill: "s_life_cubic_for_newbie",
    minLvl: 16,
    maxLvl: 19,
    group: "fighter",
  },
  { skill: "s_wind_walk_for_newbie", minLvl: 8, maxLvl: 24, group: "mage" },
  { skill: "s_shield_for_newbie", minLvl: 11, maxLvl: 23, group: "mage" },
  {
    skill: "s_bless_the_soul_for_newbie",
    minLvl: 12,
    maxLvl: 22,
    group: "mage",
  },
  { skill: "s_acumen_for_newbie", minLvl: 13, maxLvl: 21, group: "mage" },
  {
    skill: "s_concentration_for_newbie",
    minLvl: 14,
    maxLvl: 20,
    group: "mage",
  },
  { skill: "s_empower_for_newbie", minLvl: 15, maxLvl: 19, group: "mage" },
  { skill: "s_life_cubic_for_newbie", minLvl: 16, maxLvl: 19, group: "mage" },
];

const NPCS = new Set([
  "guide_human_cnacelot",
  "guide_elf_roios",
  "guide_delf_frankia",
  "guide_dwarf_gullin",
  "guide_orc_tanai",
  "guide_gludin_nina",
  "guide_gludio_euria",
]);
