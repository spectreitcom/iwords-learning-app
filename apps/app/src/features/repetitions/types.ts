import { expressionContextTypeSchema } from "@/lib/types";
import { z } from "zod";

export const repetitionExpressionContextSchema = z
  .object({
    expressionContextId: z.string(),
    expressionId: z.string(),
    phrase: z.string(),
    translation: z.string(),
    type: expressionContextTypeSchema,
    forms: z.array(z.string()).nullable(),
    isCountable: z.boolean(),
    isIrregular: z.boolean(),
    sentences: z.array(
      z.object({
        sentenceId: z.string(),
        content: z.string(),
        translation: z.string(),
      }),
    ),
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

export const repetitionSchema = z.object({
  repetitionId: z.string(),
  expressionContext: repetitionExpressionContextSchema,
});

export type Repetition = z.infer<typeof repetitionSchema>;
