import { authFetch } from "@/lib/auth-fetch";
import { BACKEND_URL } from "@/lib/constants";
import { expressionContextSchema } from "@/features/dictionary/types";

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
