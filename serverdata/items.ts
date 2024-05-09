import slug from "slug";
import { loadItemDataC1 } from "../datapack/c1/itemdata";
import { Item } from "./schemas/items";
import { loadItemNamesC1 } from "../datapack/c1/itemnames";

export function itemdata() {
  const itemdata = loadItemDataC1();
  const itemNameById = new Map(loadItemNamesC1().map((i) => [i.id, i]));

  const items = Item.array().parse(
    itemdata
      .filter((i) => i.item_type)
      .map((i): Item => {
        const id = i.$[1];
        const itemName = slug(i.$[2].toString(), "_");
        const name = itemNameById.has(id)
          ? itemNameById.get(id)?.name ?? itemName
          : itemName;
        return {
          id,
          itemName,
          name,
        };
      })
  );

  return { itemByName: new Map(items.map((i) => [i.itemName, i])) };
}
