import Fs from "fs";
import { z } from "zod";

const AiSellList = z
  .tuple([z.string(), z.number().nullable()])
  .rest(z.number())
  .or(z.tuple([z.null()]))
  .array();

const AiObjData = z.object({
  super: z.string(),
  props: z
    .object({
      SellList0: AiSellList.optional(),
      SellList1: AiSellList.optional(),
      SellList2: AiSellList.optional(),
      SellList3: AiSellList.optional(),
      SellList4: AiSellList.optional(),
      SellList5: AiSellList.optional(),
      SellList6: AiSellList.optional(),
      SellList7: AiSellList.optional(),
    })
    .optional(),
});

const AiObj = z.record(AiObjData);

export type AiObj = z.infer<typeof AiObj>;
export type AiObjData = z.infer<typeof AiObjData>;
export type AiSellList = z.infer<typeof AiSellList>;

export function loadAiGf() {
  const json = JSON.parse(Fs.readFileSync("datapack/gf/ai.json", "utf8"));
  const data = AiObj.parse(json);

  return data;
}
