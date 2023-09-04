import { parse as parseCsv } from "csv-parse/sync";
import Fs from "fs";
import { z } from "zod";
import { NpcGrpEntry } from "../types";

const NpcGrpItem = z.object({
  tag: z.string(),
  "dtab1[0]": z.string(),
  "dtab1[1]": z.string(),
  "dtab1[2]": z.string(),
  "dtab1[3]": z.string(),
  "dtab1[4]": z.string(),
  "dtab1[5]": z.string(),
  "dtab1[6]": z.string(),
  "dtab1[7]": z.string(),
  "dtab1[8]": z.string(),
  "dtab1[9]": z.string(),
  "dtab1[10]": z.string(),
  "dtab1[11]": z.string(),
  "dtab1[12]": z.string(),
  "dtab1[13]": z.string(),
  "dtab1[14]": z.string(),
  "dtab1[15]": z.string(),
  "dtab1[16]": z.string(),
  "dtab1[17]": z.string(),
  "dtab1[18]": z.string(),
  "dtab1[19]": z.string(),
  "dtab1[20]": z.string(),
  "dtab1[21]": z.string(),
  "dtab1[22]": z.string(),
  "dtab1[23]": z.string(),
  "dtab1[24]": z.string(),
  "dtab1[25]": z.string(),
});

export function loadNpcGrpIL(): NpcGrpEntry[] {
  const skillsRaw = parseCsv(
    Fs.readFileSync("datapack/il/npcgrp.txt", "utf8"),
    { delimiter: "\t", relaxQuotes: true, columns: true, bom: true }
  );

  const skills = NpcGrpItem.array().parse(skillsRaw);

  return skills.map((x) => {
    return {
      id: parseInt(x.tag),
      "dtab1[0]": parseInt(x["dtab1[0]"]),
      "dtab1[1]": parseInt(x["dtab1[1]"]),
      "dtab1[2]": parseInt(x["dtab1[2]"]),
      "dtab1[3]": parseInt(x["dtab1[3]"]),
      "dtab1[4]": parseInt(x["dtab1[4]"]),
      "dtab1[5]": parseInt(x["dtab1[5]"]),
      "dtab1[6]": parseInt(x["dtab1[6]"]),
      "dtab1[7]": parseInt(x["dtab1[7]"]),
      "dtab1[8]": parseInt(x["dtab1[8]"]),
      "dtab1[9]": parseInt(x["dtab1[9]"]),
      "dtab1[10]": parseInt(x["dtab1[10]"]),
      "dtab1[11]": parseInt(x["dtab1[11]"]),
      "dtab1[12]": parseInt(x["dtab1[12]"]),
      "dtab1[13]": parseInt(x["dtab1[13]"]),
      "dtab1[14]": parseInt(x["dtab1[14]"]),
      "dtab1[15]": parseInt(x["dtab1[15]"]),
      "dtab1[16]": parseInt(x["dtab1[16]"]),
      "dtab1[17]": parseInt(x["dtab1[17]"]),
      "dtab1[18]": parseInt(x["dtab1[18]"]),
      "dtab1[19]": parseInt(x["dtab1[19]"]),
      "dtab1[20]": parseInt(x["dtab1[20]"]),
      "dtab1[21]": parseInt(x["dtab1[21]"]),
      "dtab1[22]": parseInt(x["dtab1[22]"]),
      "dtab1[23]": parseInt(x["dtab1[23]"]),
      "dtab1[24]": parseInt(x["dtab1[24]"]),
      "dtab1[25]": parseInt(x["dtab1[25]"]),
    };
  });
}
