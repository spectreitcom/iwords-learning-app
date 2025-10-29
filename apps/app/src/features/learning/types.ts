import {
  IRREGULAR_VERB_TRANSLATION_VIEW,
  SENTENCE_TRANSLATION_VIEW,
  SIMPLE_TRANSLATION_VIEW,
} from "@/features/learning/constants";

export type LearningViewType =
  | typeof SENTENCE_TRANSLATION_VIEW
  | typeof SIMPLE_TRANSLATION_VIEW
  | typeof IRREGULAR_VERB_TRANSLATION_VIEW;

export type GeneralAnswer = {
  correct: boolean;
  userAnswer: string;
  correctAnswer: string;
};

export type IrregularVerbAnswer = {
  form1: GeneralAnswer;
  form2: GeneralAnswer;
  form3: GeneralAnswer;
  allCorrect: boolean;
};
