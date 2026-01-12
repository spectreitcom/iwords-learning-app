"use server";

import { BACKEND_URL } from "@/lib/constants";
import {
  createExpressionContextResponseSchema,
  createExpressionResponseSchema,
  expressionContextDetailsSchema,
  expressionContextSchema,
  expressionSchema,
  generateExpressionContextDefinitionResponseSchema,
  generateSentencesForExpressionContextResponseSchema,
  searchedDictionaryExpressionSchema,
} from "@/features/dictionary/types";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  CreateExpressionContextDefinitionData,
  CreateExpressionData,
  CreateIrregularVerbExpressionContextData,
  CreateNounExpressionContextData,
  CreateOnlyTranslationExpressionContextData,
  CreateSentenceData,
} from "@/features/dictionary/schemas";
import { authFetch } from "@/lib/auth-fetch";
import { collectionWithPaginationSchema } from "@/lib/types";
import { z } from "zod";

export async function getExpressions(page = 1, searchText?: string, take = 20) {
  try {
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

    const data = await response.json();
    return collectionWithPaginationSchema(expressionSchema).parse(data);
  } catch (error) {
    console.error("Error in getExpressions:", error);
    throw error;
  }
}

export async function deleteExpression(expressionId: string) {
  try {
    await authFetch(`${BACKEND_URL}/dictionary/expressions/${expressionId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    revalidatePath("/expressions");
    redirect("/expressions");
  } catch (error) {
    console.error("Error in deleteExpression:", error);
    throw error;
  }
}

export async function createExpression(data: CreateExpressionData) {
  try {
    const response = await authFetch(`${BACKEND_URL}/dictionary/expressions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...data }),
    });

    revalidatePath("/expressions");

    const responseData = await response.json();
    return createExpressionResponseSchema.parse(responseData);
  } catch (error) {
    console.error("Error in createExpression:", error);
    throw error;
  }
}

export async function updateExpression(
  expressionId: string,
  data: CreateExpressionData,
) {
  try {
    await authFetch(`${BACKEND_URL}/dictionary/expressions/${expressionId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...data }),
    });

    revalidatePath(`/expressions`);
  } catch (error) {
    console.error("Error in updateExpression:", error);
    throw error;
  }
}

export async function getExpression(expressionId: string) {
  try {
    const response = await authFetch(
      `${BACKEND_URL}/dictionary/expressions/${expressionId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (response.status === 404 || response.status === 400)
      return redirect("/expressions");

    const data = await response.json();
    return expressionSchema.parse(data);
  } catch (error) {
    console.error("Error in getExpression:", error);
    throw error;
  }
}

export async function getExpressionContexts(
  expressionId: string,
  page = 1,
  take = 20,
) {
  try {
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

    const data = await response.json();
    return collectionWithPaginationSchema(expressionContextSchema).parse(data);
  } catch (error) {
    console.error("Error in getExpressionContexts:", error);
    throw error;
  }
}

export async function getExpressionContextDetails(expressionContextId: string) {
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

    if (response.status === 404 || response.status === 400)
      return redirect("/expressions");

    const data = await response.json();
    return expressionContextDetailsSchema.parse(data);
  } catch (error) {
    console.error("Error in getExpressionContextDetails:", error);
    throw error;
  }
}

export async function createVerbExpressionContext(
  expressionId: string,
  data: CreateOnlyTranslationExpressionContextData,
) {
  try {
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

    const responseData = await response.json();
    return createExpressionContextResponseSchema.parse(responseData);
  } catch (error) {
    console.error("Error in createVerbExpressionContext:", error);
    throw error;
  }
}

export async function createAdjectiveExpressionContext(
  expressionId: string,
  data: CreateOnlyTranslationExpressionContextData,
) {
  try {
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

    const responseData = await response.json();
    return createExpressionContextResponseSchema.parse(responseData);
  } catch (error) {
    console.error("Error in createAdjectiveExpressionContext:", error);
    throw error;
  }
}

export async function createPhrasalVerbExpressionContext(
  expressionId: string,
  data: CreateOnlyTranslationExpressionContextData,
) {
  try {
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

    const responseData = await response.json();
    return createExpressionContextResponseSchema.parse(responseData);
  } catch (error) {
    console.error("Error in createPhrasalVerbExpressionContext:", error);
    throw error;
  }
}

export async function createAdverbExpressionContext(
  expressionId: string,
  data: CreateOnlyTranslationExpressionContextData,
) {
  try {
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

    const responseData = await response.json();
    return createExpressionContextResponseSchema.parse(responseData);
  } catch (error) {
    console.error("Error in createAdverbExpressionContext:", error);
    throw error;
  }
}

export async function createNounExpressionContext(
  expressionId: string,
  data: CreateNounExpressionContextData,
) {
  try {
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

    const responseData = await response.json();
    return createExpressionContextResponseSchema.parse(responseData);
  } catch (error) {
    console.error("Error in createNounExpressionContext:", error);
    throw error;
  }
}

export async function createIrregularVerbExpressionContext(
  expressionId: string,
  data: CreateIrregularVerbExpressionContextData,
) {
  try {
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

    const responseData = await response.json();
    return createExpressionContextResponseSchema.parse(responseData);
  } catch (error) {
    console.error("Error in createIrregularVerbExpressionContext:", error);
    throw error;
  }
}

export async function createSimpleExpressionExpressionContext(
  expressionId: string,
  data: CreateOnlyTranslationExpressionContextData,
) {
  try {
    const response = await authFetch(
      `${BACKEND_URL}/dictionary/expression-contexts/simple`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data, expressionId }),
      },
    );

    revalidatePath(`/expressions/${expressionId}`);

    const responseData = await response.json();
    return createExpressionContextResponseSchema.parse(responseData);
  } catch (error) {
    console.error("Error in createSimpleExpressionExpressionContext:", error);
    throw error;
  }
}

