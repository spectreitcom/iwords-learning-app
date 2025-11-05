"use server";

import { authFetch } from "@/lib/auth-fetch";
import { BACKEND_URL } from "@/lib/constants";
import { CollectionWithPagination } from "@/lib/types";
import { Box, BoxDetails } from "@/features/boxes/types";
import { CreateBoxData } from "@/features/boxes/schemas";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getBoxes(page = 1, take = 20) {
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

  return (await response.json()) as CollectionWithPagination<Box>;
}

export async function getBoxDetails(boxId: string) {
  const response = await authFetch(`${BACKEND_URL}/boxes/${boxId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.status === 404 || response.status === 400)
    return redirect("/boxes");

  return (await response.json()) as BoxDetails;
}

export async function createBox(data: CreateBoxData) {
  await authFetch(`${BACKEND_URL}/boxes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...data }),
  });

  revalidatePath("/boxes");
}

export async function deleteBox(boxId: string) {
  await authFetch(`${BACKEND_URL}/boxes/${boxId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  revalidatePath("/boxes");
}

export async function updateBox(boxId: string, data: CreateBoxData) {
  await authFetch(`${BACKEND_URL}/boxes/${boxId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...data }),
  });

  revalidatePath("/boxes");
}

export async function addItemToBox(boxId: string, expressionContextId: string) {
  await authFetch(`${BACKEND_URL}/boxes/${boxId}/add-item`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ expressionContextId }),
  });

  revalidatePath(`/boxes/${boxId}`);
}

export async function removeItemFromBox(
  boxId: string,
  expressionContextId: string,
) {
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
}

export async function getBoxesNumber() {
  const response = await authFetch(`${BACKEND_URL}/boxes/count`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return (await response.json()) as { boxesNumber: number };
}
