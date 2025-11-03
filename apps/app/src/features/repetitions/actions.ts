"use server";

import { authFetch } from "@/lib/auth-fetch";
import { BACKEND_URL } from "@/lib/constants";
import { Repetition } from "@/features/repetitions/types";
import { revalidatePath } from "next/cache";

export async function getRepetitions() {
  const response = await authFetch(`${BACKEND_URL}/repetitions`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return (await response.json()) as Repetition[];
}

export async function removeAllRepetitions() {
  await authFetch(`${BACKEND_URL}/repetitions/remove-all`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  revalidatePath("/repetitions");
}

export async function removeRepetition(repetitionId: string) {
  await authFetch(`${BACKEND_URL}/repetitions/${repetitionId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  revalidatePath("/repetitions");
}
