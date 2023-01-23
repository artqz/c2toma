import Fs from "fs";
import Path from "path"

import { loadNpcNamesC2, NpcNameEntry } from '../datapack/c2/npcnames';
import { loadNpcDataC4 } from '../datapack/c4/npcdata';
import { Item, Npc, NpcDrop } from '../result/types';
import { NpcDataEntry } from './types';

function loadNpcJson(path: string, filename: string) {
  const map = Fs.readFileSync(Path.join(path, filename), "utf8");
  return NpcDataEntry.parse(JSON.parse(map));
}


export function loadNpcs(deps: {items:Map<number, Item>})  {  
  const npcnamesC2 = new Map(loadNpcNamesC2().map((npc) => [npc.id, npc]));
  let npcs: Map<number, Npc>
  npcs = loadTomaNpcs(npcnamesC2)
  npcs = loadC4Npcs(npcs)
  console.log(npcs);
  
  console.log("NPCs loaded.");

  return npcs
}

function loadTomaNpcs(npcnamesC2: Map<number, NpcNameEntry>) {
  const npcs = new Map<number, Npc>()
  const path = "npcs/c2"
  const entries = Fs.readdirSync(path, "utf8");
  const tomaNpcs = new Map(entries.filter((file) => Path.extname(file) === ".json").map(x => [parseInt(x), parseInt(x)]));
  
  for (const npcC2 of Array.from(npcnamesC2.values())) {
    const npcId = npcC2.id   

    const npcById = tomaNpcs.get(npcId)
   
    if (npcById){
    const npc = loadNpcJson(path, `${npcId}.json`);
    
    npcs.set(npcId, {
      agroRange: 0, // нет данных у томы
      baseAttackSpeed: npc.npcData.baseAttackSpeed,
      baseCritical: npc.npcData.baseCritical,
      baseDefend: npc.npcData.baseDefend,
      baseMagicAttack: npc.npcData.baseMagicAttack,
      baseMagicDefend: npc.npcData.baseMagicDefend,
      basePhysicalAttack: npc.npcData.basePhysicalAttack,
      baseReuseDelay: 0, // нет данных у томы
      exp: npc.npcData.acquireExpRate,
      sp: npc.npcData.acquireSp,
      id: npc.npcData.npcClassId,
      level: npc.npcData.level,
      magicUseSpeedModify: 0, // нет данных у томы
      name: {en: npcC2.name, ru: ""}, // нет данных у томы
      nick: {en: npcC2.nick, ru: ""}, // нет данных у томы
      nickColor: npcC2.nickcolor, // нет данных у томы
      npcName: "", // нет данных у томы
      orgHp: npc.npcData.orgHp,
      orgHpRegen: 0, // нет данных у томы
      orgMp: npc.npcData.orgMp,
      orgMpRegen: 0, // нет данных у томы
      physicalAvoidModify: npc.npcData.physicalAvoidModify,
      physicalHitModify: npc.npcData.physicalHitModify,
      type: npc.npcData.npcType.toString(), // необходимо перевести в другой вид, либо взять в другом сервере
      race: "", // нет данных у томы
      dropList: getDrop(npc.drop),
      spoilList: getDrop(npc.drop)
    })
  }
}
  return npcs
}

function loadC4Npcs(npcsToma: Map<number, Npc>) {
  const npcs = new Map<number, Npc>()
  const c4Npcs = new Map(loadNpcDataC4().map((npc) => [npc.$[1], npc]));

  for (const npc of Array.from(npcsToma.values())) {
    const npcById = c4Npcs.get(npc.id)

    if (npcById){
      npcs.set(npc.id, {
        ...npc,
        agroRange: npcById.agro_range,
        npcName: npcById.$[2],
        orgHpRegen: npcById.org_hp_regen,
        orgMpRegen: npcById.org_mp_regen,
        type: npcById.$[0],
        race: npcById.race
      })
    }
  }
  return npcs
}


function getDrop(list: {
    npcType: number,
    min: number,
    max: number;
    chance: number;
    npcId: number;
    crystal: {
        itemClassId: number;
        crystalType: "NoGrade" | "D" | "C" | "B" | "A" | "S";
    };
}[]) {
  const drop: NpcDrop[] = []

  for (const item of list) {
    drop.push({chance: item.chance, countMax: item.max, countMin: item.min, itemId: item.crystal.itemClassId, npcId: item.npcId})
  }

  return drop
}