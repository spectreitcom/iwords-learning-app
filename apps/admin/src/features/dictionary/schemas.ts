import { z } from "zod";

export const createExpressionSchema = z.object({
  phrase: z.string().min(1, {
    message: "To pole jest wymagane",
  }),
});

export type CreateExpressionData = z.infer<typeof createExpressionSchema>;

export const createOnlyTranslationExpressionContextSchema = z.object({
  translation: z.string().min(1, {
    message: "To pole jest wymagane",
  }),
  expressionId: z.uuid(),
});

export type CreateOnlyTranslationExpressionContextData = z.infer<
  typeof createOnlyTranslationExpressionContextSchema
>;

export const createNounExpressionContextSchema = z.object({
  translation: z.string().min(1, {
    message: "To pole jest wymagane",
  }),
  expressionId: z.uuid(),
  isCountable: z.boolean(),
});

export type CreateNounExpressionContextData = z.infer<
  typeof createNounExpressionContextSchema
>;

export const createIrregularVerbExpressionContextSchema = z.object({
  translation: z.string().min(1, {
    message: "To pole jest wymagane",
  }),
  expressionId: z.uuid(),
  form1: z.string().min(1, { message: "To pole jest wymagane" }),
  form2: z.string().min(1, { message: "To pole jest wymagane" }),
  form3: z.string().min(1, { message: "To pole jest wymagane" }),
});

export type CreateIrregularVerbExpressionContextData = z.infer<
  typeof createIrregularVerbExpressionContextSchema
>;

export const createSentenceSchema = z.object({
  content: z.string().min(1, { message: "To pole jest wymagane" }),
  translation: z.string().min(1, { message: "To pole jest wymagane" }),
});

export type CreateSentenceData = z.infer<typeof createSentenceSchema>;
