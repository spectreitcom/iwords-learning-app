import { expressionContextTypeSchema } from "@/lib/types";
import { z } from "zod";

export const boxSchema = z.object({
  boxId: z.string(),
  title: z.string(),
  expressionContextIds: z.array(z.string()),
});

export type Box = z.infer<typeof boxSchema>;

export const boxSentenceSchema = z.object({
  sentenceId: z.string(),
  content: z.string(),
  translation: z.string(),
});

export const boxItemSchema = z
  .object({
    expressionContextId: z.string(),
    expressionId: z.string(),
    phrase: z.string(),
    translation: z.string(),
    type: expressionContextTypeSchema,
    forms: z.array(z.string()).nullable(),
    isCountable: z.boolean(),
    isIrregular: z.boolean(),
    sentences: z.array(boxSentenceSchema),
    definition: z.string().nullable(),
    definitionTranslation: z.string().nullable(),
  })
  .refine(
    (item) => {
      if (Array.isArray(item.forms)) {
        if (item.forms.length === 0 || item.forms.length === 3) return true;
        if (item.forms.length > 0 && item.forms.length < 3) return false;
      }
    },
    { message: "Invalid forms" },
  );

export type BoxItem = z.infer<typeof boxItemSchema>;

export const boxDetailsSchema = boxSchema
  .omit({ expressionContextIds: true })
  .extend({
    isBoxStarted: z.boolean(),
    items: z.array(boxItemSchema),
  });
