import { loadNpcDataC1 } from "../../datapack/c1/npcdata";
import { loadNpcNamesC1 } from "../../datapack/c1/npcnames";
import { loadNpcDataGF } from "../../datapack/gf/npcdata";
import { NpcNameEntry, loadNpcNamesGF } from "../../datapack/gf/npcnames";
import { Item, Npc, NpcDrop } from "../../result/types";
import { Chronicle } from "../types";

export function loadNpcs(deps: {
  chronicle: Chronicle;
  items: Map<number, Item>;
}) {
  let npcs = loadNpcData(deps);
  npcs = loadNpcnames({ ...deps, npcsData: npcs });
  npcs = loadNpcRuNames({ ...deps, npcsData: npcs });
  console.log("NPCs loaded.");

  return npcs;
}

function loadNpcData(deps: { chronicle: Chronicle; items: Map<number, Item> }) {
  let npcsData = [];
  switch (deps.chronicle) {
    case "c1":
      npcsData = loadNpcDataC1();
      break;
    default:
      npcsData = loadNpcDataC1();
      break;
  }
  const npcs = new Map<number, Npc>();

  for (const npc of npcsData) {
    npcs.set(npc.$[1], {
      id: npc.$[1],
      npcName: npc.$[2],
      name: { en: "", ru: "" },
      nick: { en: "", ru: "" },
      nickColor: "default",
      level: npc.level,
      ai: "",
      agroRange: npc.agro_range,
      baseAttackSpeed: npc.base_attack_speed,
      baseCritical: npc.base_critical,
      baseDefend: npc.base_defend,
      baseMagicAttack: npc.base_magic_attack,
      baseMagicDefend: npc.base_magic_defend,
      basePhysicalAttack: npc.base_physical_attack,
      baseReuseDelay: 0,
      exp: npc.level ** 2 * npc.acquire_exp_rate,
      sp: npc.acquire_sp,
      magicUseSpeedModify: 0,
      orgHp: npc.org_hp,
      orgHpRegen: npc.org_hp_regen,
      orgMp: npc.org_mp,
      orgMpRegen: npc.org_mp_regen,
      physicalAvoidModify: npc.physical_avoid_modify,
      physicalHitModify: npc.physical_hit_modify,
      type: npc.$[0],
      race: npc.race,
      dropList: getDrop({ ...deps, list: npc.additional_make_multi_list }),
      spoilList: getSpoil({ ...deps, list: npc.corpse_make_list }),
      skillList: [], //getSkills({ ...deps, tomaSkills: npc.npcData.skillList }),
      multisell: [],
      spawns: [],
    });
  }

  return npcs;
}

function getDrop(deps: { list: any; items: Map<number, Item> }) {
  const drop: NpcDrop[] = [];
  const itemByName = new Map(
    Array.from(deps.items.values()).map((i) => [i.itemName, i])
  );

  (deps.list as any).$?.map((mainGroup: any) => {
    const mainGroupChanceDrop = Number(mainGroup.$[1]);
    return mainGroup.$.map((subGroup: any) => {
      return (
        subGroup.$ &&
        subGroup.$.map((itemData: any) => {
          if (itemData.$) {
            const itemChanceDrop = Number(itemData.$[3]);
            const chance = (itemChanceDrop * mainGroupChanceDrop) / 100;

            const itemName = itemData.$[0].replace(/\s/g, "_");
            const item = itemByName.get(itemName);

            if (!item) {
              console.log("Drop list item not found: " + itemName);
            } else {
              drop.push({
                itemName: item.itemName,
                countMin: itemData.$[1],
                countMax: itemData.$[2],
                chance,
              });
            }
          }
        })
      );
    });
  });

  return drop;
}

function getSpoil(deps: { list: any; items: Map<number, Item> }) {
  const spoil: NpcDrop[] = [];
  const itemByName = new Map(
    Array.from(deps.items.values()).map((i) => [i.itemName, i])
  );

  (deps.list as any).$?.map((itemData: any) => {
    if (itemData) {
      const itemName = itemData.$[0];
      const item = itemByName.get(itemName);
      if (!item) {
        console.log("Spoil list item not found: " + itemName);
      } else {
        spoil.push({
          itemName: item.itemName,
          countMin: itemData.$[1],
          countMax: itemData.$[2],
          chance: itemData.$[3],
        });
      }
    }
  });

  return spoil;
}

function loadNpcnames(deps: {
  chronicle: Chronicle;
  npcsData: Map<number, Npc>;
}) {
  const npcsData = deps.npcsData;
  let npcNames = [];
  switch (deps.chronicle) {
    case "c1":
      npcNames = loadNpcNamesC1();
      break;
    default:
      npcNames = loadNpcNamesC1();
      break;
  }

  for (const npcName of npcNames) {
    const npc = npcsData.get(npcName.id);
    if (npc) {
      npcsData.set(npc.id, {
        ...npc,
        name: { en: npcName.name, ru: npcName.name },
        nick: { en: npcName.nick, ru: npcName.nick },
        nickColor: npcName.nickcolor,
      });
    }
  }

  return npcsData;
}

function loadNpcRuNames(deps: { npcsData: Map<number, Npc> }) {
  const npcsData = deps.npcsData;
  const npcdataGF = new Map(loadNpcDataGF().map((npc) => [npc.$[1], npc]));
  const npcNamesGF = new Map(loadNpcNamesGF().map((npc) => [npc.id, npc]));
  const npcNameByName = new Map<string, NpcNameEntry>();

  for (const npcGF of npcdataGF.values()) {
    const npcName = npcNamesGF.get(npcGF.$[1]);
    if (npcName) {
      npcNameByName.set(npcGF.$[2], npcName);
    }
  }

  for (const npcData of npcsData.values()) {
    const npc = npcNameByName.get(npcData.npcName);
    if (npc) {
      npcsData.set(npcData.id, {
        ...npcData,
        name: { ...npcData.name, ru: npc.name.ru },
        nick: {
          ...npcData.nick,
          ru: npcData.nick.en === npc.nick.en ? npc.nick.ru : npcData.nick.en,
        },
      });
    }
  }

  return npcsData;
}
