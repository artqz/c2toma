import slug from "slug";
import { loadItemDataC1 } from "../datapack/c1/itemdata";
import { Item } from "./schemas/items";

export function itemdata() {
  const itemdata = loadItemDataC1();
  const items = Item.array().parse(
    itemdata
      .filter((i) => i.item_type)
      .map((i): Item => {
        return {
          id: i.$[1],
          itemName: slug(i.$[2].toString(), "_"),
        };
      })
  );

  return { itemByName: new Map(items.map((i) => [i.itemName, i])) };
}
