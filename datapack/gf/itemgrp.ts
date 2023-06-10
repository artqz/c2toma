import Fs from "fs";
import { parse as parseCsv } from "csv-parse/sync";
import { z } from "zod";

const ItemGrp = z.object({
  id: z.string(),
  "icon[0]": z.string(),
});

export type ItemGrp = z.infer<typeof ItemGrp>;

const soursec = ["Armorgrp.txt", "EtcItemgrp.txt", "Weapongrp.txt"];

export function loadItemGrpGF() {
  const grps = new Map<number, ItemGrp>();
  for (const file of soursec) {
    const itemGrps = parseCsv(Fs.readFileSync(`datapack/gf/${file}`, "utf8"), {
      delimiter: "\t",
      relaxQuotes: true,
      columns: true,
    });

    for (const grp of itemGrps) {
      grps.set(grp.id, grp);
    }
  }

  return Array.from(grps.values());
}
