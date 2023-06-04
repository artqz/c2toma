import slug from "slug";
import { ItemEntryC1 } from "../../datapack/c1/itemdata";
import { loadItemDataC1 } from "../../datapack/c1/itemdata";
import { Item, Set, ShortItem, Skill } from "../../result/types";
import { Chronicle } from "../types";

export function loadSets(deps: {
  chronicle: Chronicle;
  items: Map<number, Item>;
  skills: Map<string, Skill>;
}) {
  let sets = loadSetData(deps);

  console.log("Sets loaded.");

  return sets;
}

export const setSkills = new Map<string, Skill>();

function loadSetData(deps: {
  chronicle: Chronicle;
  items: Map<number, Item>;
  skills: Map<string, Skill>;
}) {
  let setData = [];
  let sets: Map<number, Set>;
  switch (deps.chronicle) {
    case "c1":
      setData = loadItemDataC1();
      sets = C1sets({ ...deps, setData });
      break;
    default:
      setData = loadItemDataC1();
      sets = new Map();
      break;
  }

  return sets;
}

function C1sets(deps: {
  chronicle: Chronicle;
  items: Map<number, Item>;
  skills: Map<string, Skill>;
  setData: ItemEntryC1[];
}) {
  const setsC1 = new Map(
    deps.setData
      .filter((i) => i.$.length === 1 && i.set_effect_skill !== "none")
      .map((item) => [item.$[0], item])
  );

  const itemByName = new Map(
    Array.from(deps.items.values()).map((i) => [i.itemName, i])
  );
  const skillByName = new Map(
    Array.from(deps.skills.values()).map((s) => [s.skillName, s])
  );

  const itemSetList = new Map<number, Set>();
  let setIcon = "";
  for (const set of setsC1.values()) {
    if (set.slot_chest === 44) {
      break;
    }
    const setItems: ShortItem[] = [];
    if (set.hasOwnProperty("slot_head") && set.slot_head) {
      const item = deps.items.get(set.slot_head);
      if (item) {
        setItems.push({ itemName: item.itemName });
      }
    }
    if (set.hasOwnProperty("slot_chest") && set.slot_chest) {
      const item = deps.items.get(set.slot_chest);
      if (item) {
        setIcon = item.icon;
        setItems.push({ itemName: item.itemName });
      }
    }
    if (set.hasOwnProperty("slot_legs") && set.slot_legs) {
      const item = deps.items.get(set.slot_legs);
      if (item) {
        setItems.push({ itemName: item.itemName });
      }
    }
    if (set.hasOwnProperty("slot_gloves") && set.slot_gloves) {
      const item = deps.items.get(set.slot_gloves);
      if (item) {
        setItems.push({ itemName: item.itemName });
      }
    }
    if (set.hasOwnProperty("slot_feet") && set.slot_feet) {
      const item = deps.items.get(set.slot_feet);
      if (item) {
        setItems.push({ itemName: item.itemName });
      }
    }
    if (set.hasOwnProperty("slot_lhand") && set.slot_lhand) {
      const item = deps.items.get(set.slot_lhand);
      if (item) {
        setItems.push({ itemName: item.itemName });
      }
    }
    // удаляем лишнее

    if (setItems.length > 0) {
      //39 и выше сеты из хроник выше
      if (typeof set.$[0] === "number") {
        const items: ShortItem[] = [];

        for (const si of setItems) {
          const item = itemByName.get(si.itemName);
          if (item) {
            items.push({ itemName: item.itemName });
          }
        }

        const { effects, effectsShield } = getEffectC1({
          p_def_inc: set.p_def_inc,
          m_def_inc: set.m_def_inc,
          hp_inc: set.hp_inc,
          mp_inc: set.mp_inc,
          move_speed_inc: set.move_speed_inc,
          breath_inc: set.breath_inc,
          magic_resist_inc: set.magic_resist_inc,
          casting_speed_inc: set.casting_speed_inc,
          p_attack_inc: set.p_attack_inc,
          m_attack_inc: set.m_attack_inc,
          hp_regen_inc: set.hp_regen_inc,
          mp_regen_inc: set.mp_regen_inc,
          str_inc: set.str_inc,
          con_inc: set.con_inc,
          dex_inc: set.dex_inc,
          int_inc: set.int_inc,
          men_inc: set.men_inc,
          wit_inc: set.wit_inc,
          avoid_inc: set.avoid_inc,
          shield_def_prob_inc: set.shield_def_prob_inc,
          weight_limit_inc: set.weight_limit_inc,
          resist_poison_inc: set.resist_poison_inc,
          p_def_vs_dagger_inc: set.resist_poison_inc,
        });

        itemSetList.set(set.$[0], {
          id: set.$[0],
          setName: setnamesC1.get(set.$[0])?.setName ?? "",
          icon: setIcon,
          name: setnamesC1.get(set.$[0])?.name ?? { en: "", ru: "" },
          desc: { en: "", ru: "" },
          setEffectSkill: effects,
          setAdditionalEffectSkill: effectsShield,
          items,
        });
      }
    }
  }

  return itemSetList;
}