export async function deleteExpressionContext(expressionContextId: string) {
  try {
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
  } catch (error) {
    console.error("Error in deleteExpressionContext:", error);
    throw error;
  }
}

export async function createSentence(
  expressionId: string,
  expressionContextId: string,
  payload: CreateSentenceData,
) {
  try {
    await authFetch(`${BACKEND_URL}/dictionary/sentences`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...payload, expressionContextId }),
    });

    revalidatePath(
      `/expressions/${expressionId}/context/${expressionContextId}`,
    );
  } catch (error) {
    console.error("Error in createSentence:", error);
    throw error;
  }
}

export async function deleteSentence(
  sentenceId: string,
  expressionId: string,
  expressionContextId: string,
) {
  try {
    await authFetch(`${BACKEND_URL}/dictionary/sentences/${sentenceId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    revalidatePath(
      `/expressions/${expressionId}/context/${expressionContextId}`,
    );
  } catch (error) {
    console.error("Error in deleteSentence:", error);
    throw error;
  }
}

export async function updateSentence(
  sentenceId: string,
  expressionId: string,
  expressionContextId: string,
  data: CreateSentenceData,
) {
  try {
    await authFetch(`${BACKEND_URL}/dictionary/sentences/${sentenceId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...data }),
    });

    revalidatePath(
      `/expressions/${expressionId}/context/${expressionContextId}`,
    );
  } catch (error) {
    console.error("Error in updateSentence:", error);
    throw error;
  }
}

export async function updateVerbExpressionContext(
  expressionContextId: string,
  expressionId: string,
  data: CreateOnlyTranslationExpressionContextData,
) {
  try {
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
  } catch (error) {
    console.error("Error in updateVerbExpressionContext:", error);
    throw error;
  }
}

export async function updateAdjectiveExpressionContext(
  expressionContextId: string,
  expressionId: string,
  data: CreateOnlyTranslationExpressionContextData,
) {
  try {
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
  } catch (error) {
    console.error("Error in updateAdjectiveExpressionContext:", error);
    throw error;
  }
}

