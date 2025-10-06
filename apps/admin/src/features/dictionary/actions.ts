"use server";

import { BACKEND_URL } from "@/lib/constants";
import { CollectionWithPagination } from "@/lib/types";
import {
  CreateExpressionContextResponse,
  CreateExpressionResponse,
  Expression,
  ExpressionContext,
  ExpressionContextDetails,
} from "@/features/dictionary/types";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  CreateExpressionData,
  CreateIrregularVerbExpressionContextData,
  CreateNounExpressionContextData,
  CreateOnlyTranslationExpressionContextData,
  CreateSentenceData,
} from "@/features/dictionary/schemas";
import { authFetch } from "@/lib/auth-fetch";

export async function getExpressions(page = 1, searchText?: string, take = 20) {
  const urlSearchParams = new URLSearchParams();
  urlSearchParams.append("page", page.toString());
  urlSearchParams.append("take", take.toString());
  if (searchText) {
    urlSearchParams.append("searchText", searchText);
  }
  const response = await authFetch(
    `${BACKEND_URL}/dictionary/expressions?${urlSearchParams.toString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  return (await response.json()) as CollectionWithPagination<Expression>;
}

export async function deleteExpression(expressionId: string) {
  await authFetch(`${BACKEND_URL}/dictionary/expressions/${expressionId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  revalidatePath("/expressions");
  redirect("/expressions");
}

export async function createExpression(data: CreateExpressionData) {
  const response = await authFetch(`${BACKEND_URL}/dictionary/expressions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
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
  await authFetch(`${BACKEND_URL}/dictionary/expressions/${expressionId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...data }),
  });

  revalidatePath(`/expressions`);
}

export async function getExpression(expressionId: string) {
  const response = await authFetch(
    `${BACKEND_URL}/dictionary/expressions/${expressionId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
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
  const urlSearchParams = new URLSearchParams();
  urlSearchParams.append("expressionId", expressionId);
  urlSearchParams.append("page", page.toString());
  urlSearchParams.append("take", take.toString());

  const response = await authFetch(
    `${BACKEND_URL}/dictionary/expression-contexts?${urlSearchParams.toString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  return (await response.json()) as CollectionWithPagination<ExpressionContext>;
}

export async function getExpressionContextDetails(expressionContextId: string) {
  const response = await authFetch(
    `${BACKEND_URL}/dictionary/expression-contexts/${expressionContextId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  return (await response.json()) as ExpressionContextDetails;
}

export async function createVerbExpressionContext(
  expressionId: string,
  data: CreateOnlyTranslationExpressionContextData,
) {
  const response = await authFetch(
    `${BACKEND_URL}/dictionary/expression-contexts/verb`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...data, expressionId }),
    },
  );

  revalidatePath(`/expressions/${expressionId}`);

  return (await response.json()) as CreateExpressionContextResponse;
}

export async function createAdjectiveExpressionContext(
  expressionId: string,
  data: CreateOnlyTranslationExpressionContextData,
) {
  const response = await authFetch(
    `${BACKEND_URL}/dictionary/expression-contexts/adjective`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...data, expressionId }),
    },
  );

  revalidatePath(`/expressions/${expressionId}`);

  return (await response.json()) as CreateExpressionContextResponse;
}

export async function createPhrasalVerbExpressionContext(
  expressionId: string,
  data: CreateOnlyTranslationExpressionContextData,
) {
  const response = await authFetch(
    `${BACKEND_URL}/dictionary/expression-contexts/phrasal-verb`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...data, expressionId }),
    },
  );

  revalidatePath(`/expressions/${expressionId}`);

  return (await response.json()) as CreateExpressionContextResponse;
}

export async function createAdverbExpressionContext(
  expressionId: string,
  data: CreateOnlyTranslationExpressionContextData,
) {
  const response = await authFetch(
    `${BACKEND_URL}/dictionary/expression-contexts/adverb`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...data, expressionId }),
    },
  );

  revalidatePath(`/expressions/${expressionId}`);

  return (await response.json()) as CreateExpressionContextResponse;
}

export async function createNounExpressionContext(
  expressionId: string,
  data: CreateNounExpressionContextData,
) {
  const response = await authFetch(
    `${BACKEND_URL}/dictionary/expression-contexts/noun`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...data, expressionId }),
    },
  );

  revalidatePath(`/expressions/${expressionId}`);

  return (await response.json()) as CreateExpressionContextResponse;
}

export async function createIrregularVerbExpressionContext(
  expressionId: string,
  data: CreateIrregularVerbExpressionContextData,
) {
  const response = await authFetch(
    `${BACKEND_URL}/dictionary/expression-contexts/irregular-verb`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        translation: data.translation,
        expressionId,
        forms: [data.form1, data.form2, data.form3],
      }),
    },
  );

  revalidatePath(`/expressions/${expressionId}`);

  return (await response.json()) as CreateExpressionContextResponse;
}

export async function deleteExpressionContext(expressionContextId: string) {
  await authFetch(
    `${BACKEND_URL}/dictionary/expression-contexts/${expressionContextId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  revalidatePath(`/expressions/${expressionContextId}`);
}

export async function createSentence(
  expressionId: string,
  expressionContextId: string,
  payload: CreateSentenceData,
) {
  await authFetch(`${BACKEND_URL}/dictionary/sentences`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...payload, expressionContextId }),
  });

  revalidatePath(`/expressions/${expressionId}/context/${expressionContextId}`);
}

export async function deleteSentence(
  sentenceId: string,
  expressionId: string,
  expressionContextId: string,
) {
  await authFetch(`${BACKEND_URL}/dictionary/sentences/${sentenceId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  revalidatePath(`/expressions/${expressionId}/context/${expressionContextId}`);
}

export async function updateSentence(
  sentenceId: string,
  expressionId: string,
  expressionContextId: string,
  data: CreateSentenceData,
) {
  await authFetch(`${BACKEND_URL}/dictionary/sentences/${sentenceId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...data }),
  });

  revalidatePath(`/expressions/${expressionId}/context/${expressionContextId}`);
}

