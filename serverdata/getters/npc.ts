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
            const itemChanceDrop = Number(itemData.$[3]);
            const item = deps.itemByName.get(slug(itemData.$[0], "_"));
            if (item) {
              arr.push({
                id: item.id,
                min: itemData.$[1],
                max: itemData.$[2],
                chance: itemChanceDrop,
                name: item.itemName,
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
