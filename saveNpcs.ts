import fetch from "node-fetch";
import z from "zod";
import { NpcDataEntry, NpcsDataEntry } from './import/types';
import { checkFile, saveFile } from './utils/Fs';


async function getTomaNpcs() {
  const res = await fetch(
    "https://knowledgedb-api.elmorelab.com/database/getNpc?alias=c2&minlevel=1&maxLevel=10000"
  );
  const json = await res.json();
  const data = NpcsDataEntry.array().parse(json);

  const npcs: number[] = [];

  for (const npc of data) {
    npcs.push(npc.npc.npcClassId);
  }

  return npcs;
}

async function getNpc(npcId: number) {

  const path = `npcs/c2/${npcId}.json`;

  if (checkFile(path)) {
    try {
      const res = await fetch(
        `https://knowledgedb-api.elmorelab.com/database/getNpcDetail?alias=c2&npcId=${npcId}`
      );

      if (res.ok) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        const json = await res.json();
        const data = NpcDataEntry.parse(json);
        saveFile(path, JSON.stringify(data));
        console.log(`[success]: c2, npcId: ${npcId}`);
        return data;
      } else {
        console.log(`[fail]: bad status c2, npcId: ${npcId}`);
        await new Promise((resolve) => setTimeout(resolve, 10000));
        await getNpc(npcId);
      }
    } catch (e) {
      console.log(`[fail]: c2, npcId: ${npcId}`);
      await new Promise((resolve) => setTimeout(resolve, 10000));
      await getNpc(npcId);
    }
  } else {
    console.log("[success]: file loaded", path);
  }
}


async function init() {
  const npcs = await getTomaNpcs();

  
    for (const npcId of npcs) {
    await getNpc(npcId);
  }
  
  
  console.log("[success]: finish");
}

init();