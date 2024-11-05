import { Multisell } from "../../../result/types";

export function fixC5Multisell(multisell: Map<number, Multisell>) {
  ms.forEach((m) => {
    const _ms = multisell.get(m.id);
    if (_ms) {
      _ms.sellList.push(..._ms.sellList, ...m.sellList);
    }
  });
}

const ms = [
  {
    id: 2,
    multisellName: "blackmerchant_armor",
    sellList: [
      {
        requiredItems: [
          {
            itemName: "crystal_c",
            count: 100,
          },
          {
            itemName: "crystal_d",
            count: 500,
          },
        ],
        resultItems: [
          {
            itemName: "blue_soul_crystal_7",
            count: 1,
          },
        ],
      },
      {
        requiredItems: [
          {
            itemName: "crystal_c",
            count: 120,
          },
          {
            itemName: "crystal_d",
            count: 567,
          },
        ],
        resultItems: [
          {
            itemName: "blue_soul_crystal_8",
            count: 1,
          },
        ],
      },
      {
        requiredItems: [
          {
            itemName: "crystal_b",
            count: 44,
          },
          {
            itemName: "crystal_c",
            count: 135,
          },
        ],
        resultItems: [
          {
            itemName: "blue_soul_crystal_9",
            count: 1,
          },
        ],
      },
      {
        requiredItems: [
          {
            itemName: "crystal_b",
            count: 50,
          },
          {
            itemName: "crystal_c",
            count: 150,
          },
        ],
        resultItems: [
          {
            itemName: "blue_soul_crystal_10",
            count: 1,
          },
        ],
      },
      {
        requiredItems: [
          {
            itemName: "crystal_c",
            count: 100,
          },
          {
            itemName: "crystal_d",
            count: 500,
          },
        ],
        resultItems: [
          {
            itemName: "green_soul_crystal_7",
            count: 1,
          },
        ],
      },
      {
        requiredItems: [
          {
            itemName: "crystal_c",
            count: 120,
          },
          {
            itemName: "crystal_d",
            count: 567,
          },
        ],
        resultItems: [
          {
            itemName: "green_soul_crystal_8",
            count: 1,
          },
        ],
      },
      {
        requiredItems: [
          {
            itemName: "crystal_b",
            count: 44,
          },
          {
            itemName: "crystal_c",
            count: 135,
          },
        ],
        resultItems: [
          {
            itemName: "green_soul_crystal_9",
            count: 1,
          },
        ],
      },
      {
        requiredItems: [
          {
            itemName: "crystal_b",
            count: 50,
          },
          {
            itemName: "crystal_c",
            count: 150,
          },
        ],
        resultItems: [
          {
            itemName: "green_soul_crystal_10",
            count: 1,
          },
        ],
      },
      {
        requiredItems: [
          {
            itemName: "crystal_c",
            count: 100,
          },
          {
            itemName: "crystal_d",
            count: 500,
          },
        ],
        resultItems: [
          {
            itemName: "red_soul_crystal_7",
            count: 1,
          },
        ],
      },
      {
        requiredItems: [
          {
            itemName: "crystal_c",
            count: 120,
          },
          {
            itemName: "crystal_d",
            count: 567,
          },
        ],
        resultItems: [
          {
            itemName: "red_soul_crystal_8",
            count: 1,
          },
        ],
      },
      {
        requiredItems: [
          {
            itemName: "crystal_b",
            count: 44,
          },
          {
            itemName: "crystal_c",
            count: 135,
          },
        ],
        resultItems: [
          {
            itemName: "red_soul_crystal_9",
            count: 1,
          },
        ],
      },
      {
        requiredItems: [
          {
            itemName: "crystal_b",
            count: 50,
          },
          {
            itemName: "crystal_c",
            count: 150,
          },
        ],
        resultItems: [
          {
            itemName: "red_soul_crystal_10",
            count: 1,
          },
        ],
      },
    ],
  },
];
