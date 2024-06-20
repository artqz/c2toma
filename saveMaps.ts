import fetch from "node-fetch";
import z from "zod";
import { checkFile, saveFile } from "./utils/Fs";

const NpcDataEntry = z.object({
  npc: z.object({
    npcClassId: z.number(),
  }),
});
type NpcDataEntry = z.infer<typeof NpcDataEntry>;

async function getTomaNpcs() {
  const res = await fetch(
    "https://knowledgedb-api.elmorelab.com/database/getNpc?alias=c2&minlevel=1&maxLevel=10000"
  );
  const json = await res.json();
  const data = NpcDataEntry.array().parse(json);

  const npcs: number[] = [];

  for (const npc of data) {
    npcs.push(npc.npc.npcClassId);
  }

  return npcs;
}

const MapDataEntry = z.object({
  map: z.string(),
});
type MapDataEntry = z.infer<typeof NpcDataEntry>;

type Chronicle = "c1" | "c2" | "c4";

async function getMap(props: { npcId: number; chronicle: Chronicle }) {
  const { npcId, chronicle } = props;
  const path = `maps/${chronicle}/${npcId}.json`;

  if (checkFile(path)) {
    try {
      const res = await fetch(
        `https://knowledgedb-api.elmorelab.com/database/getMap?alias=${chronicle}&npcId=${npcId}`
      );

      if (res.ok) {
        const json = await res.json();
        const data = MapDataEntry.parse(json);
        saveFile(path, JSON.stringify(data));
        console.log(`[success]: ${chronicle} , npcId: ${npcId}`);
        return data;
      } else {
        console.log(`[fail]: bad status ${chronicle} , npcId: ${npcId}`);
        await new Promise((resolve) => setTimeout(resolve, 10000));
        await getMap({ npcId, chronicle });
      }
    } catch (e) {
      console.log(`[fail]: ${chronicle} , npcId: ${npcId}`);
      await new Promise((resolve) => setTimeout(resolve, 10000));
      await getMap({ npcId, chronicle });
    }
  } else {
    console.log("[success]: file loaded", path);
  }
}

async function init() {
  const npcs = await getTomaNpcs();
  const chronicles: Chronicle[] = ["c1", "c2", "c4"];
  for (const chronicle of chronicles) {
    for (const npcId of npcs) {
      await getMap({ npcId, chronicle });
    }
  }

  console.log("[success]: finish");
}

init();
