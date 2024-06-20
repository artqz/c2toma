import { z } from "zod";
import Fs, { loadFile, saveFile } from "./utils/Fs";
import { Chronicle } from "./import/types";
import { loadNpcNamesC3 } from "./datapack/c3/npcnames";
import { loadNpcNamesC2 } from "./datapack/c2/npcnames";
import { NpcSpawn, Point } from "./result/types";

const VERSION: Chronicle = "c3";

function loadMapFromJson(npcId: number, chronicle: Chronicle) {
  // console.log(chronicle, npcId);

  return loadFile(`maps/${chronicle}/${npcId}.json`) !== "none"
    ? MapDataEntry.parse(
        JSON.parse(loadFile(`maps/${chronicle}/${npcId}.json`))
      ).map
    : undefined;
}

function init(chronicle: Chronicle) {
  switch (chronicle) {
    case "c3":
      return check("c3", "c1", "c4");
    default:
      break;
  }
}

function check(
  currentChronicle: Chronicle,
  prevChronicle: Chronicle,
  nextChronicle: Chronicle
) {
  let npcNames: NpcNameEntry[] = [];
  switch (currentChronicle) {
    case "c2":
      npcNames = loadNpcNamesC2();
      break;
    case "c3":
      npcNames = loadNpcNamesC3();
      break;
  }
  let npcsCurrentChronicle = new Set<number>();
  let npcsPrevChronicle = new Set<number>();
  let npcsNextChronicle = new Set<number>();

  for (const npcName of npcNames) {
    const npcMapPrevChronicle = loadMapFromJson(npcName.id, prevChronicle);
    const npcMapCurrentChronicle = loadMapFromJson(
      npcName.id,
      currentChronicle
    );
    const npcMapNextChronicle = loadMapFromJson(npcName.id, nextChronicle);

    if (npcMapCurrentChronicle !== undefined) {
      if (npcMapCurrentChronicle === npcMapNextChronicle) {
        npcsNextChronicle.add(npcName.id);
      } else if (npcMapCurrentChronicle === npcMapPrevChronicle) {
        npcsPrevChronicle.add(npcName.id);
      } else {
        npcsCurrentChronicle.add(npcName.id);
      }
    } else {
      console.log("На хуй такую позицию " + npcName.id);
    }
  }
  const npcList = new Map<number, Npc>();

  addCurrentChroniclePos(
    currentChronicle,
    Array.from(npcsCurrentChronicle.values()),
    npcList
  );

  return saveFile(
    `datapack/${currentChronicle}/npcpos.json`,
    JSON.stringify(Array.from(npcList.values()), null, 2)
  );
}

function loadNpcPosJson(path: string): NpcPosEntry {
  const src = Fs.readFileSync(path, "utf8");
  const json = JSON.parse(src);
  let data = NpcPosEntry.parse(json);

  return data;
}

function addCurrentChroniclePos(
  chronicle: Chronicle,
  array: number[],
  npcList: Map<number, Npc>
) {
  const CVPositions = loadNpcPosComputerVision(chronicle);

  for (const npcId of array) {
    CVPositions &&
      npcList.set(npcId, {
        id: npcId,
        spawns: CVPositions[`${npcId}.png`].map((x) => {
          return {
            pos: x.map((pos) => {
              const x = (pos[0] - 655 - 5) / 0.005;
              const y = (pos[1] - 1150 - 160) / 0.005;
              const z = 0;
              return { x, y, z };
            }),
          };
        }),
      });
  }

  console.log("Computer Vision added.");
}

export function loadNpcPosComputerVision(chronicle: Chronicle) {
  switch (chronicle) {
    case "c3":
      return loadNpcPosJson("datapack/c3/spawns.json");
  }
}

const MapDataEntry = z.object({
  map: z.string(),
});
type MapDataEntry = z.infer<typeof MapDataEntry>;

type NpcNameEntry = {
  id: number;
  name: string;
  nick: string;
  nickcolor: "default" | "quest" | "raid";
};

const NpcPosEntry = z.record(
  z.array(z.array(z.tuple([z.number(), z.number()])))
);

type NpcPosEntry = z.infer<typeof NpcPosEntry>;

type Npc = { id: number; spawns: NpcSpawn[] };

init(VERSION);
