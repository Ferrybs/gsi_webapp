import { z } from "zod";

export const InventoryStockSchema = z.object({
  skin_id: z.number(),
  steam_id: z.string(),
  quantity: z.number().int(),
  last_sync: z.string().refine((val) => !isNaN(Date.parse(val))),
});

export type InventoryStock = z.infer<typeof InventoryStockSchema>;
