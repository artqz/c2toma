import { parse as parseCsv } from "csv-parse/sync";
import Fs from "fs";
import { z } from "zod";

//tag_?	quest_id	quest_prog	main_name	prog_name	description	cnt1	tab5[0]	tab5[1]	tab5[2]	tab5[3]	tab5[4]	tab5[5]	tab5[6]	tab5[7]	tab5[8]	tab5[9]	tab5[10]	tab5[11]	tab5[12]	tab5[13]	cnt2	tab6[0]	tab6[1]	tab6[2]	tab6[3]	tab6[4]	tab6[5]	tab6[6]	tab6[7]	tab6[8]	tab6[9]	tab6[10]	tab6[11]	tab6[12]	tab6[13]	quest_x	quest_y	quest_z	UNK_npc1_?	UNK_npc2_?	UNK_npc3_?	npc_name	UNK_0

export type QuestNameEntryGF = {
  id: number;
  progId: number;
  name: {en: string, ru: string};
  progName: {en: string, ru: string};
  desc: {en: string, ru: string};
  short_desc: {en: string, ru: string};
  tabs1: number[];
  tabs2: number[];
};

function cleanStr(s: string) {
  const left = s.match(/[au],(.*?)$/)?.[1] ?? s;
  const right = left.match(/^(.*?)(\\\\n)?\\0/)?.[1] ?? left;
  return right;
}

const EntryGF = z.object({
  quest_id: z.string(),
  quest_prog: z.string(),
  main_name: z.string(),
  prog_name: z.string(),
  description: z.string(),
  short_description: z.string(),
  "tab5[0]": z.string(),
  "tab5[1]": z.string(),
  "tab5[2]": z.string(),
  "tab5[3]": z.string(),
  "tab5[4]": z.string(),
  "tab5[5]": z.string(),
  "tab5[6]": z.string(),
  "tab5[7]": z.string(),
  "tab5[8]": z.string(),
  "tab5[9]": z.string(),
  "tab5[10]": z.string(),
  "tab6[0]": z.string(),
  "tab6[1]": z.string(),
  "tab6[2]": z.string(),
  "tab6[3]": z.string(),
  "tab6[4]": z.string(),
  "tab6[5]": z.string(),
  "tab6[6]": z.string(),
  "tab6[7]": z.string(),
  "tab6[8]": z.string(),
  "tab6[9]": z.string(),
  "tab6[10]": z.string(),
});

export function loadQuestNamesGF(): QuestNameEntryGF[] {
  const csvEn = parseCsv(Fs.readFileSync("datapack/gf/questname-e.txt", "utf8"), {
    delimiter: "\t",
    relaxQuotes: true,
    columns: true,
    bom: true,
  });

  const csvRu = parseCsv(Fs.readFileSync("datapack/gf/questname-ru.txt", "utf8"), {
    delimiter: "\t",
    relaxQuotes: true,
    columns: true,
    bom: true,
  });

  let data = EntryGF.array().parse(csvEn);
  let dataRu = EntryGF.array().parse(csvRu);

  const langRuById = new Map(dataRu.map((d) => [d.quest_id+"_"+d.quest_prog, d]));

  return data.map((x) => {
    const questName: QuestNameEntryGF =  {
      id: parseInt(cleanStr(x.quest_id)),
      progId: parseInt(cleanStr(x.quest_prog)),
      name: {en: cleanStr(x.main_name), ru: cleanStr(x.main_name)},
      progName: {en: cleanStr(x.prog_name), ru: cleanStr(x.prog_name)},
      desc: {en: cleanStr(x.description), ru: cleanStr(x.description)},
      short_desc: {en: cleanStr(x.short_description), ru: cleanStr(x.short_description)},
      tabs1: pushItems({0: x['tab5[0]'], 1: x['tab5[1]'], 2:x['tab5[2]'], 3:x['tab5[3]'], 4:x['tab5[4]'], 5:x['tab5[5]'], 6:x['tab5[6]'], 7:x['tab5[7]'], 8:x['tab5[8]'], 9:x['tab5[9]'], 10:x['tab5[10]']}),
      tabs2: pushItems({0: x['tab6[0]'], 1: x['tab6[1]'], 2:x['tab6[2]'], 3:x['tab6[3]'], 4:x['tab6[4]'], 5:x['tab6[5]'], 6:x['tab6[6]'], 7:x['tab6[7]'], 8:x['tab6[8]'], 9:x['tab6[9]'], 10:x['tab6[10]']}),
    };

    const ru = langRuById.get(x.quest_id+"_"+x.quest_prog);
    if (ru) {
      questName.name.ru = cleanStr(ru.main_name);
      questName.progName.ru = cleanStr(ru.prog_name);
      questName.desc.ru = cleanStr(ru.description);
      questName.short_desc.ru = cleanStr(ru.short_description);
    }

    return questName
  });
}

type Tab = {0: string, 1: string, 2: string, 3: string, 4: string, 5: string, 6: string, 7: string, 8: string, 9: string, 10: string,}

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