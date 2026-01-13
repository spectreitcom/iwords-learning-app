"use server";

import { BACKEND_URL } from "@/lib/constants";
import { collectionWithPaginationSchema } from "@/lib/types";
import { boxDetailsSchema, boxSchema } from "@/features/boxes/types";
import { authFetch } from "@/lib/auth-fetch";
import { redirect } from "next/navigation";
import { z } from "zod";

export async function getBoxesList(page = 1, take = 20) {
  try {
    const urlSearchParams = new URLSearchParams({
      page: page.toString(),
      take: take.toString(),
    });

    const response = await authFetch(
      `${BACKEND_URL}/boxes?${urlSearchParams.toString()}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const data = await response.json();
    return collectionWithPaginationSchema(
      boxSchema.extend({
        isFinished: z.boolean(),
        isAlreadyStarted: z.boolean(),
        isNew: z.boolean(),
      }),
    ).parse(data);
  } catch (error) {
    console.error("Error in getBoxesList:", error);
    throw error;
  }
}

export async function getBoxDetails(boxId: string) {
  try {
    const response = await authFetch(`${BACKEND_URL}/boxes/${boxId}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 404 || response.status === 400)
      return redirect("/");

    const data = await response.json();

    return boxDetailsSchema.parse(data);
  } catch (error) {
    console.error("Error in getBoxDetails:", error);
    throw error;
  }
}

export async function finishBox(boxId: string) {
  try {
    await authFetch(`${BACKEND_URL}/boxes/${boxId}/finish`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error in finishBox:", error);
    throw error;
  }
}
