import {
  ProfSkillAcquireC1,
  loadSkillAcquireDataC1,
} from "../../datapack/c1/skillacquire";
import { Item, Prof, ProfSkill, Skill } from "../../result/types";
import { Chronicle } from "../types";

export function loadProfs(deps: {
  chronicle: Chronicle;
  items: Map<number, Item>;
  skills: Map<string, Skill>;
}) {
  let profs = loadSkillAcquireData(deps);

  console.log("Sets loaded.");

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
    default:
      profData = loadSkillAcquireDataC1();
      break;
  }

  const profMap = new Map<string, Prof>();

  for (const prof of profData.filter((x) => !notClass.includes(x.t))) {
    let parentProf: { profName: string; skills: string[] } | null = null;

    if (typeof prof.$[0] === "string") {
      const parentName = prof.$[0].replace("include_", "");
      const parent = profMap.get(parentName);
      if (parent) {
        // parentProf = parent;
      }
    }

    profMap.set(prof.t, {
      profName: prof.t,
      skills: getSkills({ ...deps, profSkills: prof.$ }),
      parent: parentProf,
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

function getItems(deps: {
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
      const item = itemsByName.get(itemName);
      if (item) {
        return ret.push({ itemName: item.itemName, count: itemCount });
      } else {
        console.log("нет такого говна: " + itemName);
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
