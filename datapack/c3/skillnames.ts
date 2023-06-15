import { parse as parseCsv } from "csv-parse/sync";
import Fs from "fs";
import { z } from "zod";

export type SkillNameEntry = {
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
});

export function loadSkillNamesC3(): SkillNameEntry[] {
  const json = parseCsv(
    Fs.readFileSync("datapack/c3/skillname-e.txt", "utf8"),
    {
      delimiter: "\t",
      relaxQuotes: true,
      columns: true,
      bom: true,
    }
  );

  let data = EntryGF.array().parse(json);

  return data.map((x) => {
    const itemName: SkillNameEntry = {
      id: parseInt(x.id),
      name: cleanStr(x.name),
      level: parseInt(x.level),
      desc: cleanStr(x.description),
    };
    return itemName;
  });
}
