import { parse as parseCsv } from "csv-parse/sync";
import Fs from "fs";
import { z } from "zod";
import { NpcNameEntry } from "../types";

function cleanStr(s: string) {
  const left = s.match(/[au],(.*?)$/)?.[1] ?? s;
  const right = left.match(/^(.*?)(\\\\n)?\\0/)?.[1] ?? left;
  return right;
}

const EntryIL = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  "rgb[0]": z.string(),
  "rgb[1]": z.string(),
  "rgb[2]": z.string(),
});

export function loadNpcNamesIL(): NpcNameEntry[] {
  const json = parseCsv(Fs.readFileSync("datapack/il/npcname-e.txt", "utf8"), {
    delimiter: "\t",
    relaxQuotes: true,
    columns: true,
    bom: true,
  });

  let data = EntryIL.array().parse(json);

  return data.map((x) => {
    const itemName: NpcNameEntry = {
      id: parseInt(x.id),
      name: { en: cleanStr(x.name), ru: cleanStr(x.name) },
      nick: { en: cleanStr(x.description), ru: cleanStr(x.description) },
      nickcolor: getNickColor(x["rgb[0]"]),
    };

    return itemName;
  });
}

function getNickColor(param: string) {
  let nickColor: NpcNameEntry["nickcolor"];
  switch (param) {
    case "3F":
      nickColor = "raid";
      break;
    case "0":
      nickColor = "quest";
      break;
    default:
      nickColor = "default";
      break;
  }
  return nickColor;
}