type inc = { $: [number, number] } | undefined;
function getEffectC1(deps: {
  p_def_inc?: inc;
  m_def_inc?: inc;
  hp_inc?: inc;
  mp_inc?: inc;
  move_speed_inc?: inc;
  breath_inc?: inc;
  magic_resist_inc?: inc;
  casting_speed_inc?: inc;
  p_attack_inc?: inc;
  m_attack_inc?: inc;
  hp_regen_inc?: inc;
  mp_regen_inc?: inc;
  str_inc?: inc;
  con_inc?: inc;
  dex_inc?: inc;
  int_inc?: inc;
  men_inc?: inc;
  wit_inc?: inc;
  avoid_inc?: inc;
  shield_def_prob_inc?: inc;
  weight_limit_inc?: inc;
  resist_poison_inc?: inc;
  p_def_vs_dagger_inc?: inc;
}) {
  const effects: string[] = [];
  const effectsShield: string[] = [];

  if (deps.p_def_inc) {
    deps.p_def_inc.$[0] !== 0 &&
      effects.push(`P. Def. ${inc(deps.p_def_inc.$[0])}%`);
    deps.p_def_inc.$[1] !== 0 &&
      effectsShield.push(`P. Def. ${inc(deps.p_def_inc.$[1])}%`);
  }
  if (deps.m_def_inc) {
    deps.m_def_inc.$[0] !== 0 &&
      effects.push(`M. Def. ${inc(deps.m_def_inc.$[0])}%`);
    deps.m_def_inc.$[1] !== 0 &&
      effectsShield.push(`M. Def. ${inc(deps.m_def_inc.$[1])}%`);
  }
  if (deps.hp_inc) {
    deps.hp_inc.$[0] !== 0 && effects.push(`Max HP ${inc(deps.hp_inc.$[0])}`);
    deps.hp_inc.$[1] !== 0 &&
      effectsShield.push(`Max HP ${inc(deps.hp_inc.$[1])}`);
  }
  if (deps.mp_inc) {
    deps.mp_inc.$[0] !== 0 && effects.push(`Max MP ${inc(deps.mp_inc.$[0])}`);
    deps.mp_inc.$[1] !== 0 &&
      effectsShield.push(`Max MP ${inc(deps.mp_inc.$[1])}`);
  }
  if (deps.move_speed_inc) {
    deps.move_speed_inc.$[0] !== 0 &&
      effects.push(`Speed ${inc(deps.move_speed_inc.$[0])}`);
    deps.move_speed_inc.$[1] !== 0 &&
      effectsShield.push(`Speed ${inc(deps.move_speed_inc.$[1])}`);
  }
  if (deps.breath_inc) {
    deps.breath_inc.$[0] !== 0 &&
      effects.push(`Breath ${inc(deps.breath_inc.$[0])}`);
    deps.breath_inc.$[1] !== 0 &&
      effectsShield.push(`Breath ${inc(deps.breath_inc.$[1])}`);
  }
  if (deps.magic_resist_inc) {
    deps.magic_resist_inc.$[0] !== 0 &&
      effects.push(`Magic Resist ${inc(deps.magic_resist_inc.$[0])}`);
    deps.magic_resist_inc.$[1] !== 0 &&
      effectsShield.push(`Magic Resist ${inc(deps.magic_resist_inc.$[1])}`);
  }
  if (deps.casting_speed_inc) {
    deps.casting_speed_inc.$[0] !== 0 &&
      effects.push(`Casting Spd. ${inc(deps.casting_speed_inc.$[0])}%`);
    deps.casting_speed_inc.$[1] !== 0 &&
      effectsShield.push(`Casting Spd. ${inc(deps.casting_speed_inc.$[1])}%`);
  }
  if (deps.p_attack_inc) {
    deps.p_attack_inc.$[0] !== 0 &&
      effects.push(`P. Atk. ${inc(deps.p_attack_inc.$[0])}%`);
    deps.p_attack_inc.$[1] !== 0 &&
      effectsShield.push(`P. Atk. ${inc(deps.p_attack_inc.$[1])}%`);
  }
  if (deps.m_attack_inc) {
    deps.m_attack_inc.$[0] !== 0 &&
      effects.push(`M. Atk. ${inc(deps.m_attack_inc.$[0])}%`);
    deps.m_attack_inc.$[1] !== 0 &&
      effectsShield.push(`M. Atk. ${inc(deps.m_attack_inc.$[1])}%`);
  }
  if (deps.hp_regen_inc) {
    deps.hp_regen_inc.$[0] !== 0 &&
      effects.push(`HP Regen ${inc(deps.hp_regen_inc.$[0])}%`);
    deps.hp_regen_inc.$[1] !== 0 &&
      effectsShield.push(`HP Regen ${inc(deps.hp_regen_inc.$[1])}%`);
  }
  if (deps.mp_regen_inc) {
    deps.mp_regen_inc.$[0] !== 0 &&
      effects.push(`MP Regen ${inc(deps.mp_regen_inc.$[0])}%`);
    deps.mp_regen_inc.$[1] !== 0 &&
      effectsShield.push(`MP Regen ${inc(deps.mp_regen_inc.$[1])}%`);
  }
  if (deps.str_inc) {
    deps.str_inc.$[0] !== 0 && effects.push(`STR ${inc(deps.str_inc.$[0])}`);
    deps.str_inc.$[1] !== 0 &&
      effectsShield.push(`STR ${inc(deps.str_inc.$[1])}`);
  }
  if (deps.con_inc) {
    deps.con_inc.$[0] !== 0 && effects.push(`CON ${inc(deps.con_inc.$[0])}`);
    deps.con_inc.$[1] !== 0 &&
      effectsShield.push(`CON ${inc(deps.con_inc.$[1])}`);
  }
  if (deps.dex_inc) {
    deps.dex_inc.$[0] !== 0 && effects.push(`DEX ${inc(deps.dex_inc.$[0])}`);
    deps.dex_inc.$[1] !== 0 &&
      effectsShield.push(`DEX ${inc(deps.dex_inc.$[1])}`);
  }
  if (deps.int_inc) {
    deps.int_inc.$[0] !== 0 && effects.push(`INT ${inc(deps.int_inc.$[0])}`);
    deps.int_inc.$[1] !== 0 &&
      effectsShield.push(`INT ${inc(deps.int_inc.$[1])}`);
  }
  if (deps.wit_inc) {
    deps.wit_inc.$[0] !== 0 && effects.push(`WIT ${inc(deps.wit_inc.$[0])}`);
    deps.wit_inc.$[1] !== 0 &&
      effectsShield.push(`WIT ${inc(deps.wit_inc.$[1])}`);
  }
  if (deps.men_inc) {
    deps.men_inc.$[0] !== 0 && effects.push(`MEN ${inc(deps.men_inc.$[0])}`);
    deps.men_inc.$[1] !== 0 &&
      effectsShield.push(`MEN ${inc(deps.men_inc.$[1])}`);
  }
  if (deps.men_inc) {
    deps.men_inc.$[0] !== 0 && effects.push(`MEN ${inc(deps.men_inc.$[0])}`);
    deps.men_inc.$[1] !== 0 &&
      effectsShield.push(`MEN ${inc(deps.men_inc.$[1])}`);
  }
  if (deps.shield_def_prob_inc) {
    deps.shield_def_prob_inc.$[0] !== 0 &&
      effects.push(`Shield Def ${inc(deps.shield_def_prob_inc.$[0])}`);
    deps.shield_def_prob_inc.$[1] !== 0 &&
      effectsShield.push(`Shield Def ${inc(deps.shield_def_prob_inc.$[1])}`);
  }
  if (deps.weight_limit_inc) {
    deps.weight_limit_inc.$[0] !== 0 &&
      effects.push(`Weight Limit ${inc(deps.weight_limit_inc.$[0])}`);
    deps.weight_limit_inc.$[1] !== 0 &&
      effectsShield.push(`Weight Limit ${inc(deps.weight_limit_inc.$[1])}`);
  }
  if (deps.resist_poison_inc) {
    deps.resist_poison_inc.$[0] !== 0 &&
      effects.push(`Resist Poison ${inc(deps.resist_poison_inc.$[0])}%`);
    deps.resist_poison_inc.$[1] !== 0 &&
      effectsShield.push(`Resist Poison ${inc(deps.resist_poison_inc.$[1])}%`);
  }
  if (deps.p_def_vs_dagger_inc) {
    deps.p_def_vs_dagger_inc.$[0] !== 0 &&
      effects.push(
        `P. Def. against dagger ${inc(deps.p_def_vs_dagger_inc.$[0])}%`
      );
    deps.p_def_vs_dagger_inc.$[1] !== 0 &&
      effectsShield.push(
        `P. Def. against dagger ${inc(deps.p_def_vs_dagger_inc.$[1])}%`
      );
  }

  return {
    effects: effects.length > 0 ? effects.join(", ") + "." : "",
    effectsShield:
      effectsShield.length > 0 ? effectsShield.join(", ") + "." : "",
  };
}

