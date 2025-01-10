import { Multisell } from "../../../result/types";

export function fixIlMultisell(multisell: Map<number, Multisell>) {
  ms.forEach((m) => {
    const _ms = multisell.get(m.id);
    if (_ms) {
    } else {
      multisell.set(m.id, m);
    }
  });
}

const ms: Multisell[] = [
  {
    id: 528,
    multisellName: "weapon_rent_for_newbie_5",
    sellList: [
      {
        requiredItems: [
          {
            itemName: "q_adventure_coupon1",
            count: 1,
          },
        ],
        resultItems: [
          {
            itemName: "guide_apprentice's_staff",
            count: 1,
          },
        ],
      },
      {
        requiredItems: [
          {
            itemName: "q_adventure_coupon1",
            count: 1,
          },
        ],
        resultItems: [
          {
            itemName: "guide_bone_club",
            count: 1,
          },
        ],
      },
      {
        requiredItems: [
          {
            itemName: "q_adventure_coupon1",
            count: 1,
          },
        ],
        resultItems: [
          {
            itemName: "guide_shining_knife",
            count: 1,
          },
        ],
      },
      {
        requiredItems: [
          {
            itemName: "q_adventure_coupon1",
            count: 1,
          },
        ],
        resultItems: [
          {
            itemName: "guide_cestus",
            count: 1,
          },
        ],
      },
      {
        requiredItems: [
          {
            itemName: "q_adventure_coupon1",
            count: 1,
          },
        ],
        resultItems: [
          {
            itemName: "guide_bow_of_forest",
            count: 1,
          },
        ],
      },
      {
        requiredItems: [
          {
            itemName: "q_adventure_coupon1",
            count: 1,
          },
        ],
        resultItems: [
          {
            itemName: "guide_long_sword",
            count: 1,
          },
        ],
      },
    ],
    npcList: [
      {
        npcName: "adventure_helper_01",
        show: true,
      },
    ],
  },
  {
    id: 529,
    multisellName: "weapon_rent_for_newbie_20",
    sellList: [
      {
        requiredItems: [
          {
            itemName: "q_adventure_coupon2",
            count: 1,
          },
        ],
        resultItems: [
          {
            itemName: "guide_mace_of_prayer",
            count: 1,
          },
        ],
      },
      {
        requiredItems: [
          {
            itemName: "q_adventure_coupon2",
            count: 1,
          },
        ],
        resultItems: [
          {
            itemName: "guide_dark_elven_bow",
            count: 1,
          },
        ],
      },
      {
        requiredItems: [
          {
            itemName: "q_adventure_coupon2",
            count: 1,
          },
        ],
        resultItems: [
          {
            itemName: "guide_long_bow",
            count: 1,
          },
        ],
      },
      {
        requiredItems: [
          {
            itemName: "q_adventure_coupon2",
            count: 1,
          },
        ],
        resultItems: [
          {
            itemName: "guide_staff_of_mana",
            count: 1,
          },
        ],
      },
      {
        requiredItems: [
          {
            itemName: "q_adventure_coupon2",
            count: 1,
          },
        ],
        resultItems: [
          {
            itemName: "guide_bastard_sword",
            count: 1,
          },
        ],
      },
      {
        requiredItems: [
          {
            itemName: "q_adventure_coupon2",
            count: 1,
          },
        ],
        resultItems: [
          {
            itemName: "guide_divine_tome",
            count: 1,
          },
        ],
      },
      {
        requiredItems: [
          {
            itemName: "q_adventure_coupon2",
            count: 1,
          },
        ],
        resultItems: [
          {
            itemName: "guide_single-edged_jamadhr",
            count: 1,
          },
        ],
      },
      {
        requiredItems: [
          {
            itemName: "q_adventure_coupon2",
            count: 1,
          },
        ],
        resultItems: [
          {
            itemName: "guide_tomahawk",
            count: 1,
          },
        ],
      },
      {
        requiredItems: [
          {
            itemName: "q_adventure_coupon2",
            count: 1,
          },
        ],
        resultItems: [
          {
            itemName: "guide_poniard_dagger",
            count: 1,
          },
        ],
      },
      {
        requiredItems: [
          {
            itemName: "q_adventure_coupon2",
            count: 1,
          },
        ],
        resultItems: [
          {
            itemName: "guide_pike",
            count: 1,
          },
        ],
      },
    ],
    npcList: [
      {
        npcName: "adventure_helper_01",
        show: true,
      },
    ],
  },
];
