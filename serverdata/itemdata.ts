import Fs from "fs";
import slug from "slug";
import { ItemEntryC1, loadItemDataC1 } from "../datapack/c1/itemdata";
import { Item, ItemData } from "./schemas/items";
import { loadItemNamesC1 } from "../datapack/c1/itemnames";
import { Builder } from "../lib/build";
import { getType } from "./getters/items";

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

  genXML({ itemdata, itemNameById });

  return { itemByName: new Map(items.map((i) => [i.itemName, i])) };
}

function genXML(deps: {
  itemdata: ItemEntryC1[];
  itemNameById: Map<number, { id: number; name: string; description: string }>;
}) {
  const items = ItemData.array().parse(
    deps.itemdata
      .filter((i) => i.item_type)
      .map((i): ItemData => {
        const { name } = deps.itemNameById.get(i.$[1]) ?? {
          name: i.$[2].toString(),
        };
        return {
          item: {
            $: {
              id: i.$[1],
              name,
              type: getType(i.item_type!),
              // icon: "",
            },

            ...(i.weight && {
              weight: {
                _: i.weight,
              },
            }),
            ...(i.default_price && {
              defaultPrice: {
                _: i.default_price,
              },
            }),
            ...(i.soulshot_count &&
              i.spiritshot_count && {
                shots: {
                  $: {
                    soul: i.soulshot_count,
                    spirit: i.spiritshot_count,
                  },
                },
              }),
            stats: { stat: [{ $: { type: "mAtk" } }] },
            ...(i.is_trade && { isTrade: { _: Boolean(i.is_trade) } }),
            ...(i.is_drop && { isDrop: { _: Boolean(i.is_drop) } }),
            ...(i.is_destruct && { isDestruct: { _: Boolean(i.is_destruct) } }),
          },
        };
      })
  );

  const builder = new Builder({
    attrkey: "$",
    charkey: "_",
    rootName: "list",
    cdata: true,
    com: "_com",
    // Другие параметры...
  });

  var xml = builder.buildObject(items);

  Fs.writeFileSync("./result/server/c1/itemdata.xml", xml);

  console.log("ItemData saved.");
}
