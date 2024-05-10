import { Race, Sex } from "../schemas/npc";
import slug from "slug";
import { Item } from "../schemas/items";

export function getClan(params: { $?: string[] | number[] }) {
  const { $ } = params;
  if ($) {
    const value = $.at(0);
    if (typeof value === "number") {
      return "ALL";
    }
    if (typeof value === "string") {
      return value.replace("@", "");
    }
  }
  return undefined;
}

export function getDrop(deps: { list: any; itemByName: Map<string, Item> }) {
  type DropItem = {
    id: number;
    min: number;
    max: number;
    chance: number;
    name: string;
  };
  const drop: [DropItem[], number][] = [];

  (deps.list as any).$?.map((mainGroup: any) => {
    const mainGroupChanceDrop = Number(mainGroup.$[1]);
    const arr: DropItem[] = [];
    mainGroup.$.map((subGroup: any) => {
      subGroup.$ &&
        subGroup.$.map((itemData: any) => {
          if (itemData.$) {
            const itemName = slug(itemData.$[0], "_");
            const itemChanceDrop = Number(itemData.$[3]);
            const item = deps.itemByName.get(itemName);
            if (!item) {
              console.log("Drop list item not found: " + itemName);
            } else {
              arr.push({
                id: item.id,
                min: itemData.$[1],
                max: itemData.$[2],
                chance: itemChanceDrop,
                name: item.name,
              });
            }
          }
        });
    });
    drop.push([arr, mainGroupChanceDrop]);
  });

  return {
    group: (drop ?? []).map((g) => {
      return {
        $: { chance: g[1] },
        item: g[0].map((i) => {
          return {
            _com: i.name,
            $: {
              id: i.id,
              min: i.min,
              max: i.max,
              chance: i.chance,
            },
          };
        }),
      };
    }),
  };
}

export function getSpoil(deps: { list: any; itemByName: Map<string, Item> }) {
  type SpoilItem = {
    id: number;
    min: number;
    max: number;
    chance: number;
    name: string;
  };
  const spoil: SpoilItem[] = [];

  (deps.list as any).$?.map((itemData: any) => {
    if (itemData) {
      const itemName = slug(itemData.$[0], "_");
      const item = deps.itemByName.get(itemName);
      if (!item) {
        console.log("Spoil list item not found: " + itemName);
      } else {
        const itemChanceDrop = Number(itemData.$[3]);
        spoil.push({
          id: item.id,
          min: itemData.$[1],
          max: itemData.$[2],
          chance: itemChanceDrop,
          name: item.name,
        });
      }
    }
  });

  return {
    item: (spoil ?? []).map((i) => {
      return {
        _com: i.name,
        $: {
          id: i.id,
          min: i.min,
          max: i.max,
          chance: i.chance,
        },
      };
    }),
  };
}

export function getType(value: string) {
  type Type =
    | "Monster"
    | "Merchant"
    | "Warehouse"
    | "Teleporter"
    | "Guard"
    | "Folk";

  let type: Type = "Folk";

  switch (value) {
    case "warrior":
      type = "Monster";
      break;
    case "merchant":
      type = "Merchant";
      break;
    case "guard":
      type = "Guard";
      break;
    case "warehouse_keeper":
      type = "Warehouse";
      break;
    case "teleporter":
      type = "Teleporter";
  }
  return type;
}

export function getAggr(deps: {
  npcName: string;
  npcAiByName: Map<string, { super: string }>;
}) {
  const ai = deps.npcAiByName.get(deps.npcName)?.super;

  if (ai?.includes("aggressive")) {
    return true;
  } else {
    return false;
  }
}

export function getRace(value: string) {
  if (value === "darkelf") {
    return Race.parse("DARK_ELF");
  }
  return Race.parse(value.toUpperCase());
}

export function getSex(value: string) {
  return Sex.parse(value.toUpperCase());
}
