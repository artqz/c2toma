import { tuple, z } from "zod";

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

export const Sex = z.enum(["MALE", "FEMALE"]);
export const Race = z.enum([
  "HUMAN",
  "ELF",
  "DARK_ELF",
  "ORC",
  "DWARF",
  "KAMAEL",
  "ERTHEIA",
  "ANIMAL",
  "BEAST",
  "BUG",
  "CASTLE_GUARD",
  "CONSTRUCT",
  "DEMONIC",
  "DIVINE",
  "DRAGON",
  "ELEMENTAL",
  "ETC",
  "FAIRY",
  "GIANT",
  "HUMANOID",
  "MERCENARY",
  "NONE",
  "PLANT",
  "SIEGE_WEAPON",
  "UNDEAD",
  "MONSTER", // нужно понять что за говно в ц1
]);

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
    sex: Sex,
    race: Race,
    acquire: z.object({
      $: z.object({
        exp: z.number(),
        sp: z.number(),
        attributeExp: z.number().optional(),
      }),
    }),
    stats: z.object({
      $: z.object({
        str: z.number(),
        int: z.number(),
        dex: z.number(),
        wit: z.number(),
        con: z.number(),
        men: z.number(),
      }),
      vitals: z.object({
        $: z.object({
          hp: z.number(),
          hpRegen: z.number(),
          mp: z.number(),
          mpRegen: z.number(),
        }),
      }),
      attack: z.object({
        $: z.object({
          magical: z.number().optional(),
          random: z.number().optional(),
          physical: z.number().optional(),
          critical: z.number().optional(),
          accuracy: z.number().optional(),
          attackSpeed: z.number().optional(),
          reuseDelay: z.number().optional(),
          type: z.string().optional(),
          range: z.number().optional(),
          distance: z.number().optional(),
          width: z.number().optional(),
        }),
      }),
      defence: z.object({
        $: z.object({
          physical: z.number(),
          magical: z.number(),
        }),
      }),
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
        drop: Drop.optional(),
        spoil: Spoil.optional(),
      })
      .optional(),
  }),
});

export type Npc = z.infer<typeof Npc>;
export type Sex = z.infer<typeof Sex>;
export type Race = z.infer<typeof Race>;
export type Drop = z.infer<typeof Drop>;
export type DropGroup = z.infer<typeof DropGroup>;
export type Spoil = z.infer<typeof Spoil>;
export type DropSpoilItem = z.infer<typeof DropSpoilItem>;
