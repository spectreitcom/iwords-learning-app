import { authFetch } from "@/lib/auth-fetch";
import { BACKEND_URL } from "@/lib/constants";
import {
  expressionContextSchema,
  searchedExpressionContextSchema,
} from "@/features/dictionary/types";
import { collectionWithPaginationSchema } from "@/lib/types";

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

export async function searchExpressionContexts(searchText?: string) {
  try {
    const searchParams = new URLSearchParams();
    if (searchText) {
      searchParams.set("searchText", searchText);
    }
    const response = await authFetch(
      `${BACKEND_URL}/dictionary/search?${searchParams.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const data = await response.json();

    return collectionWithPaginationSchema(
      searchedExpressionContextSchema,
    ).parse(data);
  } catch (e) {
    console.log("Error in searchExpressionContexts:", e);
    throw e;
  }
}
