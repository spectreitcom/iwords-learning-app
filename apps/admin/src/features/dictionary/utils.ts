import { ExpressionContextType } from "@/features/dictionary/types";

const expressionTypeMap = new Map<ExpressionContextType, string>();
expressionTypeMap.set("verb", "czasownik");
expressionTypeMap.set("irregular_verb", "nieregularny czasownik");
expressionTypeMap.set("noun", "rzeczownik");
expressionTypeMap.set("adjective", "przymiotnik");
expressionTypeMap.set("phrasal_verb", "czasownik frazowy");
expressionTypeMap.set("adverb", "przysłówek");
expressionTypeMap.set("simple_expression", "proste wyrażenie");

export { expressionTypeMap };
