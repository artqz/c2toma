import { parse as parseCsv } from "csv-parse/sync";
import Fs from "fs";
import { z } from "zod";

export type NpcNameEntry = {
  id: number;
  name: { en: string; ru: string };
  nick: { en: string; ru: string };
  nickcolor: "default" | "quest" | "raid";
};

function cleanStr(s: string) {
  const left = s.match(/[au],(.*?)$/)?.[1] ?? s;
  const right = left.match(/^(.*?)(\\\\n)?\\0/)?.[1] ?? left;
  return right;
}

const EntryGF = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  "rgb[0]": z.string(),
  "rgb[1]": z.string(),
  "rgb[2]": z.string(),
});

export function loadNpcNamesGF(): NpcNameEntry[] {
  const json = parseCsv(Fs.readFileSync("datapack/gf/npcname-e.txt", "utf8"), {
    delimiter: "\t",
    relaxQuotes: true,
    columns: true,
    bom: true,
  });

  const jsonRu = parseCsv(
    Fs.readFileSync("datapack/gf/npcname-ru.txt", "utf8"),
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
    const itemName: NpcNameEntry = {
      id: parseInt(x.id),
      name: { en: cleanStr(x.name), ru: "" },
      nick: { en: cleanStr(x.description), ru: "" },
      nickcolor: getNickColor(x["rgb[0]"]),
    };

    const ru = langRuById.get(x.id);
    if (ru) {
      itemName.name.ru = cleanStr(ru.name);
      itemName.nick.ru = cleanStr(ru.description);
    }

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
