import fetch from "node-fetch";
import z from "zod";
import slug from "slug";
import { checkFile, loadFile, saveFile } from "./utils/Fs";
import { profNames } from "./utils/originalProfs";

const races = ["Human", "Elf", "Dark Elf", "Orc", "Dwarf"];

const ClassDataEntry = z.object({
  id: z.number(),
  name: z.string(),
  childs: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      childs: z.array(
        z.object({
          id: z.number(),
          name: z.string(),
        })
      ),
    })
  ),
});
type ClassDataEntry = z.infer<typeof ClassDataEntry>;

type Prof = {
  id: number;
  name: string;
  childs: Prof[];
};

async function getTomaClasses() {
  const path = `datapack/toma/classes/races.json`;
  let classes: ClassDataEntry[][] = [];
  if (checkFile(path)) {
    for (const race of races) {
      const res = await fetch(
        `https://knowledgedb-api.elmorelab.com/database/getProfessionsByRace?race=${race}&alias=c2`
      );
      const json = await res.json();
      const data = ClassDataEntry.array().parse(json);

      classes.push(data);
    }

    saveFile(path, JSON.stringify(classes));
  } else {
    classes = JSON.parse(loadFile(path));
  }

  for (const prof of classes) {
    const profz = getClass(prof as Prof[]);
    await getProfSkills({ profs: profz });
  }

  console.log("Finish");

  return classes;
}

getTomaClasses();

type NorProf = {
  id: number;
  profName: string;
  parent?: string;
};

function getClass(
  classes: Prof[],
  ret?: Map<string, NorProf>,
  parentId?: number
) {
  const profs: Map<string, NorProf> = ret ? ret : new Map<string, NorProf>();

  for (const prof of classes) {
    const profId = prof.id;
    const profOrig = profNames.get(profId + 1);
    if (profOrig) {
      profs.set(profOrig.profName, {
        id: profId,
        profName: profOrig.profName,
        parent: parentId ? profNames.get(parentId + 1)?.profName : undefined,
      });
      if (prof["childs"] !== undefined) {
        getClass(prof.childs, profs, profId);
      }
    }
  }

  return profs;
}

const SkillDataEntry = z.object({
  name: z.number().optional(),
  skill: z
    .object({
      skillId: z.number(),
      skillLevel: z.number(),
      isMagic: z.boolean(),
      operateType: z.number(),
      getLv: z.number(),
      lvUpSp: z.number(),
      autoGet: z.boolean(),
      itemNeeded: z.number(),
      hp: z.number(),
      mp: z.number(),
      range: z.number(),
    })
    .optional(),
});

type SkillDataEntry = z.infer<typeof SkillDataEntry>;

async function getProfSkills(deps: { profs: Map<string, NorProf> }) {
  let profAndSkills: {
    id: number;
    profName: string;
    parent: string | null;
    skills: SkillDataEntry["skill"][];
  }[] = [];
  for (const prof of Array.from(deps.profs.values())) {
    const path = `datapack/toma/classes/${prof.profName}.json`;
    if (checkFile(path)) {
      const res = await fetch(
        `https://knowledgedb-api.elmorelab.com/database/getSkillsByClassType?alias=c2&classType=${prof.id}`
      );
      const json = await res.json();
      const data = SkillDataEntry.array().parse(json);
      const object: {
        id: number;
        profName: string;
        parent: string | null;
        skills: SkillDataEntry["skill"][];
      } = {
        id: prof.id,
        profName: prof.profName,
        parent: prof.parent ?? null,
        skills: data.filter((x) => "skill" in x).map((x) => x.skill),
      };
      profAndSkills.push(object);

      saveFile(path, JSON.stringify(object));
    } else {
      console.log("Класс загружен", prof.profName);
    }
  }

  // return new Map(profAndSkills.map((x) => [profName, x]));
}
