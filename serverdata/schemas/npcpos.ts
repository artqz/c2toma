import { z } from "zod";

const Territory = z.object({
  $: z.object({
    name: z.string(),
    minZ: z.number(),
    maxZ: z.number(),
  }),
  node: z
    .object({
      $: z.object({
        x: z.number(),
        y: z.number(),
      }),
    })
    .array(),
});

export const NpcPos = z.object({
  spawn: z.object({
    territories: z.object({
      territory: Territory.array(),
    }),
    npc: z
      .object({
        $: z.object({
          //id: z.number(),
          id: z.string(),
          count: z.number(),
          respawnTime: z.string(),
        }),
      })
      .array(),
  }),
});

export type NpcPos = z.infer<typeof NpcPos>;
export type Territory = z.infer<typeof Territory>;
