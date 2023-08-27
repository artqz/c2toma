import { loadNpcDataC4 } from "../../datapack/c4/npcdata";
import { loadNpcNamesC6 } from "../../datapack/c6/npcnames";
import { Npc } from "../../result/types";
// import { Item, Npc, Skill } from "../../result/types";

export function loadNpcsC6(deps: {
  // items: Map<number, Item>;
  // skills: Map<string, Skill>;
}) {
  const npcsC4 = new Map<number, Npc>();
  const npcsGF = new Map<number, Npc>();
  const npcs = new Map<number, string>();
  for (const npc of loadNpcNamesC6()) {
    npcs.set(npc.id, npc.name.en);
  }
  console.log(Array.from(npcs.values()).length, loadNpcDataC4().length);

  console.log("NPCs loaded.");

  return npcs;
}