function inc(n: number) {
  return (n <= 0 ? "" : "+") + n;
}

const setnamesC1 = new Map([
  [
    1,
    {
      setName: "wooden_set",
      name: {
        en: "Wooden Set",
        ru: "Деревянный Комплект",
      },
    },
  ],
  [
    2,
    {
      setName: "devotion_set",
      name: {
        en: "Devotion Set",
        ru: "Комплект Преданности",
      },
    },
  ],
  [
    3,
    {
      setName: "mithril_heavy_armor_set",
      name: {
        en: "Mithril Heavy Armor Set",
        ru: "Комплект Мифриловой Тяжелой Брони",
      },
    },
  ],
  [
    4,
    {
      setName: "reinforced_leather_set",
      name: {
        en: "Reinforced Leather Set",
        ru: "Комплект Укрепленной Кожаной Брони",
      },
    },
  ],
  [
    5,
    {
      setName: "knowledge_set",
      name: {
        en: "Knowledge Set",
        ru: "Комплект Знаний",
      },
    },
  ],
  [
    6,
    {
      setName: "manticore_set",
      name: {
        en: "Manticore Set",
        ru: "Комплект из Шкуры Мантикоры",
      },
    },
  ],
  [
    7,
    {
      setName: "brigandine_set",
      name: {
        en: "Brigandine Set",
        ru: "Панцирный Комплект",
      },
    },
  ],
  [
    8,
    {
      setName: "elven_mithril_set",
      name: {
        en: "Elven Mithril Set",
        ru: "Мифриловый Комплект",
      },
    },
  ],
]);
