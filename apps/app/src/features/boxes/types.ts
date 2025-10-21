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

export type BoxItemType =
  | "verb"
  | "noun"
  | "adjective"
  | "adverb"
  | "phrasal_verb"
  | "irregular_verb";

export type BoxItem = {
  expressionContextId: string;
  expressionId: string;
  phrase: string;
  translation: string;
  type: BoxItemType;
  forms: [string, string, string] | null;
  isCountable: boolean;
  isIrregular: boolean;
  sentences: BoxSentence[];
};

export type BoxDetails = Exclude<Box, "expressionContextIds"> & {
  items: BoxItem[];
};
