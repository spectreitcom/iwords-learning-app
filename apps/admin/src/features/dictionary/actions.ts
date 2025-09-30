"use server";

import { BACKEND_URL } from "@/lib/constants";
import { CollectionWithPagination } from "@/lib/types";
import {
  CreateExpressionContextResponse,
  CreateExpressionResponse,
  Expression,
  ExpressionContext,
} from "@/features/dictionary/types";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  CreateExpressionData,
  CreateIrregularVerbExpressionContextData,
  CreateNounExpressionContextData,
  CreateOnlyTranslationExpressionContextData,
} from "@/features/dictionary/schemas";

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

export async function createExpression(data: CreateExpressionData) {
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

export async function updateExpression(
  expressionId: string,
  data: CreateExpressionData,
) {
  const session = await getSession();

  await fetch(`${BACKEND_URL}/dictionary/expressions/${expressionId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session?.accessToken}`,
    },
    body: JSON.stringify({ ...data }),
  });

  revalidatePath(`/expressions`);
}

export async function getExpression(expressionId: string) {
  const session = await getSession();

  const response = await fetch(
    `${BACKEND_URL}/dictionary/expressions/${expressionId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.accessToken}`,
      },
    },
  );

  return (await response.json()) as Expression;
}

export async function getExpressionContexts(
  expressionId: string,
  page = 1,
  take = 20,
) {
  const session = await getSession();

  const urlSearchParams = new URLSearchParams();
  urlSearchParams.append("expressionId", expressionId);
  urlSearchParams.append("page", page.toString());
  urlSearchParams.append("take", take.toString());

  const response = await fetch(
    `${BACKEND_URL}/dictionary/expression-contexts?${urlSearchParams.toString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.accessToken}`,
      },
    },
  );

  return (await response.json()) as CollectionWithPagination<ExpressionContext>;
}

export async function createVerbExpressionContext(
  data: CreateOnlyTranslationExpressionContextData,
) {
  const session = await getSession();

  const response = await fetch(
    `${BACKEND_URL}/dictionary/expression-contexts/verb`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.accessToken}`,
      },
      body: JSON.stringify({ ...data }),
    },
  );

  revalidatePath(`/expressions/${data.expressionId}`);

  return (await response.json()) as CreateExpressionContextResponse;
}

export async function createAdjectiveExpressionContext(
  data: CreateOnlyTranslationExpressionContextData,
) {
  const session = await getSession();

  const response = await fetch(
    `${BACKEND_URL}/dictionary/expression-contexts/adjective`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.accessToken}`,
      },
      body: JSON.stringify({ ...data }),
    },
  );

  revalidatePath(`/expressions/${data.expressionId}`);

  return (await response.json()) as CreateExpressionContextResponse;
}

export async function createPhrasalVerbExpressionContext(
  data: CreateOnlyTranslationExpressionContextData,
) {
  const session = await getSession();

  const response = await fetch(
    `${BACKEND_URL}/dictionary/expression-contexts/phrasal-verb`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.accessToken}`,
      },
      body: JSON.stringify({ ...data }),
    },
  );

  revalidatePath(`/expressions/${data.expressionId}`);

  return (await response.json()) as CreateExpressionContextResponse;
}

export async function createAdverbExpressionContext(
  data: CreateOnlyTranslationExpressionContextData,
) {
  const session = await getSession();

  const response = await fetch(
    `${BACKEND_URL}/dictionary/expression-contexts/adverb`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.accessToken}`,
      },
      body: JSON.stringify({ ...data }),
    },
  );

  revalidatePath(`/expressions/${data.expressionId}`);

  return (await response.json()) as CreateExpressionContextResponse;
}

export async function createNounExpressionContext(
  data: CreateNounExpressionContextData,
) {
  const session = await getSession();

  const response = await fetch(
    `${BACKEND_URL}/dictionary/expression-contexts/noun`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.accessToken}`,
      },
      body: JSON.stringify({ ...data }),
    },
  );

  revalidatePath(`/expressions/${data.expressionId}`);

  return (await response.json()) as CreateExpressionContextResponse;
}

export async function createIrregularVerbExpressionContext(
  data: CreateIrregularVerbExpressionContextData,
) {
  const session = await getSession();

  const response = await fetch(
    `${BACKEND_URL}/dictionary/expression-contexts/irregular-verb`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.accessToken}`,
      },
      body: JSON.stringify({
        translation: data.translation,
        expressionId: data.expressionId,
        forms: [data.form1, data.form2, data.form3],
      }),
    },
  );

  revalidatePath(`/expressions/${data.expressionId}`);

  return (await response.json()) as CreateExpressionContextResponse;
}
