import slug from "slug";
import { loadItemDataC4 } from "../../datapack/c4/itemdata";
import { Item, Set, ShortItem, Skill } from "../../result/types";

slug.charmap["'"] = "'";

export const setSkillsC3 = new Map<string, Skill>();

export function loadSetsC3(deps: {
  items: Map<number, Item>;
  skills: Map<string, Skill>;
}) {
  const ability = loadC3Sets(deps);
  console.log("Items: Set list loaded.");

  return ability;
}

function loadC3Sets(deps: {
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
  let setIcon = "";

  for (const set of setsC4.values()) {
    let setItems: {
      slotHead: string[];
      slotChest: string[];
      slotLegs: string[];
      slotGloves: string[];
      slotFeet: string[];
      slotLhand: string[];
    } = {
      slotHead: [],
      slotChest: [],
      slotLegs: [],
      slotGloves: [],
      slotFeet: [],
      slotLhand: [],
    };
    if (set.hasOwnProperty("slot_head") && set.slot_head) {
      const item = deps.items.get(set.slot_head);
      if (item) {
        setItems = { ...setItems, slotHead: [item.itemName] };
      }
    }
    if (set.hasOwnProperty("slot_chest") && set.slot_chest) {
      const item = deps.items.get(set.slot_chest);
      if (item) {
        setIcon = item.icon;
        setItems = { ...setItems, slotChest: [item.itemName] };
      }
    }
    if (set.hasOwnProperty("slot_legs") && set.slot_legs) {
      const item = deps.items.get(set.slot_legs);
      if (item) {
        setItems = { ...setItems, slotLegs: [item.itemName] };
      }
    }
    if (set.hasOwnProperty("slot_gloves") && set.slot_gloves) {
      const item = deps.items.get(set.slot_gloves);
      if (item) {
        setItems = { ...setItems, slotGloves: [item.itemName] };
      } else {
        console.log("---" + set.slot_gloves);
      }
    }
    if (set.hasOwnProperty("slot_feet") && set.slot_feet) {
      const item = deps.items.get(set.slot_feet);
      if (item) {
        setItems = { ...setItems, slotFeet: [item.itemName] };
      } else {
        console.log("---" + set.slot_feet);
      }
    }
    if (set.hasOwnProperty("slot_lhand") && set.slot_lhand) {
      const item = deps.items.get(set.slot_lhand);
      if (item) {
        setItems = { ...setItems, slotLhand: [item.itemName] };
      }
    }
    if (true) {
      //39 и выше сеты из хроник выше
      if (typeof set.$[0] === "number" && set.$[0] < 52) {
        const items: ShortItem[] = [];

        // for (const si of setItems) {
        //   const item = itemByName.get(si.itemName);
        //   if (item) {
        //     items.push({ itemName: item.itemName });
        //   }
        // }

        const skill = skillByName.get(set.set_effect_skill!);
        const skill2 = skillByName.get(set.set_additional_effect_skill!);

        if (skill) setSkillsC3.set(skill.id + "_" + skill.level, skill);
        if (skill2) setSkillsC3.set(skill2.id + "_" + skill2.level, skill2);

        if (skill) {
          itemSetList.set(set.$[0], {
            id: set.$[0],
            setName: slug(skill.name.en, "_"),
            icon: setIcon,
            name: skill.name,
            desc: skill.desc,
            setEffectSkill: skill.skillName,
            setAdditionalEffectSkill: skill2 ? skill2.skillName : "none",
            items: setItems,
          });
        }
      }
    }
  }

  return itemSetList;
}
