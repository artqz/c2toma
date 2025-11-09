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

export function loadNpcGrpC5(): NpcGrpEntry[] {
  const skillsRaw = parseCsv(
    Fs.readFileSync("datapack/ct1/npcgrp.txt", "utf8"),
    { delimiter: "\t", relaxQuotes: true, columns: true, bom: true }
  );

  const skills = NpcGrpItem.array().parse(skillsRaw);

  return skills.map((x) => {
    const skillList: string[] = [];
    if (x["dtab1[0]"] && x["dtab1[1]"]) {
      skillList.push(x["dtab1[0]"] + "_" + x["dtab1[1]"]);
    }
    if (x["dtab1[2]"] && x["dtab1[3]"]) {
      skillList.push(x["dtab1[2]"] + "_" + x["dtab1[3]"]);
    }
    if (x["dtab1[4]"] && x["dtab1[5]"]) {
      skillList.push(x["dtab1[4]"] + "_" + x["dtab1[5]"]);
    }
    if (x["dtab1[6]"] && x["dtab1[7]"]) {
      skillList.push(x["dtab1[6]"] + "_" + x["dtab1[7]"]);
    }
    if (x["dtab1[8]"] && x["dtab1[9]"]) {
      skillList.push(x["dtab1[8]"] + "_" + x["dtab1[9]"]);
    }
    if (x["dtab1[10]"] && x["dtab1[11]"]) {
      skillList.push(x["dtab1[10]"] + "_" + x["dtab1[11]"]);
    }
    if (x["dtab1[12]"] && x["dtab1[13]"]) {
      skillList.push(x["dtab1[12]"] + "_" + x["dtab1[13]"]);
    }
    if (x["dtab1[14]"] && x["dtab1[15]"]) {
      skillList.push(x["dtab1[14]"] + "_" + x["dtab1[15]"]);
    }
    if (x["dtab1[16]"] && x["dtab1[17]"]) {
      skillList.push(x["dtab1[16]"] + "_" + x["dtab1[17]"]);
    }
    if (x["dtab1[18]"] && x["dtab1[19]"]) {
      skillList.push(x["dtab1[18]"] + "_" + x["dtab1[19]"]);
    }
    if (x["dtab1[20]"] && x["dtab1[21]"]) {
      skillList.push(x["dtab1[20]"] + "_" + x["dtab1[21]"]);
    }
    if (x["dtab1[22]"] && x["dtab1[23]"]) {
      skillList.push(x["dtab1[22]"] + "_" + x["dtab1[23]"]);
    }
    if (x["dtab1[24]"] && x["dtab1[25]"]) {
      skillList.push(x["dtab1[24]"] + "_" + x["dtab1[25]"]);
    }

    return {
      id: parseInt(x.tag),
      skillList,
    };
  });
}
