import { z } from "zod";

export const Slot = z.enum([
  "rhand",
  "lrhand",
  "lhand",
  "chest",
  "legs",
  "feet",
  "head",
  "gloves",
  "back",
  "underwear",
  "none",
  "onepiece",
  "rear,lear",
  "rfinger,lfinger",
  "neck",
  // GF
  "rbracelet",
  "lbracelet",
  "hair",
  "hair2",
  "hairall",
  "alldress",
  "deco1",
  "waist",
]);
export type Slot = z.infer<typeof Slot>;
export const asSlot = Slot.parse;
