"use server";

import { authFetch } from "@/lib/auth-fetch";
import { BACKEND_URL } from "@/lib/constants";
import { CollectionWithPagination } from "@/lib/types";
import { AdminUser } from "@/features/admin-users/types";
import { InviteAdminUserData } from "@/features/admin-users/schemas";
import { revalidatePath } from "next/cache";

export async function getAdminUsers(page = 1, take = 20) {
  const urlSearchParams = new URLSearchParams();
  urlSearchParams.append("page", page.toString());
  urlSearchParams.append("take", take.toString());

  const response = await authFetch(
    `${BACKEND_URL}/admin-users?${urlSearchParams.toString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  return (await response.json()) as CollectionWithPagination<AdminUser>;
}

export async function inviteAdminUser(data: InviteAdminUserData) {
  await authFetch(`${BACKEND_URL}/admin-users/invite`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...data }),
  });

  revalidatePath("/admin-users");
}

export async function blockAdminUser(adminUserId: string) {
  await authFetch(`${BACKEND_URL}/admin-users/block`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ adminUserId }),
  });

  revalidatePath("/admin-users");
}

export async function unblockAdminUser(adminUserId: string) {
  await authFetch(`${BACKEND_URL}/admin-users/unblock`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ adminUserId }),
  });

  revalidatePath("/admin-users");
}
