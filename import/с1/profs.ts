import { loadSkillAcquireDataC1 } from "../../datapack/c1/skillacquire";
import { Item, Skill } from "../../result/types";
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

  const profMap = new Map<string, string>();

  for (const prof of profData.filter((x) => !notClass.includes(x.t))) {
    let parentProf: { profName: string; skills: string[] } | null = null;

    if (typeof prof.$[0] === "string") {
      const parentName = prof.$[0].replace("include_", "");
      const parent = profMap.get(parentName);
      if (parent) {
        // parentProf = parent;
      }
      console.log(parentName);
    }
  }
  return [];
}

const notClass = [
  "fishing",
  "pledge",
  "sub_pledge",
  "transform",
  "subjob",
  "collect",
];
