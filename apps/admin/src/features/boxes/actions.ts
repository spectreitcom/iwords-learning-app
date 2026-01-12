"use server";

import { authFetch } from "@/lib/auth-fetch";
import { BACKEND_URL } from "@/lib/constants";
import { collectionWithPaginationSchema } from "@/lib/types";
import { boxDetailsSchema, boxSchema } from "@/features/boxes/types";
import { CreateBoxData } from "@/features/boxes/schemas";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

export async function getBoxes(page = 1, take = 20) {
  try {
    const urlSearchParams = new URLSearchParams();
    urlSearchParams.append("page", page.toString());
    urlSearchParams.append("take", take.toString());

    const response = await authFetch(
      `${BACKEND_URL}/boxes?${urlSearchParams.toString()}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const data = await response.json();
    return collectionWithPaginationSchema(boxSchema).parse(data);
  } catch (error) {
    console.error("Error in getBoxes:", error);
    throw error;
  }
}

export async function getBoxDetails(boxId: string) {
  try {
    const response = await authFetch(`${BACKEND_URL}/boxes/${boxId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 404 || response.status === 400)
      return redirect("/boxes");

    const data = await response.json();
    return boxDetailsSchema.parse(data);
  } catch (error) {
    console.error("Error in getBoxDetails:", error);
    throw error;
  }
}

export async function createBox(data: CreateBoxData) {
  try {
    await authFetch(`${BACKEND_URL}/boxes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...data }),
    });

    revalidatePath("/boxes");
  } catch (error) {
    console.error("Error in createBox:", error);
    throw error;
  }
}

export async function deleteBox(boxId: string) {
  try {
    await authFetch(`${BACKEND_URL}/boxes/${boxId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    revalidatePath("/boxes");
  } catch (error) {
    console.error("Error in deleteBox:", error);
    throw error;
  }
}

export async function updateBox(boxId: string, data: CreateBoxData) {
  try {
    await authFetch(`${BACKEND_URL}/boxes/${boxId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...data }),
    });

    revalidatePath("/boxes");
  } catch (error) {
    console.error("Error in updateBox:", error);
    throw error;
  }
}

export async function addItemToBox(boxId: string, expressionContextId: string) {
  try {
    await authFetch(`${BACKEND_URL}/boxes/${boxId}/add-item`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ expressionContextId }),
    });

    revalidatePath(`/boxes/${boxId}`);
  } catch (error) {
    console.error("Error in addItemToBox:", error);
    throw error;
  }
}

export async function removeItemFromBox(
  boxId: string,
  expressionContextId: string,
) {
  try {
    await authFetch(
      `${BACKEND_URL}/boxes/${boxId}/remove-item/${expressionContextId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    revalidatePath(`/boxes/${boxId}`);
  } catch (error) {
    console.error("Error in removeItemFromBox:", error);
    throw error;
  }
}

export async function getBoxesNumber() {
  try {
    const response = await authFetch(`${BACKEND_URL}/boxes/count`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return z.object({ boxesNumber: z.number() }).parse(data);
  } catch (error) {
    console.error("Error in getBoxesNumber:", error);
    throw error;
  }
}
