import { BoxItemType } from "@/features/boxes/types";

const expressionTypeMap = new Map<BoxItemType, string>();
expressionTypeMap.set("verb", "czasownik");
expressionTypeMap.set("irregular_verb", "nieregularny czasownik");
expressionTypeMap.set("noun", "rzeczownik");
expressionTypeMap.set("adjective", "przymiotnik");
expressionTypeMap.set("phrasal_verb", "czasownik frazowy");
expressionTypeMap.set("adverb", "przysłówek");

export { expressionTypeMap };
