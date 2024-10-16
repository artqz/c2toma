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
        _com: z.string().optional(),
        $: z.object({
          //id: z.number(),
          id: z.number(),
          count: z.number(),
          respawnTime: z.string(),
          x: z.number().optional(),
          y: z.number().optional(),
          z: z.number().optional(),
          heading: z.number().optional(),
        }),
      })
      .array(),
  }),
});

export type NpcPos = z.infer<typeof NpcPos>;
export type Territory = z.infer<typeof Territory>;
