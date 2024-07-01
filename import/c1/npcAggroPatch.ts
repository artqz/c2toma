import { Ai, Npc, Skill } from "../../result/types";

export function generateAgroPatch(deps: {
  npcs: Map<number, Npc>;
  ais: Map<string, Ai>;
  skills: Map<string, Skill>;
}) {
  const arr: {
    id: number;
    level: number;
    aggr: boolean | undefined;
    skills: string[];
  }[] = [];

  for (const npc of deps.npcs.values()) {
    const ai = deps.ais.get(npc.ai);
    if (ai) {
      arr.push({
        id: npc.id,
        level: npc.level ?? 1,
        aggr: isNpcAiAggressive(ai.name),
        skills: getSkills({ ...deps, npcSkills: npc.skillList }),
      });
    }
  }
  return arr;
}

export function isNpcAiAggressive(ai: string) {
  if (
    ai.startsWith("warrior_pa_") ||
    ai.startsWith("warrior_passive") ||
    ai.startsWith("wizard_pa_")
  ) {
    return false;
  } else if (
    ai.startsWith("party_leader_ag_") ||
    ai.startsWith("warrior_ag_") ||
    ai.startsWith("warrior_aggressive") ||
    ai.startsWith("wizard_ag_")
  ) {
    return true;
  }
  switch (ai) {
    case "party_private":
    case "warrior_flee":
      return false;
    case "party_leader_aggressive":
      return true;
  }
}

function getSkills(deps: { skills: Map<string, Skill>; npcSkills: string[] }) {
  const arr: string[] = [];
  for (const nSkill of deps.npcSkills) {
    const skill = deps.skills.get(nSkill);
    if (skill) {
      if (skill.operateType === "A1") {
        arr.push(getNewSkillName(skill.skillName));
      }
    }
  }
  return arr;
}

function getNewSkillName(name: string) {
  if (name.toLowerCase().includes("blood_sucking")) {
    return "HPDrain";
  }
  if (name.toLowerCase().includes("mega_storm_strike")) {
    return "Windstrike";
  }
  if (name.toLowerCase().includes("aura_burn")) {
    return "AuraBurn";
  }
  if (name.toLowerCase().includes("blaze")) {
    return "Blaze";
  }
  return name;
}
