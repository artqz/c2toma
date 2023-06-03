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
  switch (deps.chronicle) {
    case "c1":
      setData = loadItemDataC1();
      break;
    default:
      setData = loadItemDataC1();
      break;
  }
  const sets = new Map<number, Set>();
  C1sets({ ...deps, setData });

  return [];
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

        itemSetList.set(set.$[0], {
          id: set.$[0],
          setName: setnamesC1.get(set.$[0])?.setName ?? "",
          icon: setIcon,
          name: setnamesC1.get(set.$[0])?.name ?? { en: "", ru: "" },
          desc: { en: "", ru: "" },
          setEffectSkill: "",
          setAdditionalEffectSkill: "",
          items,
        });
      }
    }
  }
  console.log(itemSetList);
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
