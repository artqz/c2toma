import Fs from "fs";
import { z } from "zod";

const AiSellList = z
  .tuple([z.string(), z.number().nullable()])
  .rest(z.number())
  .or(z.tuple([z.null()]))
  .array();

const AiProps = z.object({
  SellList0: AiSellList.optional(),
  SellList1: AiSellList.optional(),
  SellList2: AiSellList.optional(),
  SellList3: AiSellList.optional(),
  SellList4: AiSellList.optional(),
  SellList5: AiSellList.optional(),
  SellList6: AiSellList.optional(),
  SellList7: AiSellList.optional(),
});

const AiObjData = z.object({
  super: z.string(),
  props: AiProps.optional(),
});

const AiObj = z.record(AiObjData);
export type AiObj = z.infer<typeof AiObj>;
export type AiSellList = z.infer<typeof AiSellList>;
export type AiObjData = z.infer<typeof AiObjData>;
export type AiProps = z.infer<typeof AiProps>;

function loadAiDataJson(path: string): AiObj {
  const src = Fs.readFileSync(path, "utf8");
  const json = JSON.parse(src);
  let data = AiObj.parse(json);

  return data;
}

export function loadAiDataC1() {
  return loadAiDataJson("datapack/c1/ai-c1.json");
}
