import { parse as parseCsv } from "csv-parse/sync";
import Fs from "fs";
import { z } from "zod";

const Material = z.object({
  name: z.string().optional(),
  diffuse: z.string(),
  specular: z.string().optional(),
  opacity: z.string().optional(),
});

// Определяем схему через zod для проверки структуры NPC
export const NpcGrp = z.object({
  npc_id: z.number(),
  npcName: z.string(),
  meshPath: z.string(),
  meshName: z.string(),
  texturePath: z.string().optional(),
  material: Material.array().optional(),
  animationPath: z.string().optional(),
  animation: z.string().optional(),
  params: z.object({ outputBlending: z.number(), twoSided: z.boolean() }),
});

function cleanStr(s: string) {
  const left = s.match(/[au],(.*?)$/)?.[1] ?? s;
  const right = left.match(/^(.*?)(\\\\n)?\\0/)?.[1] ?? left;
  return right;
}

export type Material = z.infer<typeof Material>;
export type NpcGrp = z.infer<typeof NpcGrp>;

// const EntryC4 = z.object({
//   tag: z.string(),
//   class: z.string(),
//   mesh: z.string(),
//   cnt_tex1: z.string(),	"tex1[0]": z.string(),	"tex1[1]": z.string(),	"tex1[2]": z.string(),	"tex1[3]": z.string(),	"tex1[4]": z.string(),	cnt_tex2: z.string(),	"tex1[0]": z.string(), "tex1[1]": z.string(),
// });

export function loadNpcGrpDataC4(): NpcGrp[] {
  const json = parseCsv(Fs.readFileSync("datapack/c4/npcgrp.txt", "utf8"), {
    delimiter: "\t",
    relaxQuotes: true,
    columns: true,
    bom: true,
  });

  let data = json;

  console.log(data);

  return data;
  // return data.map((x) => {
  //   const itemName: NpcGrp = {
  //     id: parseInt(x.id),
  //     name: { en: cleanStr(x.name), ru: "" },
  //     nick: { en: cleanStr(x.description), ru: "" },
  //     nickcolor: getNickColor(x["rgb[0]"]),
  //   };

  //   return itemName;
  // });
}
