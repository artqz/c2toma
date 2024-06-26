import slug from "slug";
import { loadItemDataC4 } from "../../datapack/c4/itemdata";
import { Item, Set, ShortItem, Skill } from "../../result/types";

slug.charmap["'"] = "'";

export const setSkills = new Map<string, Skill>();

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
        // fix c2
        switch (set.slot_gloves) {
          case 5718:
          case 5719:
          case 5720:
            setItems = { ...setItems, slotGloves: ["blue_wolve's_gloves"] };
            break;
          case 5712:
          case 5711:
          case 5710:
            setItems = { ...setItems, slotGloves: ["shrnoen's_gauntlet"] };
            break;
          case 5714:
          case 5715:
          case 5716:
            setItems = { ...setItems, slotGloves: ["avadon_gloves"] };
            break;
          case 5722:
          case 5723:
          case 5724:
            setItems = { ...setItems, slotGloves: ["doom_gloves"] };
            break;
        }
      }
    }
    if (set.hasOwnProperty("slot_feet") && set.slot_feet) {
      const item = deps.items.get(set.slot_feet);
      if (item) {
        setItems = { ...setItems, slotFeet: [item.itemName] };
      } else {
        // fix c2
        switch (set.slot_feet) {
          case 5734:
          case 5735:
          case 5736:
            setItems = { ...setItems, slotFeet: ["blue_wolve's_boots"] };
            break;
          case 5726:
          case 5727:
          case 5728:
            setItems = { ...setItems, slotFeet: ["shrnoen's_boots"] };
            break;
          case 5730:
          case 5731:
          case 5732:
            setItems = { ...setItems, slotFeet: ["avadon_boots"] };
            break;
          case 5738:
          case 5739:
          case 5740:
            setItems = { ...setItems, slotFeet: ["doom_boots"] };
            break;
        }
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
      if (typeof set.$[0] === "number" && set.$[0] < 39) {
        const items: ShortItem[] = [];

        // for (const si of setItems) {
        //   const item = itemByName.get(si.itemName);
        //   if (item) {
        //     items.push({ itemName: item.itemName });
        //   }
        // }

        const skill = skillByName.get(set.set_effect_skill!);
        const skill2 = skillByName.get(set.set_additional_effect_skill!);

        if (skill) setSkills.set(skill.id + "_" + skill.level, skill);
        if (skill2) setSkills.set(skill2.id + "_" + skill2.level, skill2);

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
