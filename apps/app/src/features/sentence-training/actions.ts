"use server";

import {
  ExpressionContext,
  ValidateSentenceResponse,
} from "@/features/sentence-training/types";
import { authFetch } from "@/lib/auth-fetch";
import { BACKEND_URL } from "@/lib/constants";

export async function getExpressionContext(expressionContextId: string) {
  const response = await authFetch(
    `${BACKEND_URL}/dictionary/expression-contexts/${expressionContextId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  return (await response.json()) as ExpressionContext;
}

export async function validateSentence(
  expressionContextId: string,
  userSentence: string,
) {
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
  return (await response.json()) as ValidateSentenceResponse;
}
