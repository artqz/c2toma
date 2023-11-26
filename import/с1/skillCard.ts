import { Chronicle } from "./../types";
import { Skill, lstring } from "../../result/types";
import { saveFile } from "../../utils/Fs";

const ECHANT_ONLY = new Set(["c4", "c5", "il", "gf"]);

export function loadSkillCard(deps: {
  chronicle: Chronicle;
  skills: Map<string, Skill>;
}) {
  const cards = new Map<
    string,
    {
      id: number;
      cardName: string;
      name: lstring;
      levels: Record<number, Skill>;
      enchanting: Skill[];
    }
  >();

  for (const skill of deps.skills.values()) {
    if (skill.level === 1) {
      cards.set(skill.id + "_" + skill.level, {
        id: skill.id,
        cardName: getCardName(skill),
        name: getName(skill),
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

function getName(skill: { id: number; name: { en: string; ru: string } }) {
  let name: { en: string; ru: string } = skill.name;
  if (skill.id === 239) {
    name = { en: "Expertise", ru: "Квалификация" };
  }
  return name;
}

function getCardName(skill: { id: number; skillName: string }) {
  let skillName: string = skill.skillName;
  if (skill.id === 239) {
    skillName = "s_expertise";
  }
  skillName;
  return (
    skill.id +
    "-" +
    skillName
      .replace(/[_0-9]+$/, "")
      .replace("s_", "")
      .replace(/_/g, "-")
  );
}

function getLevels(skillId: number, skills: Map<string, Skill>) {
  const map = Array.from(skills.values())
    .filter((s) => s.level != null && s.level < 100)
    .reduce<Map<number, Record<number, Skill>>>((map, skill) => {
      if (!map.has(skill.id)) {
        return map.set(skill.id, { [skill.level!]: skill });
      }
      map.get(skill.id)![skill.level!] = skill;
      return map;
    }, new Map());

  return Object.values(map.get(skillId) ?? []);
}

function getEnchanting(skillId: number, skills: Map<string, Skill>) {
  const skillNyName = new Map(
    Array.from(skills.values()).map((s) => [s.skillName, s])
  );
  const SKILL_ENCHANT_TYPES: (
    | "power"
    | "cost"
    | "chance"
    | "recovery"
    | "time"
  )[] = ["power", "cost", "chance", "recovery", "time"];
  const enchantList: Skill[] = [];

  for (const enchantType of SKILL_ENCHANT_TYPES) {
    for (const skill of Array.from(skills.values()).filter(
      (s) => s.level != null && s.level >= 100
    )) {
      if (skill.skillName.includes(`_${enchantType}_`)) {
        enchantList.push({
          ...skill,
          enchantType: enchantType,
        });
      }
    }
  }

  // const enchanting = enchantList.reduce<
  //   Record<number, Record<string, Skill[]>>
  // >((group, skill) => {
  //   const _skill = skillNyName.get(skill.skillName);
  //   if (_skill) {
  //     group[skill.id] = group[skill.id] ?? {};
  //     group[skill.id][skill.enchantType] =
  //       group[skill.id][skill.enchantType] ?? [];
  //     group[skill.id][skill.enchantType].push(_skill);
  //   }
  //   return group;
  // }, {});

  // const enchantById = new Map(
  //   Object.entries(enchanting).map((v, k) => [
  //     parseInt(v[0]),
  //     Object.keys(v[1]).map((k) => ({ enchantName: k, skills: v[1][k] })),
  //   ])
  // );

  // return enchantById.get(skillId) ?? [];

  return enchantList;
}
