import { loadPetdataC4 } from "../../datapack/c4/petdata";
import { Npc, Pet } from "../../result/types";
import { calcAccuracy, calcEvasion, calcHP, calcMAtk, calcMDef, calcMP, calcMSpd, calcPAtk, calcPCritical, calcPDef, calcPSpd } from "./func";

export function loadPetsData(deps: { npcs: Map<number, Npc> }) {
  const npcByName = new Map(Array.from(deps.npcs.values()).map(n => [n.npcName, n]));
  const map: Map<string, Pet> = new Map()
  const pets = loadPetdataC4()


  for (const pet of pets) {
    const arr: Pet["levels"] = []
    const npc = npcByName.get(pet.npc_name)
    if (npc) {
      for (const _ of pet.$) {
        arr.push({
          npcName: pet.npc_name,
          level: _.level,
          orgHp: calcHP(_.org_hp, npc.con),
          orgMp: calcMP(_.org_mp, npc.men),
          pAtk: calcPAtk(
            _.org_pattack,
            npc.str,
            _.level,
            []
          ),
          pDef: calcPDef(
            _.org_pdefend,
            _.level,
            []
          ),
          mAtk: calcMAtk(
            _.org_mattack,
            npc.int,
            _.level,
            []
          ),
          mDef: calcMDef(
            _.org_mdefend,
            npc.men,
            _.level,
            []
          ),
          pSpd: calcPSpd(npc.baseAttackSpeed ?? 1, npc.dex),
          mSpd: calcMSpd(npc.wit, _.level),
          pCritical: calcPCritical(npc.baseCritical ?? 1, npc.dex),
          accuracy: calcAccuracy(npc.dex, _.level),
          evasion: calcEvasion(npc.dex, _.level),
          soulshotCount: _.soulshot_count,
          spiritshotCount: _.spiritshot_count
        })
      }
    }
    map.set(pet.npc_name, { npcName: pet.npc_name, levels: arr })
  }

  return Array.from(map.values());
}

