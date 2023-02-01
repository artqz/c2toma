import { parse as parseCsv } from "csv-parse/sync";
import Fs from "fs";
import { z } from "zod";

type SkillNameEntry = {
  id: number;
  level: number;
  name: string;
  desc: string;
};

function cleanStr(s: string) {
  const left = s.match(/[au],(.*?)$/)?.[1] ?? s;
  const right = left.match(/^(.*?)(\\\\n)?\\0/)?.[1] ?? left;
  return right;
}

const EntryGF = z.object({
  id: z.string(),
  level: z.string(),
  name: z.string(),
  description: z.string(),
  desc_add1: z.string(),
  desc_add2: z.string(),
});

export function loadSkillNamesGF(): SkillNameEntry[] {

  const json = parseCsv(Fs.readFileSync("datapack/gf/skillname-e.txt", "utf8"), {
    delimiter: "\t",
    relaxQuotes: true,
    columns: true,
    bom: true,
  });

  let data = EntryGF.array().parse(json);

  return data.map((x) => ({
    id: parseInt(x.id),
    name: cleanStr(x.name),
    level: parseInt(x.level),
    desc: cleanStr(x.description),
  }));
}
