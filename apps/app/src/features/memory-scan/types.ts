import { z } from "zod";

export const memoryScanViewSchema = z.object({
  scanResults: z.array(
    z.object({
      itemsCount: z.int(),
      rememberedItemsCount: z.int(),
      rememberingTime: z.int(),
      createdAt: z.iso.datetime().transform((val) => new Date(val)),
    }),
  ),
  learnedItems: z.array(
    z.object({
      expression: z.object({
        id: z.uuid(),
        phrase: z.string(),
      }),
      expressionContext: z.object({
        id: z.uuid(),
        translation: z.string(),
      }),
    }),
  ),
});

export type MemoryScanView = z.infer<typeof memoryScanViewSchema>;

export const saveMemoryScanResultInputSchema = z.object({
  rememberedItemsCount: z.int(),
  rememberingTime: z.int().positive(),
});
