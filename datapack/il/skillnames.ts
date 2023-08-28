import { parse as parseCsv } from "csv-parse/sync";
import Fs from "fs";
import { z } from "zod";
import { SkillNameEntry } from "../types";

function cleanStr(s: string) {
  const left = s.match(/[au],(.*?)$/)?.[1] ?? s;
  const right = left.match(/^(.*?)(\\\\n)?\\0/)?.[1] ?? left;
  return right;
}

const EntryIL = z.object({
  id: z.string(),
  level: z.string(),
  name: z.string(),
  description: z.string(),
  desc_add1: z.string(),
  desc_add2: z.string(),
});

export function loadSkillNamesIL(): SkillNameEntry[] {
  const json = parseCsv(
    Fs.readFileSync("datapack/il/skillname-e.txt", "utf8"),
    {
      delimiter: "\t",
      relaxQuotes: true,
      columns: true,
      bom: true,
    }
  );

  let data = EntryIL.array().parse(json);

  return data.map((x) => ({
    id: parseInt(x.id),
    name: { ru: cleanStr(x.name), en: cleanStr(x.name) },
    level: parseInt(x.level),
    desc: { ru: cleanStr(x.description), en: cleanStr(x.description) },
  }));
}
