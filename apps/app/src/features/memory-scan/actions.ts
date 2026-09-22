"use server";

import { authFetch } from "@/lib/auth-fetch";
import { BACKEND_URL } from "@/lib/constants";
import {
  memoryScanViewSchema,
  saveMemoryScanResultInputSchema,
} from "@/features/memory-scan/types";
import { revalidatePath } from "next/cache";

export async function getMemoryScanView() {
  try {
    const response = await authFetch(`${BACKEND_URL}/memory-scan/view`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return memoryScanViewSchema.safeParse(data);
  } catch (error) {
    console.log(`Error fetching memory scan view:`, error);
    throw error;
  }
}

export async function saveMemoryScanResult(
  rememberedItemsCount: number,
  rememberingTime: number,
) {
  const validationResult = saveMemoryScanResultInputSchema.safeParse({
    rememberedItemsCount,
    rememberingTime,
  });

  if (!validationResult.success) throw new Error("Invalid input");

  try {
    const response = await authFetch(`${BACKEND_URL}/memory-scan`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validationResult.data),
    });

    if (!response.ok) {
      throw new Error(`Error saving memory scan result: ${response.status}`);
    }
    revalidatePath("/memory-scan");
  } catch (error) {
    console.log(`Error saving memory scan result:`, error);
    throw error;
  }
}
