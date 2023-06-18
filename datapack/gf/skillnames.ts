import { parse as parseCsv } from "csv-parse/sync";
import Fs from "fs";
import { z } from "zod";

export type SkillNameEntry = {
  id: number;
  level: number;
  name: { en: string; ru: string };
  desc: { en: string; ru: string };
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
  const json = parseCsv(
    Fs.readFileSync("datapack/gf/skillname-e.txt", "utf8"),
    {
      delimiter: "\t",
      relaxQuotes: true,
      columns: true,
      bom: true,
    }
  );

  const jsonRu = parseCsv(
    Fs.readFileSync("datapack/gf/skillname-ru.txt", "utf8"),
    {
      delimiter: "\t",
      relaxQuotes: true,
      columns: true,
      bom: true,
    }
  );

  let data = EntryGF.array().parse(json);
  let dataRu = EntryGF.array().parse(jsonRu);

  const langRuById = new Map(dataRu.map((d) => [d.id + "_" + d.level, d]));

  return data.map((x) => {
    const itemName: SkillNameEntry = {
      id: parseInt(x.id),
      name: { en: cleanStr(x.name), ru: "" },
      level: parseInt(x.level),
      desc: { en: cleanStr(x.description), ru: "" },
    };

    const ru = langRuById.get(x.id + "_" + x.level);
    if (ru) {
      itemName.name.ru = cleanStr(ru.name);
      itemName.desc.ru = cleanStr(ru.description);
    }

    return itemName;
  });
}
