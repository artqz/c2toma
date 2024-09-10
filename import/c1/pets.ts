import { Npc } from "../../result/types";

export function loadPetsData(deps: { npcs: Map<number, Npc> }) {

  const test = groupSimilarNames(Array.from(deps.npcs.values()).filter(n => n.type === "summon").map(n => n.npcName))
  console.log(test);

}

function groupSimilarNames(names: string[]): Map<string, string[]> {
  const groupedNames = new Map<string, string[]>();

  names.forEach(name => {
    const parts = name.split('_');
    const baseName = parts.slice(0, parts.length - 1).join('_'); // Extract the base part (without the last)

    if (groupedNames.has(baseName)) {
      groupedNames.get(baseName)!.push(name);
    } else {
      groupedNames.set(baseName, [name]);
    }
  });

  return groupedNames;
}