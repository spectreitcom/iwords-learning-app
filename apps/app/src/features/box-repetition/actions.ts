"use server";

import { boxRepetitionSchema } from "@/features/box-repetition/types";
import { authFetch } from "@/lib/auth-fetch";
import { BACKEND_URL } from "@/lib/constants";
import { z } from "zod";

export async function getBoxRepetitions() {
  try {
    const response = await authFetch(`${BACKEND_URL}/boxes/today`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return z.array(boxRepetitionSchema).parse(data);
  } catch (error) {
    console.error("Error in getBoxRepetitions:", error);
    throw error;
  }
}
