"use server";

import { authFetch } from "@/lib/auth-fetch";
import { BACKEND_URL } from "@/lib/constants";
import { GeneralAnswer, IrregularVerbAnswer } from "@/features/learning/types";

export async function beginBox(boxId: string) {
  await authFetch(`${BACKEND_URL}/boxes/${boxId}/start`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function checkAnswerSimpleTranslation(
  answer: string,
  expressionContextId: string,
) {
  const response = await authFetch(
    `${BACKEND_URL}/answers/simple-translation`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ answer, expressionContextId }),
    },
  );

  return (await response.json()) as GeneralAnswer;
}

export async function checkAnswerSentenceTranslation(
  answer: string,
  sentenceId: string,
) {
  const response = await authFetch(`${BACKEND_URL}/answers/sentence`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ answer, sentenceId }),
  });

  return (await response.json()) as GeneralAnswer;
}

export async function checkAnswerIrregularVerbTranslation(
  answer: string[],
  expressionContextId: string,
) {
  const response = await authFetch(`${BACKEND_URL}/answers/irregular-verb`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ answer, expressionContextId }),
  });

  return (await response.json()) as IrregularVerbAnswer;
}
