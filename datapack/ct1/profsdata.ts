import { z } from "zod";
import Fs from "../../utils/Fs";
import { PROFS } from "./profs/profList";
import _ from "lodash";

export type Prof = {
  profName: string;
  parent: string | null;
  skills: ProfSkills[];
};

export type ProfSkills = z.infer<typeof ProfSkills>;

interface IProf {
  name: string;
  id: number;
  childs?: IProf[];
}

const Prof: z.ZodType<IProf> = z.lazy(() =>
  z.object({
    name: z.string(),
    id: z.number(),
    childs: z.array(Prof).optional(),
  })
);

const races = ["human", "elf", "delf", "orc", "dwarf", "kamael"];

export function loadRaces() {
  let porfMap: Prof[] = [];
  for (const race of races) {
    const json = JSON.parse(
      Fs.readFileSync(`datapack/ct1/profs/${race}.json`, "utf8")
    );
    const data = Prof.array().parse(json);

    porfMap = _.concat(porfMap, getProfs(data));
  }

  return porfMap;
}

function getProfs(profs: IProf[], parent?: number, arr?: Prof[]) {
  const porfMap: Prof[] = arr ?? [];
  for (const prof of profs) {
    const profSkills = loadSkills(prof.id);
    porfMap.push({
      profName: PROFS[prof.id],
      parent: parent !== undefined ? PROFS[parent] : null,
      skills: profSkills,
    });

    if (prof.childs) {
      getProfs(prof.childs, prof.id, porfMap);
    }
  }

  return porfMap;
}

const ProfSkills = z.object({
  skillID: z.number(),
  autoGet: z.boolean(),
  getLv: z.number(),
  itemNeeded: z.number(),
  lvUpSp: z.number(),
  isGroup: z.boolean(),
  skillLevel: z.number(),
  hp: z.number(),
  mp: z.number(),
  isMagic: z.boolean(),
});

export function loadSkills(id: number) {
  const json = JSON.parse(
    Fs.readFileSync(`datapack/ct1/profs/${id}.json`, "utf8")
  );
  const data = ProfSkills.array().parse(json);

  return data.filter((x) => !x.isGroup);
}

export function loadProfsDataCT1() {
  return loadRaces();
}
