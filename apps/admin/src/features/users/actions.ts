"use server";

import { authFetch } from "@/lib/auth-fetch";
import { BACKEND_URL } from "@/lib/constants";
import { collectionWithPaginationSchema } from "@/lib/types";
import { userSchema } from "@/features/users/types";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function getUsers(page = 1, take = 20) {
  try {
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

    const data = await response.json();
    return collectionWithPaginationSchema(userSchema).parse(data);
  } catch (error) {
    console.error("Error in getUsers:", error);
    throw error;
  }
}

export async function blockUser(userId: string) {
  try {
    await authFetch(`${BACKEND_URL}/users/block`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });

    revalidatePath("/users");
  } catch (error) {
    console.error("Error in blockUser:", error);
    throw error;
  }
}

export async function unblockUser(userId: string) {
  try {
    await authFetch(`${BACKEND_URL}/users/unblock`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });

    revalidatePath("/users");
  } catch (error) {
    console.error("Error in unblockUser:", error);
    throw error;
  }
}

export async function getUsersNumber() {
  try {
    const response = await authFetch(`${BACKEND_URL}/users/count`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return z.object({ usersNumber: z.number() }).parse(data);
  } catch (error) {
    console.error("Error in getUsersNumber:", error);
    throw error;
  }
}
