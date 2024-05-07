import { object, z } from "zod";
import { loadNpcs } from "../import/с1/npcs";
import { Chronicle } from "../import/types";
import { loadSkills } from "../import/с1/skills";
import { loadItems } from "../import/с1/items";

const Npc = z.object({
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
      drop: z
        .object({
          group: z.object({
            $: z.object({ chance: z.number() }),
            item: z.object({
              $: z.object({
                id: z.number(),
                min: z.number(),
                max: z.number(),
                chance: z.number(),
              }),
            }),
          }),
        })
        .optional(),
    })
    .optional(),
});

type Npc = z.infer<typeof Npc>;

export function npcdataC1() {
  const chronicle: Chronicle = "c1";
  const skills = loadSkills({ chronicle });
  const items = loadItems({ chronicle });
  const npcs = loadNpcs({ chronicle, items, skills });

  for (const npc of npcs) {
  }
  const t = Npc.array().parse(
    Array.from(npcs.values()).map((npc): Npc => {
      return {
        $: {
          id: npc.id,
          level: npc.level ?? 1,
          type: "Monster",
          name: npc.name.en,
          ...(npc.nick.en !== "" && { title: npc.nick.en }),
        },
        collision: {
          radius: {
            $: {
              normal: npc.collisionRadius[0],
              ...(npc.collisionRadius[0] !== npc.collisionRadius[1] && {
                grown: npc.collisionRadius[1],
              }),
            },
          },
          height: {
            $: {
              normal: npc.collisionHeight[0],
              ...(npc.collisionHeight[0] !== npc.collisionHeight[1] && {
                grown: npc.collisionHeight[1],
              }),
            },
          },
        },
        dropLists: {},
      };
    })
  );
  console.log(t);
}
