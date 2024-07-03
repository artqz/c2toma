import { loadNpcAggrC4 } from "../../datapack/c4/npcnames";
import { Ai, Npc, Skill } from "../../result/types";

export function generateAgroPatch(deps: {
  npcs: Map<number, Npc>;
  ais: Map<string, Ai>;
  skills: Map<string, Skill>;
}) {
  const arr: {
    id: number;
    nameNpc: string;
    title: string;
    level: number;
    ai: string;
    type: "aggressive" | "night" | "passive";
    skills: string[];
  }[] = [];

  for (const npc of deps.npcs.values()) {
    // const ai = deps.ais.get(npc.ai);
    // if (ai) {
    arr.push({
      id: npc.id,
      nameNpc: npc.npcName,
      title: npc.nick.en,
      level: npc.level ?? 1,
      ai: npc.ai,
      type: "passive",
      skills: getSkills({ ...deps, npcSkills: npc.skillList }),
    });
    // }
  }

  for (const npc of arr) {
    function applyAi(ai: string) {
      const data = deps.ais.get(ai);

      if (data) {
        applyAi(data.super);
      }

      const agro = isNpcAiAggressive(ai);
      if (agro != null) {
        npc.type = agro;
      }
    }
    applyAi(npc.ai);
  }

  for (const npc of arr) {
    if (npc.nameNpc.includes("_bat") || npc.nameNpc.includes("bat_")) {
      npc.type = "night";
    }
  }

  return arr.map((n) => {
    return {
      id: n.id,
      type: n.type,
      title: `${n.level} ${n.title} ${n.skills.join(" ")}`.trim(),
    };
  });
}

export function isNpcAiAggressive(
  ai: string
): "aggressive" | "night" | "passive" {
  console.log(ai);

  if (
    ai.startsWith("warrior_pa_") ||
    ai.startsWith("warrior_passive") ||
    ai.startsWith("wizard_pa_")
  ) {
    return "passive";
  } else if (
    ai.startsWith("party_leader_ag_") ||
    ai.startsWith("warrior_ag_") ||
    ai.startsWith("warrior_aggressive") ||
    ai.startsWith("wizard_ag_")
  ) {
    return "aggressive";
  }
  switch (ai) {
    case "party_private":
    case "warrior_flee":
      return "passive";
    case "party_leader_aggressive":
      return "aggressive";
    default:
      return "passive";
  }
}

function getSkills(deps: { skills: Map<string, Skill>; npcSkills: string[] }) {
  const set = new Set<string>();
  for (const nSkill of deps.npcSkills) {
    const skill = deps.skills.get(nSkill);
    if (skill) {
      if (skill.operateType === "A1" || skill.operateType === "A2") {
        const newNameForSkill = getNewSkillName(skill.skillName);
        newNameForSkill && set.add(newNameForSkill);
      }
      if (skill.operateType === "P") {
        const hpSkill = hpSkillsOld.get(skill.id);
        hpSkill && set.add(hpSkill);
      }
    }
  }
  return Array.from(set.values());
}
///'DrainHP',   'Slow',       'DrainMP',    'Poison',
// 'Sleep',      'Root',      'Blow',       'Shackle',    'MassStun',
// 'Stun',       'Ol',        'Mahum',      'Lord',       'Cancel',
// 'Silence',    'x1/2',      'Bleed',      'Paralyze',   'MassParalyze',
// 'Mass',
function getNewSkillName(name: string) {
  if (name.toLowerCase().includes("blood_sucking")) {
    return "DrainHP";
  }
  // if (name.toLowerCase().includes("mega_storm_strike")) {
  //   // return "Windstrike";
  //   return;
  // }
  // if (name.toLowerCase().includes("aura_burn")) {
  //   // return "AuraBurn";
  //   return;
  // }
  // if (name.toLowerCase().includes("blaze")) {
  //   // return "Blaze";
  //   return;
  // }
  if (name.toLowerCase().includes("mana_sucking")) {
    return "DrainMP";
  }
  if (name.toLowerCase().includes("npc_slow")) {
    return "Slow";
  }
  if (name.toLowerCase().includes("_poison")) {
    return "Poison";
  }
  if (name.toLowerCase().includes("_sleep")) {
    return "Sleep";
  }
  if (name.toLowerCase().includes("_hold")) {
    return "Root";
  }
  if (name.toLowerCase().includes("_blow")) {
    return "Blow";
  }
  if (name.toLowerCase().includes("_shackle")) {
    return "Shackle";
  }
  if (
    name.toLowerCase().includes("spirit_ogre") ||
    name.toLowerCase().includes("spirit_puma") ||
    name.toLowerCase().includes("thunder_storm")
  ) {
    return "MassStun";
  }
  if (name.toLowerCase().includes("stun_attack")) {
    return "Stun";
  }
  if (name.toLowerCase().includes("cancel")) {
    return "Cancel";
  }
  if (name.toLowerCase().includes("silence")) {
    return "Silence";
  }
  if (name.toLowerCase().includes("bleed")) {
    return "Bleed";
  }
  if (name.toLowerCase().includes("range_paralyze")) {
    return "MassParalyze";
  }
  if (name.toLowerCase().includes("paralyze")) {
    return "Paralyze";
  }
  // return name;
}

const hpSkillsOld = new Map([
  [4303, "x2"],
  [4304, "x3"],
  [4305, "x4"],
  [4306, "x5"],
  [4307, "x6"],
  [4309, "x7"],
  [4309, "x8"],
  [4310, "x9"],
  [4311, "x1/2"],
]);
