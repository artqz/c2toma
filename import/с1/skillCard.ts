import { Chronicle } from "./../types";
import { Skill, lstring } from "../../result/types";
import { saveFile } from "../../utils/Fs";

const ECHANT_ONLY = new Set(["c4", "c5", "il", "gf"]);

export function loadSkillCard(deps: {
  chronicle: Chronicle;
  skills: Map<string, Skill>;
}) {
  const cards = new Map<
    number,
    {
      id: number;
      cardName: string;
      name: lstring;
      levels: Skill[];
      enchanting: { enchantName: string; skills: Skill[] }[];
    }
  >();

  for (const skill of deps.skills.values()) {
    if (skill.id === 239) {
      skill.skillName = "s_expertise";
      skill.name = { en: "Expertise", ru: "Квалификация" };
    }
    if (skill.level === 1) {
      cards.set(skill.id, {
        id: skill.id,
        cardName: getCardName(skill),
        name: skill.name,
        levels: getLevels(skill.id, deps.skills),
        enchanting: ECHANT_ONLY.has(deps.chronicle)
          ? getEnchanting(skill.id, deps.skills)
          : [],
      });
    }
  }

  saveFile(
    `result/data/skills.json`,
    JSON.stringify(Array.from(cards.values()), null, 2)
  );

  return cards;
}

function getCardName(skill: { id: number; skillName: string }) {
  return (
    skill.id +
    "-" +
    skill.skillName
      .replace(/[_0-9]+$/, "")
      .replace("s_", "")
      .replace(/_/g, "-")
  );
}

function getLevels(skillId: number, skills: Map<string, Skill>) {
  const map = Array.from(skills.values())
    .filter((s) => s.level != null && s.level < 100)
    .reduce<Map<number, Skill[]>>((map, skill) => {
      if (!map.has(skill.id)) {
        return map.set(skill.id, [skill]);
      }
      map.get(skill.id)?.push(skill);
      return map;
    }, new Map());

  return map.get(skillId) ?? [];
}

function getEnchanting(skillId: number, skills: Map<string, Skill>) {
  const skillNyName = new Map(
    Array.from(skills.values()).map((s) => [s.skillName, s])
  );
  const SKILL_ENCHANT_TYPES = ["power", "cost", "chance", "recovery", "time"];
  const enchantList: { id: number; enchantType: string; skillName: string }[] =
    [];

  for (const enchantType of SKILL_ENCHANT_TYPES) {
    for (const skill of Array.from(skills.values()).filter(
      (s) => s.level != null && s.level >= 100
    )) {
      if (skill.skillName.includes(`_${enchantType}_`)) {
        enchantList.push({
          id: skill.id,
          enchantType: enchantType,
          skillName: skill.skillName,
        });
      }
    }
  }

  const enchanting = enchantList.reduce<
    Record<number, Record<string, Skill[]>>
  >((group, skill) => {
    const _skill = skillNyName.get(skill.skillName);
    if (_skill) {
      group[skill.id] = group[skill.id] ?? {};
      group[skill.id][skill.enchantType] =
        group[skill.id][skill.enchantType] ?? [];
      group[skill.id][skill.enchantType].push(_skill);
    }
    return group;
  }, {});

  const enchantById = new Map(
    Object.entries(enchanting).map((v, k) => [
      parseInt(v[0]),
      Object.keys(v[1]).map((k) => ({ enchantName: k, skills: v[1][k] })),
    ])
  );

  return enchantById.get(skillId) ?? [];
}
