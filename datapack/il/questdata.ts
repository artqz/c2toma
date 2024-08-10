import Path from "path";
import Fs from "fs";
import { z } from "zod";
import { parse } from "yaml";

const QuestInfo = z.object({
  id: z.number(),
  name: z.object({ en: z.string(), ru: z.string() }),
  desc: z.object({ en: z.string(), ru: z.string() }),
  type: z.enum(["one_time", "repeatable"]),
  requirements: z.unknown(),
  startNPC: z.nullable(z.union([z.number().array(), z.number()])),
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
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type QuestInfo = z.infer<typeof QuestInfo>;

function getQuestInfo(path: string, filename: string) {
  const src = Fs.readFileSync(Path.join(path, filename), "utf8");
  const infos = parse(src);

  return QuestInfo.parse(infos);
}

export function loadQuestsData() {
  const path = "datapack/il/quests";
  const entries = Fs.readdirSync(path, "utf8");
  const result = entries.filter((file) => Path.extname(file) === ".yaml");

  const quests = new Map<number, QuestInfo>();
  for (const filename of result) {
    const quest = getQuestInfo(path, filename);
    quests.set(quest.id, quest);
  }

  return Array.from(quests.values());
}
