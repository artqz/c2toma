import { Chronicle } from "./../types";
import { Skill, lstring } from "../../result/types";
import { saveFile } from "../../utils/Fs";

const ECHANT_ONLY = new Set(["c4", "c5", "il", "ct1", "gf"]);
const SKILL_ENCHANT_TYPES = ["power", "cost", "chance", "recovery", "time"];
const ENCHANT_CHANCE: Record<string, number[]> = {
  "76": [
    82, 80, 78, 40, 30, 20, 14, 10, 6, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    0, 0, 0, 0, 0, 0, 0,
  ],
  "77": [
    92, 90, 88, 82, 80, 78, 40, 30, 20, 14, 10, 6, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 0, 0, 0, 0,
  ],
  "78": [
    97, 95, 93, 92, 90, 88, 82, 80, 78, 40, 30, 20, 14, 10, 6, 2, 2, 2, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 0,
  ],
  "79": [
    99, 99, 99, 97, 95, 93, 92, 90, 88, 82, 80, 78, 40, 30, 20, 14, 10, 6, 2, 2,
    2, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  ],
  "80": [
    100, 100, 100, 99, 99, 99, 97, 95, 93, 92, 90, 88, 82, 80, 78, 40, 30, 20,
    14, 10, 6, 2, 2, 2, 1, 1, 1, 1, 1, 1,
  ],
};

type Enchant = {
  type: string;
  level: number;
  chance: number[][];
  skill: Skill;
};
export function loadSkillCard(deps: {
  chronicle: Chronicle;
  skills: Map<string, Skill>;
}) {
  const cards = new Map<
    string,
    {
      id: number;
      cardName: string;
      icon: string;
      name: lstring;
      operateType: string | null;
      levels: Record<number, Skill>;
      enchanting: Enchant[];
    }
  >();

  for (const skill of deps.skills.values()) {
    if (skill.level === 1) {
      cards.set(skill.id + "_" + skill.level, {
        id: skill.id,
        cardName: getCardName(skill),
        icon: skill.icon,
        name: getName(skill),
        operateType: skill.operateType,
        levels: getLevels(skill.id, deps.skills),
        enchanting: ECHANT_ONLY.has(deps.chronicle)
          ? getEnchanting(skill.id, deps.skills, deps.chronicle)
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

function getEnchanting(
  skillId: number,
  skills: Map<string, Skill>,
  chronicle: Chronicle
) {
  const enchantList: Enchant[] = [];

  for (const enchantType of SKILL_ENCHANT_TYPES) {
    for (const skill of Array.from(skills.values()).filter(
      (s) => s.level != null && s.level >= 100 && s.id === skillId
    )) {
      if (skill.skillName.includes(`_${enchantType}_`)) {
        const level = getEnchantLevel(skill.level ?? 1, chronicle);
        enchantList.push({
          level,
          chance: getEnchantChance(level, chronicle),
          type: enchantType,
          skill,
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

function getEnchantLevel(level: number, chronicle: Chronicle) {
  if (chronicle === "gf") {
    return level < 200
      ? level - 100
      : level < 300
      ? level - 200
      : level < 400
      ? level - 300
      : level < 500
      ? level - 400
      : level < 600
      ? level - 500
      : level < 700
      ? level - 600
      : level < 800
      ? level - 700
      : level - 800;
  } else {
    return level < 140 ? level - 100 : level - 140;
  }
}

function getEnchantChance(level: number, chronicle: Chronicle) {
  const charLevels: number[] = [];
  switch (chronicle) {
    case "c4":
      charLevels.push(76, 77, 78);
      break;
    case "c5":
    case "il":
    case "gf":
      charLevels.push(76, 77, 78, 79, 80);
      break;
  }
  const chance: number[][] = [];
  for (const cLevel of charLevels) {
    chance.push([cLevel, ENCHANT_CHANCE[cLevel][level - 1]]);
  }
  return chance;
}
