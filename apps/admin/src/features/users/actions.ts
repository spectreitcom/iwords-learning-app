"use server";

import { authFetch } from "@/lib/auth-fetch";
import { BACKEND_URL } from "@/lib/constants";
import { CollectionWithPagination } from "@/lib/types";
import { User } from "@/features/users/types";
import { revalidatePath } from "next/cache";

export async function getUsers(page = 1, take = 20) {
  const urlSearchParams = new URLSearchParams();
  urlSearchParams.append("page", page.toString());
  urlSearchParams.append("take", take.toString());
  const response = await authFetch(
    `${BACKEND_URL}/users?${urlSearchParams.toString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  return (await response.json()) as CollectionWithPagination<User>;
}

export async function blockUser(userId: string) {
  await authFetch(`${BACKEND_URL}/users/block`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId }),
  });

  revalidatePath("/users");
}

export async function unblockUser(userId: string) {
  await authFetch(`${BACKEND_URL}/users/unblock`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId }),
  });

  revalidatePath("/users");
}

export async function getUsersNumber() {
  const response = await authFetch(`${BACKEND_URL}/users/count`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return (await response.json()) as { usersNumber: number };
}
