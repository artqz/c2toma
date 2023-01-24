import { Item, Multisell, SellList } from "./../result/types";
import { loadMultisellDataC4 } from "./../datapack/c4/miltisell";

export function loadMultisell(deps: { items: Map<number, Item> }) {
  const itemByName = new Map(
    Array.from(deps.items.values()).map((item) => [item.itemName, item])
  );

  const multilisells = loadMultisellDataC4();

  const msArray: Multisell[] = [];

  for (const ms of multilisells) {
    const sellList = ms.selllist.$;
    const slArray: SellList[] = [];
    for (const sell of sellList) {
      const multisell = {
        requiredItems: sell.$[1].$.filter(
          (item) => itemByName.get(item.$[0]) && item
        ).map((item) => {
          return { itemName: item.$[0], count: item.$[1] };
        }),
        resultItems: sell.$[0].$.filter(
          (item) => itemByName.get(item.$[0]) && item
        ).map((item) => {
          return {
            itemName: item.$[0],
            count: item.$[1],
          };
        }),
      };

      //add adena
      if (sell.$[2]) {
        multisell.requiredItems.push({
          itemName: "adena",
          count: sell.$[2].$[0],
        });
      }

      if (!multisell.requiredItems.length || !multisell.resultItems.length) {
      } else {
        slArray.push(multisell);
      }
    }

    msArray.push({
      id: ms.$[1],
      multisellName: ms.$[0],
      sellList: slArray,
    });
  }

  console.log("Multisell loaded.");

  return new Map(
    msArray.filter((ms) => ms.sellList.length > 0).map((x) => [x.id, x])
  );
}
