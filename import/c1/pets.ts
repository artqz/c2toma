import { Npc } from "../../result/types";

export function loadPetsData(deps: { npcs: Map<number, Npc> }) {

  const pets = groupSimilarNames(Array.from(deps.npcs.values()).filter(n => n.type === "summon"))

  return pets
}

function groupSimilarNames(npcs: Npc[]): Map<string, Npc[]> {
  const groupedNames = new Map<string, Npc[]>();

  npcs.forEach(npc => {
    const parts = npc.npcName.split('_');
    const baseName = parts.slice(0, parts.length - 1).join('_'); // Extract the base part (without the last)

    if (groupedNames.has(baseName)) {
      groupedNames.get(baseName)!.push(npc);
    } else {
      groupedNames.set(baseName, [npc]);
    }
  });

  return groupedNames;
}