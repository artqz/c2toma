import { loadNpcDataC1 } from "../../datapack/c1/npcdata";
import { loadNpcNamesC1 } from "../../datapack/c1/npcnames";
import { Npc } from "../../result/types";

export function loadNpcs(deps: {}) {
  let npcs = loadNpcData(deps);
  npcs = loadNpcnames({ npcsData: npcs });
  console.log("NPCs loaded.");

  return npcs;
}

function loadNpcData(deps: {}) {
  const npcsData = loadNpcDataC1();
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
      dropList: [], //getDrop(npc.drop, deps.items),
      spoilList: [], //getDrop(npc.spoil, deps.items),
      skillList: [], //getSkills({ ...deps, tomaSkills: npc.npcData.skillList }),
      multisell: [],
      spawns: [],
    });
  }

  return npcs;
}

function loadNpcnames(deps: { npcsData: Map<number, Npc> }) {
  const npcsData = deps.npcsData;
  const npcNmes = loadNpcNamesC1();

  for (const npcName of npcNmes) {
    const npc = npcsData.get(npcName.id);
    if (npc) {
      npcsData.set(npc.id, {
        ...npc,
        name: { en: npcName.name, ru: "" },
        nick: { en: npcName.nick, ru: "" },
        nickColor: npcName.nickcolor,
      });
    }
  }

  return npcsData;
}
