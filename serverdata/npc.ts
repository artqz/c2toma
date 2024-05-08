import Fs from "fs";
import xml2js from "xml2js";
import { z } from "zod";
import { loadNpcs } from "../import/с1/npcs";
import { Chronicle } from "../import/types";
import { loadSkills } from "../import/с1/skills";
import { loadItems } from "../import/с1/items";
import { NpcDrop } from "../result/types";

const DropList = z.object({
  group: z
    .object({
      $: z.object({ chance: z.number() }),
      item: z
        .object({
          $: z.object({
            id: z.number(),
            min: z.number(),
            max: z.number(),
            chance: z.number(),
          }),
        })
        .array(),
    })
    .array(),
});

const Npc = z.object({
  npc: z.object({
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
    dropLists: z.object({ drop: DropList }),
  }),
});

type Npc = z.infer<typeof Npc>;
type DropList = z.infer<typeof DropList>;

export function npcdataC1() {
  const chronicle: Chronicle = "c1";
  const skills = loadSkills({ chronicle });
  const items = loadItems({ chronicle });
  const npcs = loadNpcs({ chronicle, items, skills });

  function dropList(list: [NpcDrop[], number][] | undefined): DropList {
    return {
      group: (list ?? []).map((g) => {
        return {
          $: { chance: g[1] },
          item: g[0].map((i) => {
            return {
              $: {
                id: i.itemId,
                min: i.countMin,
                max: i.countMax,
                chance: i.chance,
              },
            };
          }),
        };
      }),
    };
  }

  const t = Npc.array().parse(
    Array.from(npcs.values()).map((npc): Npc => {
      return {
        npc: {
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
          dropLists: { drop: dropList(npc.newDropList) },
        },
      };
    })
  );

  var builder = new xml2js.Builder();
  var xml = builder.buildObject(t);

  Fs.writeFileSync("./result/server/c1/npcs.xml", xml);
  console.log(t);
}
