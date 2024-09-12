import Fs from "fs";
import { z } from "zod";

const PetdataEntry = z.object({
  $: z.object({
    level: z.number(),
    max_meal: z.number(),
    exp: z.number(),
    get_exp_type: z.number(),
    consume_meal_in_battle: z.number(),
    consume_meal_in_normal: z.number(),
    org_pattack: z.number(),
    org_pdefend: z.number(),
    org_mattack: z.number(),
    org_mdefend: z.number(),
    org_hp: z.number(),
    org_mp: z.number(),
    org_hp_regen: z.number(),
    org_mp_regen: z.number(),
    food1: z.number(),
    food2: z.number(),
    hungry_limit: z.number(),
    soulshot_count: z.number(),
    spiritshot_count: z.number()
  }).array(),
  npc_name: z.string()
});

export type PetdataEntry = z.infer<typeof PetdataEntry>;

function loadPetdataJson(path: string) {
  const src = Fs.readFileSync(path, "utf8");
  const json = JSON.parse(src);
  let data = PetdataEntry.array().parse(json);
  return data;
}

export function loadPetdataC4() {
  return loadPetdataJson("datapack/c4/petdata.txt.json");
}