import { z } from "zod";

export const boxSchema = z.object({
  boxId: z.string(),
  title: z.string(),
  expressionContextIds: z.array(z.string()),
});

export type Box = z.infer<typeof boxSchema>;

export const boxItemSchema = z.object({
  expressionContextId: z.string(),
  phrase: z.string(),
  translation: z.string(),
});

export type BoxItem = z.infer<typeof boxItemSchema>;

export const boxDetailsSchema = z.object({
  boxId: z.string(),
  title: z.string(),
  boxItems: z.array(boxItemSchema),
});

export type BoxDetails = z.infer<typeof boxDetailsSchema>;
