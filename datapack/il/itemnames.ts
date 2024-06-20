import { parse as parseCsv } from "csv-parse/sync";
import Fs from "fs";
import { z } from "zod";
import { ItemNameEntry } from "../types";

function cleanStr(s: string) {
  const left = s.match(/[au],(.*?)$/)?.[1] ?? s;
  const right = left.match(/^(.*?)(\\\\n)?\\0/)?.[1] ?? left;
  return right;
}

const EntryIL = z.object({
  id: z.string(),
  name: z.string(),
  add_name: z.string(),
  description: z.string(),
});

export function loadItemNamesIL(): ItemNameEntry[] {
  const json = parseCsv(Fs.readFileSync("datapack/il/itemname-e.txt", "utf8"), {
    delimiter: "\t",
    relaxQuotes: true,
    columns: true,
    bom: true,
  });

  let data = EntryIL.array().parse(json);

  return data.map((x) => {
    const itemName: ItemNameEntry = {
      id: parseInt(x.id),
      name: { en: cleanStr(x.name), ru: cleanStr(x.name) },
      add_name: { en: cleanStr(x.add_name), ru: cleanStr(x.add_name) },
      desc: { en: cleanStr(x.description), ru: cleanStr(x.description) },
    };

    return itemName;
  });
}
