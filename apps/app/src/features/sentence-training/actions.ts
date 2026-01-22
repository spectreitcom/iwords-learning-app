"use server";

import { validateSentenceResponseSchema } from "@/features/sentence-training/types";
import { authFetch } from "@/lib/auth-fetch";
import { BACKEND_URL } from "@/lib/constants";

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
