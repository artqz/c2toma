import Fs from "fs";
import { parse as parseCsv } from "csv-parse/sync";
import { z } from "zod";

const ItemGrp = z.object({
  id: z.string(),
  "icon[4]": z.string(),
});

export type ItemGrp = z.infer<typeof ItemGrp>;

const soursec = ["armorgrp.txt", "etcitemgrp.txt", "weapongrp.txt"];

export function loadItemGrpC3() {
  const grps = new Map<number, ItemGrp>();
  for (const file of soursec) {
    const itemGrps = parseCsv(Fs.readFileSync(`datapack/c3/${file}`, "utf8"), {
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
