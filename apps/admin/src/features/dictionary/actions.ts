"use server";

import { BACKEND_URL } from "@/lib/constants";
import { CollectionWithPagination } from "@/lib/types";
import {
  CreateExpressionResponse,
  Expression,
} from "@/features/dictionary/types";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { CreateExpressionSchema } from "@/features/dictionary/schemas";

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

export async function deleteExpression(expressionId: string) {
  const session = await getSession();

  await fetch(`${BACKEND_URL}/dictionary/expressions/${expressionId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.accessToken}`,
    },
  });

  revalidatePath("/expressions");
  redirect("/expressions");
}

export async function createExpression(data: CreateExpressionSchema) {
  const session = await getSession();

  const response = await fetch(`${BACKEND_URL}/dictionary/expressions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.accessToken}`,
    },
    body: JSON.stringify({ ...data }),
  });

  revalidatePath("/expressions");

  return (await response.json()) as CreateExpressionResponse;
}
