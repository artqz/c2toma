import { parse as parseCsv } from "csv-parse/sync";
import Fs from "fs";
import { z } from "zod";

//tag_?	quest_id	quest_prog	main_name	prog_name	description	cnt1	tab1[0]	tab1[1]	tab1[2]	tab1[3]	tab1[4]	tab1[5]	tab1[6]	tab1[7]	tab1[8]	tab1[9]	tab1[10]	tab1[11]	tab1[12]	tab1[13]	cnt2	tab2[0]	tab2[1]	tab2[2]	tab2[3]	tab2[4]	tab2[5]	tab2[6]	tab2[7]	tab2[8]	tab2[9]	tab2[10]	tab2[11]	tab2[12]	tab2[13]	quest_x	quest_y	quest_z	UNK_npc1_?	UNK_npc2_?	UNK_npc3_?	npc_name	UNK_0

export type QuestNameEntryC4 = {
  id: number;
  progId: number;
  name: { en: string; ru: string };
  progName: { en: string; ru: string };
  desc: { en: string; ru: string };
  short_desc: { en: string; ru: string };
  tabs1: number[];
  tabs2: number[];
};

function cleanStr(s: string) {
  const left = s.match(/[au],(.*?)$/)?.[1] ?? s;
  const right = left.match(/^(.*?)(\\\\n)?\\0/)?.[1] ?? left;
  return right;
}

const Entry = z.object({
  quest_id: z.string(),
  quest_prog: z.string(),
  main_name: z.string(),
  prog_name: z.string(),
  description: z.string(),
  short_description: z.string(),
"items[0]": z.string(),
  "items[1]": z.string(),
  "items[2]": z.string(),
  "items[3]": z.string(),
  "items[4]": z.string(),
  "items[5]": z.string(),
  "items[6]": z.string(),
  "items[7]": z.string(),
  "items[8]": z.string(),
  "items[9]": z.string(),
  "items[10]": z.string(),
  "items[11]": z.string(),
  "items[12]": z.string(),
  "items[13]": z.string(),
  "num_items[0]": z.string(),
  "num_items[1]": z.string(),
  "num_items[2]": z.string(),
  "num_items[3]": z.string(),
  "num_items[4]": z.string(),
  "num_items[5]": z.string(),
  "num_items[6]": z.string(),
  "num_items[7]": z.string(),
  "num_items[8]": z.string(),
  "num_items[9]": z.string(),
  "num_items[10]": z.string(),
  "num_items[11]": z.string(),
  "num_items[12]": z.string(),
  "num_items[13]": z.string(),
});

export function loadQuestNamesC5(): QuestNameEntryC4[] {
  const json = parseCsv(Fs.readFileSync("datapack/ct1/questname-e.txt", "utf8"), {
    delimiter: "\t",
    relaxQuotes: true,
    columns: true,
    bom: true,
  });

  let data = Entry.array().parse(json);
  return data.map((x) => {
    return {
      id: parseInt(cleanStr(x.quest_id)),
      progId: parseInt(cleanStr(x.quest_prog)),
      name: { en: cleanStr(x.main_name), ru: cleanStr(x.main_name) },
      progName: { en: cleanStr(x.prog_name), ru: cleanStr(x.prog_name) },
      desc: { en: cleanStr(x.description), ru: cleanStr(x.description) },
      short_desc: {
        en: cleanStr(x.short_description),
        ru: cleanStr(x.short_description),
      },
      tabs1: pushItems({
        0: x["items[0]"],
        1: x["items[1]"],
        2: x["items[2]"],
        3: x["items[3]"],
        4: x["items[4]"],
        5: x["items[5]"],
        6: x["items[6]"],
        7: x["items[7]"],
        8: x["items[8]"],
        9: x["items[9]"],
        10: x["items[10]"],
      }),
      tabs2: pushItems({
        0: x["num_items[0]"],
        1: x["num_items[1]"],
        2: x["num_items[2]"],
        3: x["num_items[3]"],
        4: x["num_items[4]"],
        5: x["num_items[5]"],
        6: x["num_items[6]"],
        7: x["num_items[7]"],
        8: x["num_items[8]"],
        9: x["num_items[9]"],
        10: x["num_items[10]"],
      }),
    };
  });
}

type Tab = {
  0: string;
  1: string;
  2: string;
  3: string;
  4: string;
  5: string;
  6: string;
  7: string;
  8: string;
  9: string;
  10: string;
};

function pushItems(tab: Tab) {
  const _tab = JSON.parse(JSON.stringify(tab));
  const arr: number[] = [];

  for (let i = 0; i < 13; i++) {
    if (_tab[i]) {
      arr.push(parseInt(_tab[i]));
    }
  }

  return arr;
}


