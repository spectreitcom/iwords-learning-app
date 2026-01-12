"use server";

import { authFetch } from "@/lib/auth-fetch";
import { BACKEND_URL } from "@/lib/constants";
import {
  generalAnswerSchema,
  irregularVerbAnswerSchema,
} from "@/features/learning/types";

export async function beginBox(boxId: string) {
  try {
    await authFetch(`${BACKEND_URL}/boxes/${boxId}/start`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error in beginBox:", error);
    throw error;
  }
}

export async function checkAnswerSimpleTranslation(
  answer: string,
  expressionContextId: string,
) {
  try {
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

    const data = await response.json();
    return generalAnswerSchema.parse(data);
  } catch (error) {
    console.error("Error in checkAnswerSimpleTranslation:", error);
    throw error;
  }
}

export async function checkAnswerSentenceTranslation(
  answer: string,
  sentenceId: string,
) {
  try {
    const response = await authFetch(`${BACKEND_URL}/answers/sentence`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ answer, sentenceId }),
    });

    const data = await response.json();
    return generalAnswerSchema.parse(data);
  } catch (error) {
    console.error("Error in checkAnswerSentenceTranslation:", error);
    throw error;
  }
}

export async function checkAnswerIrregularVerbTranslation(
  answer: string[],
  expressionContextId: string,
) {
  try {
    const response = await authFetch(`${BACKEND_URL}/answers/irregular-verb`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ answer, expressionContextId }),
    });

    const data = await response.json();
    return irregularVerbAnswerSchema.parse(data);
  } catch (error) {
    console.error("Error in checkAnswerIrregularVerbTranslation:", error);
    throw error;
  }
}
