import Fs from "fs";
import { z } from "zod";
import { Builder } from "../lib/build";
import { loadNpcs } from "../import/с1/npcs";
import { Chronicle } from "../import/types";
import { loadSkills } from "../import/с1/skills";
import { loadItems } from "../import/с1/items";
import { NpcDrop } from "../result/types";

const Drop = z.object({
  group: z
    .object({
      $: z.object({ chance: z.number() }),
      item: z
        .object({
          _com: z.string().optional(),
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

const Spoil = z.object({
  item: z
    .object({
      _com: z.string().optional(),
      $: z.object({
        id: z.number(),
        min: z.number(),
        max: z.number(),
        chance: z.number(),
      }),
    })
    .array(),
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

const Npc = z.object({
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
    dropLists: z.object({ drop: Drop, spoil: Spoil }),
  }),
});

type Npc = z.infer<typeof Npc>;
type Drop = z.infer<typeof Drop>;
type Spoil = z.infer<typeof Spoil>;

export function npcdataC1() {
  const chronicle: Chronicle = "c1";
  const skills = loadSkills({ chronicle });
  const items = loadItems({ chronicle });
  const npcs = loadNpcs({ chronicle, items, skills });

  function drop(list: [NpcDrop[], number][] | undefined): Drop {
    return {
      group: (list ?? []).map((g) => {
        return {
          $: { chance: g[1] },
          item: g[0].map((i) => {
            return {
              _com: i.itemName,
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

  function spoil(list: NpcDrop[]): Spoil {
    return {
      item: (list ?? []).map((i) => {
        return {
          _com: i.itemName,
          $: {
            id: i.itemId,
            min: i.countMin,
            max: i.countMax,
            chance: i.chance,
          },
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
          ai: {
            $: {
              clanHelpRange: npc.clanHelpRange,
              aggroRange: npc.agroRange ?? undefined,
            },
            ...(npc.clan && { clanList: { clan: npc.clan } }),
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
          dropLists: {
            drop: drop(npc.newDropList),
            spoil: spoil(npc.spoilList),
          },
        },
      };
    })
  );

  // var builder = new xml2js.Builder();
  const builder = new Builder({
    attrkey: "$",
    charkey: "_",
    rootName: "root",
    cdata: true,
    com: "_com",
    // Другие параметры...
  });
  var xml = builder.buildObject(t);

  Fs.writeFileSync("./result/server/c1/npcs.xml", xml);
}
