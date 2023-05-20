import slug from "slug";
import { loadItemDataC4 } from "../../datapack/c4/itemdata";
import { Item, Set, ShortItem, Skill } from "../../result/types";

slug.charmap["'"] = "'";

export function loadItemSetList(deps: {
  items: Map<number, Item>;
  skills: Map<string, Skill>;
}) {
  const ability = loadC2Sets(deps);
  console.log("Items: Set list loaded.");

  return ability;
}

function loadC2Sets(deps: {
  items: Map<number, Item>;
  skills: Map<string, Skill>;
}) {
  const itemByName = new Map(
    Array.from(deps.items.values()).map((i) => [i.itemName, i])
  );
  const skillByName = new Map(
    Array.from(deps.skills.values()).map((s) => [s.skillName, s])
  );
  const setsC4 = new Map(
    loadItemDataC4()
      .filter((i) => i.$.length === 1 && i.set_effect_skill !== "none")
      .map((item) => [item.$[0], item])
  );
  const itemSetList = new Map<number, Set>();
  for (const set of setsC4.values()) {
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
    if (setItems.length > 0) {
      //39 и выше сеты из хроник выше
      if (typeof set.$[0] === "number" && set.$[0] < 39) {
        const setList: ShortItem[] = [];

        for (const si of setItems) {
          const item = itemByName.get(si.itemName);
          if (item) {
            setList.push({ itemName: item.itemName });
          }
        }

        const skill = skillByName.get(set.set_effect_skill!);
        if (skill) {
          itemSetList.set(set.$[0], {
            id: set.$[0],
            setName: slug(skill.name.en, "_"),
            name: skill.name,
            desc: skill.desc,
            setEffectSkill: skill.skillName,
            setList,
          });
        }
      }
    }
  }

  return itemSetList;
}
