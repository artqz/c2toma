import Fs from "fs";
import fetch from "node-fetch";
import z from "zod";

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

type Chronicle = "c1" | "c2";

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
        console.log("---- success, npcId", npcId);
        return data;
      } else {
        console.log("---- retry (bad status), npcId", npcId);
        await new Promise((resolve) => setTimeout(resolve, 10000));
        await getMap({ npcId, chronicle });
      }
    } catch (e) {
      console.log("---- retry (error), npcId", npcId);
      await new Promise((resolve) => setTimeout(resolve, 10000));
      await getMap({ npcId, chronicle });
    }
  } else {
    console.log("----- такой файл есть!", path);
  }
}

async function init() {
  const npcs = await getTomaNpcs();
  // console.log(npcs);
  const mapC1 = new Map<number, string>();

  for (const npcId of npcs) {
    const map = await getMap({ npcId, chronicle: "c2" });
    // console.log(map);
  }
  console.log("finish");
}

init();

function saveFile(path: string, data: string) {
  return Fs.writeFileSync(path, data);
}

function checkFile(path: string) {
  return !Fs.existsSync(path);
}
