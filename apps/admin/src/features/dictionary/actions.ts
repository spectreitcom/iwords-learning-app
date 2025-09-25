"use server";

import { BACKEND_URL } from "@/lib/constants";
import { CollectionWithPagination } from "@/lib/types";
import { Expression } from "@/features/dictionary/types";
import { getSession } from "@/lib/session";

export async function getExpressions(page = 1, searchText?: string, take = 20) {
  const session = await getSession();

  const urlSearchParams = new URLSearchParams();
  urlSearchParams.append("page", page.toString());
  urlSearchParams.append("take", take.toString());
  if (searchText) {
    urlSearchParams.append("searchText", searchText);
  }
  const response = await fetch(
    `${BACKEND_URL}/dictionary/expressions?${urlSearchParams.toString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.accessToken}`,
      },
    },
  );

  return (await response.json()) as CollectionWithPagination<Expression>;
}
