import { z } from "zod";

const DropSpoilItem = z.object({
  _com: z.string().optional(),
  $: z.object({
    id: z.number(),
    min: z.number(),
    max: z.number(),
    chance: z.number(),
  }),
});

const DropGroup = z.object({
  $: z.object({ chance: z.number() }),
  item: DropSpoilItem.array(),
});

const Drop = z.object({
  group: DropGroup.array(),
});

const Spoil = z.object({
  item: DropSpoilItem.array(),
});

const Ai = z.object({
  $: z.object({
    type: z.string().optional(),
    aggroRange: z.number().optional(),
    clanHelpRange: z.number().optional(),
    isChaos: z.boolean().optional(),
    isAggressive: z.boolean().optional(),
  }),
  clanList: z
    .object({
      clan: z.string(),
    })
    .optional(),
});

export const Npc = z.object({
  npc: z.object({
    _com: z.string().optional(),
    $: z.object({
      id: z.number(),
      displayId: z.number().optional(),
      level: z.number(),
      type: z.string(),
      name: z.string().optional(),
      usingServerSideName: z.boolean().optional(),
      title: z.string().optional(),
      usingServerSideTitle: z.boolean().optional(),
      element: z.string().optional(),
    }),
    ai: Ai,
    collision: z.object({
      radius: z.object({
        $: z.object({
          normal: z.number(),
          grown: z.number().optional(),
        }),
      }),
      height: z.object({
        $: z.object({
          normal: z.number(),
          grown: z.number().optional(),
        }),
      }),
    }),
    dropLists: z
      .object({
        drop: Drop,
        spoil: Spoil,
      })
      .optional(),
  }),
});

export type Npc = z.infer<typeof Npc>;
export type Drop = z.infer<typeof Drop>;
export type DropGroup = z.infer<typeof DropGroup>;
export type Spoil = z.infer<typeof Spoil>;
export type DropSpoilItem = z.infer<typeof DropSpoilItem>;
