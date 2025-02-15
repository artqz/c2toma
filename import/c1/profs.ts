import slug from "slug";
import {
  ProfSkillAcquireC1,
  loadSkillAcquireDataC1,
} from "../../datapack/c1/skillacquire";
import { loadSkillAcquireDataC4 } from "../../datapack/c4/skillacquire";
import { loadSkillAcquireDataGF } from "../../datapack/gf/skillacquire";
import { loadItemDataIL } from "../../datapack/il/itemdata";
import { loadSkillAcquireDataIL } from "../../datapack/il/skillacquire";
import { Item, Prof, ProfSkill, Skill } from "../../result/types";
import { Chronicle } from "../types";
import { generateProfsC5 } from "./c5/profs";

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
    case "c5":
      return generateProfsC5(deps);
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
  const skillsByName = new Map(
    Array.from(deps.skills.values()).map((s) => [s.skillName, s])
  );
  const itemsByName = new Map(
    Array.from(deps.items.values()).map((i) => [i.itemName, i])
  );
  const itemsILByName = new Map(loadItemDataIL().map((i) => [i.$[2], i.$[1]]));

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
          itemsByName,
          skills: skillsByName,
          profSkills: prof.$,
          itemsILByName,
        })
      )
      : getSkills({
        ...deps,
        itemsByName,
        skills: skillsByName,
        profSkills: prof.$,
        itemsILByName,
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
  itemsByName: Map<string, Item>;
  itemsILByName: Map<string | number, number>;
}) {
  const skillMap = new Map<string, ProfSkill>();

  for (const pSkill of deps.profSkills) {
    if (typeof pSkill !== "string") {
      const reqLvl = pSkill.get_lv;
      const skill = deps.skills.get(slug(pSkill.skill_name, "_"));
      if (skill) {
        skillMap.set(skill.skillName, {
          skill: skill.id + "_" + skill.level,
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
  items: Map<number, Item>;
  itemsNeeded: { $?: { $: [string, number] }[] };
  itemsByName: Map<string, Item>;
  itemsILByName: Map<string | number, number>;
}) {
  const ret: { itemName: string; count: number }[] = [];

  deps.itemsNeeded.$?.map((itemData: { $: [string, number] }) => {
    if (itemData) {
      const itemName = itemData.$[0];
      const itemCount = itemData.$[1];
      const item = deps.itemsByName.get(itemName.replace(":", "_"));
      if (item) {
        return ret.push({ itemName: item.itemName, count: itemCount });
      } else {
        if (deps.chronicle === "il") {
          const normItemName = checkILitems({
            ...deps,
            itemName: itemName.replace(":", "_"),
          });
          if (normItemName) {
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

function checkILitems(deps: {
  items: Map<number, Item>;
  itemName: string;
  itemsILByName: Map<string | number, number>;
}): string | undefined {
  const itemIdIL = deps.itemsILByName.get(deps.itemName);
  if (itemIdIL) {
    const item = deps.items.get(itemIdIL);
    if (item) {
      return item.itemName;
    }
  }
}
