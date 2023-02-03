import { parse as parseCsv } from "csv-parse/sync";
import Fs from "fs";
import { z } from "zod";

type ItemNameEntry = {
  id: number;
  add_name: string;
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

  let data = EntryGF.array().parse(json);

  return data.map((x) => ({
    id: parseInt(x.id),
    name: cleanStr(x.name),
    add_name: cleanStr(x.add_name),
    desc: cleanStr(x.description)
  }));
}
