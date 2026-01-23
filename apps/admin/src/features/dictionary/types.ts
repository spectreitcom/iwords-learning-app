import { expressionContextTypeSchema } from "@repo/shared/types";
import { z } from "zod";

export const expressionSchema = z.object({
  expressionId: z.string(),
  phrase: z.string(),
});

export type Expression = z.infer<typeof expressionSchema>;

export const createExpressionResponseSchema = z.object({
  expressionId: z.string().nullable(),
  existingExpressionId: z.string().nullable(),
});

export type CreateExpressionResponse = z.infer<
  typeof createExpressionResponseSchema
>;

export {
  expressionContextTypeSchema,
  type ExpressionContextType,
} from "@repo/shared/types";

export const expressionContextSchema = z.object({
  expressionContextId: z.string(),
  expressionId: z.string(),
  translation: z.string(),
  type: expressionContextTypeSchema,
});

export type ExpressionContext = z.infer<typeof expressionContextSchema>;

export const createExpressionContextResponseSchema = z.object({
  id: z.string(),
});

export const sentenceSchema = z.object({
  sentenceId: z.string(),
  translation: z.string(),
  content: z.string(),
});

export type Sentence = z.infer<typeof sentenceSchema>;

export const expressionContextDetailsSchema = expressionContextSchema.extend({
  isCountable: z.boolean().default(false),
  isIrregular: z.boolean().default(false),
  forms: z.array(z.string()).default([]),
  sentences: z.array(sentenceSchema),
  definition: z.string().nullable(),
  definitionTranslation: z.string().nullable(),
});

export type ExpressionContextDetails = z.infer<
  typeof expressionContextDetailsSchema
>;

export const searchedDictionaryExpressionSchema = z.object({
  id: z.string(),
  phrase: z.string(),
  translation: z.string(),
  expressionContextId: z.string(),
  expressionId: z.string(),
  type: expressionContextTypeSchema,
  forms: z.array(z.string()),
  isCountable: z.boolean(),
  isIrregular: z.boolean(),
});

export type SearchedDictionaryExpression = z.infer<
  typeof searchedDictionaryExpressionSchema
>;

export const generateExpressionContextDefinitionResponseSchema = z.object({
  definition: z.string(),
  translation: z.string(),
});

export const generateSentencesForExpressionContextResponseSchema = z.array(
  z.object({
    sentence: z.string(),
    translation: z.string(),
  }),
);
