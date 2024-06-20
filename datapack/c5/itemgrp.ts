import Fs from "fs";
import { parse as parseCsv } from "csv-parse/sync";
import { z } from "zod";
import { ItemGrp } from "../types";

const ItemGrpC5 = z.object({
  id: z.string(),
  "icon[0]": z.string(),
});

export type ItemGrpC5= z.infer<typeof ItemGrpC5>;



const soursec = ["armorgrp.txt", "etcitemgrp.txt", "weapongrp.txt"];

export function loadItemGrpC5() {
  const grps = new Map<string, ItemGrp>();
  for (const file of soursec) {
    const itemGrps: ItemGrpC5[] = parseCsv(
      Fs.readFileSync(`datapack/c5/${file}`, "utf8"),
      {
        delimiter: "\t",
        relaxQuotes: true,
        columns: true,
      }
    );

    for (const grp of itemGrps) {
      grps.set(grp.id, {
        id: parseInt(grp.id),
        icon: grp["icon[0]"].replace("icon.", ""),
      });
    }
  }

  return Array.from(grps.values());
}
