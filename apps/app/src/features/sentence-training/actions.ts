"use server";

import {
  expressionContextSchema,
  validateSentenceResponseSchema,
} from "@/features/sentence-training/types";
import { authFetch } from "@/lib/auth-fetch";
import { BACKEND_URL } from "@/lib/constants";

export async function getExpressionContext(expressionContextId: string) {
  try {
    const response = await authFetch(
      `${BACKEND_URL}/dictionary/expression-contexts/${expressionContextId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const data = await response.json();
    return expressionContextSchema.parse(data);
  } catch (error) {
    console.error("Error in getExpressionContext:", error);
    throw error;
  }
}

export async function validateSentence(
  expressionContextId: string,
  userSentence: string,
) {
  try {
    const response = await authFetch(
      `${BACKEND_URL}/answers/ai/validate-sentence`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ expressionContextId, userSentence }),
      },
    );

    const data = await response.json();
    return validateSentenceResponseSchema.parse(data);
  } catch (error) {
    console.error("Error in validateSentence:", error);
    throw error;
  }
}
