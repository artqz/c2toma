import { z } from 'zod';

const ItemGrp = z.object({
  id: z.string(),
  "icon[0]": z.string(),
});

export type ItemGrp = z.infer<typeof ItemGrp>;