import { loadQuestsData } from "../../../datapack/il/questdata";
import { Npc } from "../../../result/types";
import { z } from "zod";
import { saveFile } from "../../../utils/Fs";
import { stringify } from "yaml";
import slug from "slug";

const QuestInfo = z.object({
  id: z.number(),
  name: z.object({ en: z.string(), ru: z.string() }),
  desc: z.object({ en: z.string(), ru: z.string() }),
  type: z.enum(["one_time", "repeatable"]),
  requirements: z.unknown(),
  startNPC: z.nullable(z.union([z.string().array(), z.string()])),
  level: z.nullable(z.union([z.number(), z.string()])),
  reward: z.object({
    exp: z.nullable(z.number().optional()),
    sp: z.nullable(z.number().optional()),
    items: z.nullable(z.number().array().optional()),
  }),
  questItems: z.array(z.number()),
  walkthrough: z.object({
    en: z.string().array(),
    ru: z.string().array().optional(),
  }),
});

export type QuestInfo = z.infer<typeof QuestInfo>;

function generateNpcNAmeInWalkthrough(deps: {
  npcs: Map<number, Npc>;
  walkthroughs: string[];
}) {
  const wEn = [];
  for (let walkthrough of deps.walkthroughs) {
    const huy = walkthrough.replace(/\{npc:(\d+)\}/g, (match, p1) => {
      const int = parseInt(p1);
      const npc = deps.npcs.get(int);
      if (npc) {
        return `{npc:${npc.npcName}}`;
      } else {
        return `{npc:${p1}}`;
      }
    });
    wEn.push(huy);
  }
  return wEn;
}

export function loadNewQuestData(deps: { npcs: Map<number, Npc> }) {
  const questdata = loadQuestsData();
  let newArr: QuestInfo[] = [];

  for (const quest of questdata) {
    if (!quest.startNPC) {
      newArr.push({ ...quest, startNPC: null });
    } else if (typeof quest.startNPC === "number") {
      const npc = deps.npcs.get(quest.startNPC);
      if (npc) {
        newArr.push({ ...quest, startNPC: npc.npcName });
      }
    } else {
      const npcNames: string[] = [];
      for (const _npc of quest.startNPC) {
        const npc = deps.npcs.get(_npc);
        if (npc) {
          npcNames.push(npc.npcName);
        }
        newArr.push({ ...quest, startNPC: npcNames });
      }
    }

    quest.walkthrough.en = generateNpcNAmeInWalkthrough({
      ...deps,
      walkthroughs: quest.walkthrough.en,
    });
    quest.walkthrough.ru =
      quest.walkthrough.ru &&
      generateNpcNAmeInWalkthrough({
        ...deps,
        walkthroughs: quest.walkthrough.ru,
      });
  }

  for (const q of newArr) {
    saveFile(
      `result/quests/c4/${
        q.walkthrough.ru ? slug(q.id + "-" + q.name.en) : q.id
      }.yaml`,
      stringify(q)
    );
  }
  return [];
}
