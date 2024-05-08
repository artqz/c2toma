import { z } from "zod";

export const Item = z.object({
  id: z.number(),
  itemName: z.string(),
});

export type Item = z.infer<typeof Item>;
