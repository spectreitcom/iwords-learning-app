"use server";

import { authFetch } from "@/lib/auth-fetch";
import { BACKEND_URL } from "@/lib/constants";
import { repetitionSchema } from "@/features/repetitions/types";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function getRepetitions() {
  try {
    const response = await authFetch(`${BACKEND_URL}/repetitions`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return z.array(repetitionSchema).parse(data);
  } catch (error) {
    console.error("Error in getRepetitions:", error);
    throw error;
  }
}

export async function removeAllRepetitions() {
  try {
    await authFetch(`${BACKEND_URL}/repetitions/remove-all`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    revalidatePath("/repetitions");
  } catch (error) {
    console.error("Error in removeAllRepetitions:", error);
    throw error;
  }
}

export async function removeRepetition(repetitionId: string) {
  try {
    await authFetch(`${BACKEND_URL}/repetitions/${repetitionId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    revalidatePath("/repetitions");
  } catch (error) {
    console.error("Error in removeRepetition:", error);
    throw error;
  }
}

export async function addExpressionContextToRepetition(
  expressionContextId: string,
) {
  try {
    await authFetch(`${BACKEND_URL}/repetitions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ expressionContextId }),
    });

    revalidatePath("/repetitions");
  } catch (error) {
    console.error("Error in addExpressionContextToRepetition:", error);
    throw error;
  }
}
