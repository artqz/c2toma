import { parse as parseCsv } from "csv-parse/sync";
import Fs from "fs";
import { z } from "zod";
import { ZoneNameEntry } from "../types";
import { lstring } from "../../result/types";

function cleanStr(s: string) {
  const left = s.match(/[au],(.*?)$/)?.[1] ?? s;
  const right = left.match(/^(.*?)(\\\\n)?\\0/)?.[1] ?? left;
  return right;
}

type ChildMapez = {
  name: lstring;
  offset: { x: number; y: number };
  size: { x: number; y: number };
  img: string;
  imgSize: { x: number; y: number };
};

export function loadZoneNamesGF(): ChildMapez[] {
  const json = parseCsv(Fs.readFileSync("datapack/gf/zonename-e.txt", "utf8"), {
    delimiter: "\t",
    relaxQuotes: true,
    columns: true,
    bom: true,
  });

  const jsonRu = parseCsv(
    Fs.readFileSync("datapack/gf/zonename-ru.txt", "utf8"),
    {
      delimiter: "\t",
      relaxQuotes: true,
      columns: true,
      bom: true,
    }
  );

  let data = ZoneNameEntry.array().parse(json);
  let dataRu = ZoneNameEntry.array().parse(jsonRu);

  const langRuById = new Map(dataRu.map((d) => [d.nbr, d]));

  return data.map((x) => {
    const zoneName = {
      name: { en: cleanStr(x.zone_name), ru: cleanStr(x.zone_name) },
      offset: { x: parseInt(x["coords?[2]"]), y: parseInt(x["coords?[3]"]) },
      size: { x: parseInt(x["coords?[4]"]), y: parseInt(x["coords?[5]"]) },
      img: cleanStr(x.map ?? ""),
      imgSize: { x: 1024, y: 1024 },
    };

    const ru = langRuById.get(x.nbr);
    if (ru) {
      zoneName.name.ru = cleanStr(ru.zone_name);
    }

    return zoneName;
  });
}
