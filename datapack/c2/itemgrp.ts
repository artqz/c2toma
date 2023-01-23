import Fs from "fs";
import { z } from "zod";

const ItemGrp = z.object({
  object_id: z.number(),
  icon: z.object({ $: z.array(z.string()) }),
});

export type ItemGrp = z.infer<typeof ItemGrp>;

const soursec = [
  "armorgrp.l2h.json",
  "etcitemgrp.l2h.json",
  "weapongrp.l2h.json",
];

export function loadItemGrpJson(path: string): ItemGrp[] {
  const src = Fs.readFileSync(path, "utf8");
  const json = JSON.parse(src);
  let data = ItemGrp.array().parse(json);
  return data;
}

export function loadItemGrpC2() {
  const grps = new Map<number, ItemGrp>();
  for (const file of soursec) {
    const itemGrps = loadItemGrpJson(`datapack/c2/${file}`);
    for (const grp of itemGrps) {
      grps.set(grp.object_id, grp);
    }
  }

  return Array.from(grps.values());
}