export async function updateAdverbExpressionContext(
  expressionContextId: string,
  expressionId: string,
  data: CreateOnlyTranslationExpressionContextData,
) {
  try {
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
  } catch (error) {
    console.error("Error in updateAdverbExpressionContext:", error);
    throw error;
  }
}

export async function updatePhrasalAdverbExpressionContext(
  expressionContextId: string,
  expressionId: string,
  data: CreateOnlyTranslationExpressionContextData,
) {
  try {
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
  } catch (error) {
    console.error("Error in updatePhrasalAdverbExpressionContext:", error);
    throw error;
  }
}

export async function updateNounExpressionContext(
  expressionContextId: string,
  expressionId: string,
  data: CreateNounExpressionContextData,
) {
  try {
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
  } catch (error) {
    console.error("Error in updateNounExpressionContext:", error);
    throw error;
  }
}

export async function updateIrregularVerbExpressionContext(
  expressionContextId: string,
  expressionId: string,
  data: CreateIrregularVerbExpressionContextData,
) {
  try {
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
  } catch (error) {
    console.error("Error in updateIrregularVerbExpressionContext:", error);
    throw error;
  }
}

export async function updateSimpleExpressionExpressionContext(
  expressionContextId: string,
  expressionId: string,
  data: CreateOnlyTranslationExpressionContextData,
) {
  try {
    await authFetch(
      `${BACKEND_URL}/dictionary/expression-contexts/${expressionContextId}/simple`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data }),
      },
    );

    revalidatePath(`/expressions/${expressionId}`);
  } catch (error) {
    console.error("Error in updateSimpleExpressionExpressionContext:", error);
    throw error;
  }
}

export async function searchDictionaryExpressions(
  searchText: string,
  page = 1,
  take = 20,
) {
  try {
    const urlSearchParams = new URLSearchParams();

    urlSearchParams.append("page", page.toString());
    urlSearchParams.append("take", take.toString());

    if (searchText) {
      urlSearchParams.append("searchText", searchText);
    }

    const response = await authFetch(
      `${BACKEND_URL}/dictionary/search?${urlSearchParams.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const data = await response.json();
    return collectionWithPaginationSchema(
      searchedDictionaryExpressionSchema,
    ).parse(data);
  } catch (error) {
    console.error("Error in searchDictionaryExpressions:", error);
    throw error;
  }
}

export async function getExpressionsNumber() {
  try {
    const response = await authFetch(
      `${BACKEND_URL}/dictionary/expressions/count`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const data = await response.json();
    return z.object({ expressionsNumber: z.number() }).parse(data);
  } catch (error) {
    console.error("Error in getExpressionsNumber:", error);
    throw error;
  }
}

export async function updateExpressionContextDefinition(
  expressionContextId: string,
  data: CreateExpressionContextDefinitionData,
) {
  try {
    await authFetch(
      `${BACKEND_URL}/dictionary/expression-contexts/${expressionContextId}/definition`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data }),
      },
    );
  } catch (error) {
    console.error("Error in updateExpressionContextDefinition:", error);
    throw error;
  }
}

export async function generateExpressionContextDefinition(
  expressionContextId: string,
) {
  try {
    const response = await authFetch(
      `${BACKEND_URL}/dictionary/ai/expression-context/${expressionContextId}/generate-definition`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to generate definition");
    }

    const responseData = await response.json();
    return generateExpressionContextDefinitionResponseSchema.parse(
      responseData,
    );
  } catch (error) {
    console.error("Error in generateExpressionContextDefinition:", error);
    throw error;
  }
}

export async function generateSentencesForExpressionContext(
  expressionContextId: string,
) {
  try {
    const response = await authFetch(
      `${BACKEND_URL}/dictionary/ai/expression-context/${expressionContextId}/generate-sentences`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to generate sentences");
    }

    const responseData = await response.json();
    return generateSentencesForExpressionContextResponseSchema.parse(
      responseData,
    );
  } catch (error) {
    console.error("Error in generateSentencesForExpressionContext:", error);
    throw error;
  }
}
