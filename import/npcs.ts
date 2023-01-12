import Fs from "fs";
import Path from "path"
import { loadNpcNames } from '../datapack/c1/npcnames';
import { Npc } from '../result/types';
import { NpcDataEntry } from './types';

function loadNpcJson(path: string, filename: string) {
  const map = Fs.readFileSync(Path.join(path, filename), "utf8");
  return NpcDataEntry.parse(JSON.parse(map));
}


export function loadNpcsToma ()  {
  
  const npcnamesC1 = new Map(loadNpcNames().map((npc) => [npc.id, npc]));

  const path = "npcs/c2"
  const entries = Fs.readdirSync(path, "utf8");
  const result = entries.filter((file) => Path.extname(file) === ".json");
  
  const npcs = new Map<number, Npc>()
  const newC2Npc:number[] = []

  for (const filename of result) {
    const npcId = parseInt(filename)
    const npcById = npcnamesC1.get(npcId)
    // удалить лишних мобов, которых нет в ц2 клиенте
    if (!npcById) {
      newC2Npc.push(npcId)   
    }
    const npc = loadNpcJson(path, filename);
    npcs.set(parseInt(filename), {
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
      name: "", // нет данных у томы
      nick: "", // нет данных у томы
      nickColor: "default", // нет данных у томы
      npcName: "", // нет данных у томы
      orgHp: npc.npcData.orgHp,
      orgHpRegen: 0, // нет данных у томы
      orgMp: npc.npcData.orgMp,
      orgMpRegen: 0, // нет данных у томы
      physicalAvoidModify: npc.npcData.physicalAvoidModify,
      physicalHitModify: npc.npcData.physicalHitModify,
      type: npc.npcData.npcType.toString(), // необходимо перевести в другой вид, либо взять в другом сервере
      existInC1: true
    })
  }
  console.log(newC2Npc.length);
  
  console.log("finish");
  
  return npcs
}