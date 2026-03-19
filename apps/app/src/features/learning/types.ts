import {
  IRREGULAR_VERB_TRANSLATION_VIEW,
  SENTENCE_TRANSLATION_VIEW,
  SIMPLE_TRANSLATION_VIEW,
} from "@/features/learning/constants";
import { z } from "zod";

export type LearningViewType =
  | typeof SENTENCE_TRANSLATION_VIEW
  | typeof SIMPLE_TRANSLATION_VIEW
  | typeof IRREGULAR_VERB_TRANSLATION_VIEW;

export const sentenceSchema = z.object({
  id: z.string(),
  sentenceId: z.string(),
  content: z.string(),
  translation: z.string(),
  expressionContextId: z.string(),
  expressionId: z.string(),
});

export const generalAnswerSchema = z.object({
  correct: z.boolean(),
  userAnswer: z.string(),
  correctAnswer: z.string(),
  sentences: z.array(sentenceSchema),
});

export type GeneralAnswer = z.infer<typeof generalAnswerSchema>;

export const irregularVerbAnswerSchema = z.object({
  form1: generalAnswerSchema.omit({ sentences: true }),
  form2: generalAnswerSchema.omit({ sentences: true }),
  form3: generalAnswerSchema.omit({ sentences: true }),
  allCorrect: z.boolean(),
  sentences: z.array(sentenceSchema),
});

export type IrregularVerbAnswer = z.infer<typeof irregularVerbAnswerSchema>;
