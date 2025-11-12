import { ExpressionContextType } from "@/lib/types";

export type Box = {
  boxId: string;
  title: string;
  expressionContextIds: string[];
};

export type BoxSentence = {
  sentenceId: string;
  content: string;
  translation: string;
};

export type BoxItem = {
  expressionContextId: string;
  expressionId: string;
  phrase: string;
  translation: string;
  type: ExpressionContextType;
  forms: [string, string, string] | null;
  isCountable: boolean;
  isIrregular: boolean;
  sentences: BoxSentence[];
};

export type BoxDetails = Exclude<Box, "expressionContextIds"> & {
  isBoxStarted: boolean;
  items: BoxItem[];
};
