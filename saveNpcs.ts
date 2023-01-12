import fetch from "node-fetch";
import z from "zod";
import { checkFile, saveFile } from './utils/Fs';

const NpcsDataEntry = z.object({
  npc: z.object({
    npcClassId: z.number(),
  }),
});
type NpcsDataEntry = z.infer<typeof NpcDataEntry>;

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

export const NpcDataEntry = z.object({
  npcData: z.object({
    npcClassId:z.number(),
    level:z.number(),
    npcType:z.number(),
    acquireExpRate:z.number(),
    acquireSp:z.number(),
    skillList: z.array(z.object({ skillId: z.number(), skillLevel: z.number()})),
    corpseMakeList: z.array(z.object({ itemClassId: z.number(), min: z.number(), max: z.number(), chance:z.number()})),
    additionalMakeList: z.array(z.object({ itemClassId: z.number(), min: z.number(), max: z.number(), chance:z.number()})),
    additionalMakeMultiList:z.array(z.object({ itemClassId: z.number(), min: z.number(), max: z.number(), chance:z.number()})),
    orgHp:z.number(),
    orgMp:z.number(),
    baseDefend:z.number(),
    baseMagicAttack:z.number(),
    baseMagicDefend:z.number(),
    basePhysicalAttack:z.number(),
    physicalHitModify:z.number(),
    physicalAvoidModify:z.number(),
    baseAttackSpeed:z.number(),
    baseCritical:z.number(),
    social:z.boolean(),
  }),
  drop: z.array(z.object({
    npcId: z.number(),
    min:z.number(),
    max:z.number(),
    chance:z.number(),
    crystal: z.object({
      itemClassId: z.number(),
      crystalType: z.enum(["NoGrade", "D", "C", "B", "A", "S"])
    }),
    npcType: z.number()
  })),
  spoil: z.array(z.object({
    npcId: z.number(),
    min:z.number(),
    max:z.number(),
    chance:z.number(),
    crystal: z.object({
      itemClassId: z.number(),
      crystalType: z.enum(["NoGrade", "D", "C", "B", "A", "S"])
    }),
    npcType: z.number()
  })),
});
type NpcDataEntry = z.infer<typeof NpcDataEntry>;


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