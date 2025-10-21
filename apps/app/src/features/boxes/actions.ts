"use server";

import { BACKEND_URL } from "@/lib/constants";
import { CollectionWithPagination } from "@/lib/types";
import { Box, BoxDetails } from "@/features/boxes/types";
import { authFetch } from "@/lib/auth-fetch";

export async function getBoxesList(page = 1, take = 20) {
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

  return (await response.json()) as CollectionWithPagination<Box>;
}

export async function getBoxDetails(boxId: string) {
  const response = await authFetch(`${BACKEND_URL}/boxes/${boxId}`, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return (await response.json()) as BoxDetails;
}