export async function updateVerbExpressionContext(
  expressionContextId: string,
  expressionId: string,
  data: CreateOnlyTranslationExpressionContextData,
) {
  await authFetch(
    `${BACKEND_URL}/dictionary/expression-contexts/${expressionContextId}/verb`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...data }),
    },
  );

  revalidatePath(`/expressions/${expressionId}`);
}

export async function updateAdjectiveExpressionContext(
  expressionContextId: string,
  expressionId: string,
  data: CreateOnlyTranslationExpressionContextData,
) {
  await authFetch(
    `${BACKEND_URL}/dictionary/expression-contexts/${expressionContextId}/adjective`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...data }),
    },
  );

  revalidatePath(`/expressions/${expressionId}`);
}

export async function updateAdverbExpressionContext(
  expressionContextId: string,
  expressionId: string,
  data: CreateOnlyTranslationExpressionContextData,
) {
  await authFetch(
    `${BACKEND_URL}/dictionary/expression-contexts/${expressionContextId}/adverb`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...data }),
    },
  );

  revalidatePath(`/expressions/${expressionId}`);
}

export async function updatePhrasalAdverbExpressionContext(
  expressionContextId: string,
  expressionId: string,
  data: CreateOnlyTranslationExpressionContextData,
) {
  await authFetch(
    `${BACKEND_URL}/dictionary/expression-contexts/${expressionContextId}/phrasal-verb`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...data }),
    },
  );

  revalidatePath(`/expressions/${expressionId}`);
}

export async function updateNounExpressionContext(
  expressionContextId: string,
  expressionId: string,
  data: CreateNounExpressionContextData,
) {
  await authFetch(
    `${BACKEND_URL}/dictionary/expression-contexts/${expressionContextId}/noun`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...data }),
    },
  );

  revalidatePath(`/expressions/${expressionId}`);
}

export async function updateIrregularVerbExpressionContext(
  expressionContextId: string,
  expressionId: string,
  data: CreateIrregularVerbExpressionContextData,
) {
  await authFetch(
    `${BACKEND_URL}/dictionary/expression-contexts/${expressionContextId}/irregular-verb`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        translation: data.translation,
        forms: [data.form1, data.form2, data.form3],
      }),
    },
  );

  revalidatePath(`/expressions/${expressionId}`);
}
