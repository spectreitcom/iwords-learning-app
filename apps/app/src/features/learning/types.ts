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

export const generalAnswerSchema = z.object({
  correct: z.boolean(),
  userAnswer: z.string(),
  correctAnswer: z.string(),
});

export type GeneralAnswer = z.infer<typeof generalAnswerSchema>;

export const irregularVerbAnswerSchema = z.object({
  form1: generalAnswerSchema,
  form2: generalAnswerSchema,
  form3: generalAnswerSchema,
  allCorrect: z.boolean(),
});

export type IrregularVerbAnswer = z.infer<typeof irregularVerbAnswerSchema>;
