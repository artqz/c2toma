import { loadNpcDataC4 } from "../../datapack/c4/npcdata";
import { loadNpcNamesC6 } from "../../datapack/c6/npcnames";
import { loadNpcDataGF } from "../../datapack/gf/npcdata";
import { NpcNameEntry } from "../../datapack/types";
import { Npc } from "../../result/types";
import { NpcDataEntry } from "../types";
// import { Item, Npc, Skill } from "../../result/types";

export function loadNpcsC6(deps: {
  // items: Map<number, Item>;
  // skills: Map<string, Skill>;
}) {
  let npcs: Map<number, Npc>;
  npcs = getNpcs();

  console.log("NPCs loaded.");

  return npcs;
}

type NpcNameC6 = NpcNameEntry & {
  npcName: string;
};

function getNpcs() {
  const npcs = new Map<number, Npc>();
  const npcsNames = new Map<number, NpcNameC6>();

  const npcC4ByName = new Map(loadNpcDataC4().map((n) => [n.$[2], n]));
  const npcGFByName = new Map(loadNpcDataGF().map((n) => [n.$[2], n]));
  const npcGFById = new Map(loadNpcDataGF().map((n) => [n.$[1], n]));

  // Находим все игровые имена в грации
  for (const npcName of loadNpcNamesC6()) {
    const npcGF = npcGFById.get(npcName.id);
    if (npcGF) {
      npcsNames.set(npcName.id, { ...npcName, npcName: npcGF.$[2] });
    } else {
      npcsNames.set(npcName.id, {
        ...npcName,
        npcName: addNpcName.get(npcName.id) ?? "null",
      });
    }
  }

  for (const npcName of npcsNames.values()) {
    const npcC4 = npcC4ByName.get(npcName.npcName);
    if (npcC4) {
    }
  }

  console.log(loadNpcNamesC6().length, Array.from(npcsNames.values()).length);

  return npcs;
}

function addNpc(npcData: NpcDataEntry, npcNames: NpcNameC6[]) {
  //  const npc = { id: npcData.,
  //         npcName: "", // нет данных у томы
  //         name: { en: npcC3.name, ru: npcC3.name }, // нет данных у томы
  //         nick: { en: npcC3.nick, ru: npcC3.nick }, // нет данных у томы
  //         nickColor: npcC3.nickcolor, // нет данных у томы
  //         level: npc.npcData.level,
  //         ai: "",
  //         agroRange: 0, // нет данных у томы
  //         baseAttackSpeed: npc.npcData.baseAttackSpeed,
  //         baseCritical: npc.npcData.baseCritical,
  //         baseDefend: npc.npcData.baseDefend,
  //         baseMagicAttack: npc.npcData.baseMagicAttack,
  //         baseMagicDefend: npc.npcData.baseMagicDefend,
  //         basePhysicalAttack: npc.npcData.basePhysicalAttack,
  //         baseReuseDelay: 0, // нет данных у томы
  //         exp: npc.npcData.acquireExpRate,
  //         sp: npc.npcData.acquireSp,
  //         magicUseSpeedModify: 0, // нет данных у томы
  //         orgHp: npc.npcData.orgHp,
  //         orgHpRegen: 0, // нет данных у томы
  //         orgMp: npc.npcData.orgMp,
  //         orgMpRegen: 0, // нет данных у томы
  //         physicalAvoidModify: npc.npcData.physicalAvoidModify,
  //         physicalHitModify: npc.npcData.physicalHitModify,
  //         type: npc.npcData.npcType.toString(), // необходимо перевести в другой вид, либо взять в другом сервере
  //         race: "", // нет данных у томы, берем из скилов, которых нет берем из ц4
  //         classes: [],
  //         dropList: getDrop(npc.drop, deps.items),
  //         spoilList: getDrop(npc.spoil, deps.items),
  //         skillList: getSkills({ ...deps, tomaSkills: npc.npcData.skillList }),
  //         multisell: [],
  //         spawns: [],
  //  }
}

// нпц которых не хватает грации и чьи ИД были изменены
const addNpcName = new Map([
  [21277, "kukaburo_c"],
  [21281, "antelope_c"],
  [21285, "bandersnatch_c"],
  [21289, "buffalo_c"],
  [21293, "grendel_c"],
  [25517, "anais_brilliance_master"],
  [25518, "brilliance_apostle"],
  [25519, "brilliance_follower"],
]);
