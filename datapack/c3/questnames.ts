import { parse as parseCsv } from "csv-parse/sync";
import Fs from "fs";
import { z } from "zod";

//tag_?	quest_id	quest_prog	main_name	prog_name	description	cnt1	tab1[0]	tab1[1]	tab1[2]	tab1[3]	tab1[4]	tab1[5]	tab1[6]	tab1[7]	tab1[8]	tab1[9]	tab1[10]	tab1[11]	tab1[12]	tab1[13]	cnt2	tab2[0]	tab2[1]	tab2[2]	tab2[3]	tab2[4]	tab2[5]	tab2[6]	tab2[7]	tab2[8]	tab2[9]	tab2[10]	tab2[11]	tab2[12]	tab2[13]	quest_x	quest_y	quest_z	UNK_npc1_?	UNK_npc2_?	UNK_npc3_?	npc_name	UNK_0

export type QuestNameEntryC3 = {
  id: number;
  progId: number;
  name: string;
  progName: string;
  desc: string;
  tabs1: number[];
  tabs2: number[];
};

function cleanStr(s: string) {
  const left = s.match(/[au],(.*?)$/)?.[1] ?? s;
  const right = left.match(/^(.*?)(\\\\n)?\\0/)?.[1] ?? left;
  return right;
}

const EntryC3 = z.object({
  quest_id: z.string(),
  quest_prog: z.string(),
  main_name: z.string(),
  prog_name: z.string(),
  description: z.string(),
  "tab1[0]": z.string(),
  "tab1[1]": z.string(),
  "tab1[2]": z.string(),
  "tab1[3]": z.string(),
  "tab1[4]": z.string(),
  "tab1[5]": z.string(),
  "tab1[6]": z.string(),
  "tab1[7]": z.string(),
  "tab1[8]": z.string(),
  "tab1[9]": z.string(),
  "tab1[10]": z.string(),
  "tab1[11]": z.string(),
  "tab1[12]": z.string(),
  "tab1[13]": z.string(),
  "tab2[0]": z.string(),
  "tab2[1]": z.string(),
  "tab2[2]": z.string(),
  "tab2[3]": z.string(),
  "tab2[4]": z.string(),
  "tab2[5]": z.string(),
  "tab2[6]": z.string(),
  "tab2[7]": z.string(),
  "tab2[8]": z.string(),
  "tab2[9]": z.string(),
  "tab2[10]": z.string(),
  "tab2[11]": z.string(),
  "tab2[12]": z.string(),
  "tab2[13]": z.string(),
});

export function loadQuestNamesC3(): QuestNameEntryC3[] {
  const json = parseCsv(Fs.readFileSync("datapack/c3/questname-e.txt", "utf8"), {
    delimiter: "\t",
    relaxQuotes: true,
    columns: true,
    bom: true,
  });

  let data = EntryC3.array().parse(json);
  return data.map((x) => {
    return {
      id: parseInt(cleanStr(x.quest_id)),
      progId: parseInt(cleanStr(x.quest_prog)),
      name: cleanStr(x.main_name),
      progName: cleanStr(x.prog_name),
      desc: cleanStr(x.description),
      tabs1: pushItems({0: x['tab1[0]'], 1: x['tab1[1]'], 2:x['tab1[2]'], 3:x['tab1[3]'], 4:x['tab1[4]'], 5:x['tab1[5]'], 6:x['tab1[6]'], 7:x['tab1[7]'], 8:x['tab1[8]'], 9:x['tab1[9]'], 10:x['tab1[10]'], 11:x['tab1[11]'], 12:x['tab1[12]'], 13:x['tab1[13]']}),
      tabs2: pushItems({0: x['tab2[0]'], 1: x['tab2[1]'], 2:x['tab2[2]'], 3:x['tab2[3]'], 4:x['tab2[4]'], 5:x['tab2[5]'], 6:x['tab2[6]'], 7:x['tab2[7]'], 8:x['tab2[8]'], 9:x['tab2[9]'], 10:x['tab2[10]'], 11:x['tab2[11]'], 12:x['tab2[12]'], 13:x['tab2[13]']}),
    };
  });
}

type Tab = {0: string, 1: string, 2: string, 3: string, 4: string, 5: string, 6: string, 7: string, 8: string, 9: string, 10: string, 11: string, 12: string, 13: string,}

function pushItems(tab: Tab) {
  const _tab = JSON.parse(JSON.stringify(tab))  
  const arr: number[] = []

  for (let i = 0; i < 13; i++) {     
    if (_tab[i]) {
     arr.push(parseInt(_tab[i])) 
    }
  }

  return arr
}