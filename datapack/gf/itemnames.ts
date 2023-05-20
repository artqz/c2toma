import { parse as parseCsv } from "csv-parse/sync";
import Fs from "fs";
import { z } from "zod";

type lstring = {
  en: string;
  ru: string;
};
type ItemNameEntry = {
  id: number;
  add_name: lstring;
  name: lstring;
  desc: string;
};

function cleanStr(s: string) {
  const left = s.match(/[au],(.*?)$/)?.[1] ?? s;
  const right = left.match(/^(.*?)(\\\\n)?\\0/)?.[1] ?? left;
  return right;
}

const EntryGF = z.object({
  id: z.string(),
  name: z.string(),
  add_name: z.string(),
  description: z.string(),
});

export function loadItemNamesGF(): ItemNameEntry[] {
  const json = parseCsv(Fs.readFileSync("datapack/gf/itemname-e.txt", "utf8"), {
    delimiter: "\t",
    relaxQuotes: true,
    columns: true,
    bom: true,
  });

  const jsonRu = parseCsv(
    Fs.readFileSync("datapack/gf/itemname-ru.txt", "utf8"),
    {
      delimiter: "\t",
      relaxQuotes: true,
      columns: true,
      bom: true,
    }
  );

  let data = EntryGF.array().parse(json);
  let dataRu = EntryGF.array().parse(jsonRu);

  const langRuById = new Map(dataRu.map((d) => [d.id, d]));

  return data.map((x) => {
    const itemName: ItemNameEntry = {
      id: parseInt(x.id),
      name: { en: cleanStr(x.name), ru: "" },
      add_name: { en: cleanStr(x.add_name), ru: "" },
      desc: cleanStr(x.description),
    };

    const ru = langRuById.get(x.id);
    if (ru) {
      itemName.name.ru = cleanStr(ru.name);
      itemName.add_name.ru = cleanStr(ru.add_name);
    }

    return itemName;
  });
}
