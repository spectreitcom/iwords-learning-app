"use server";

import { authFetch } from "@/lib/auth-fetch";
import { BACKEND_URL } from "@/lib/constants";
import { CollectionWithPagination } from "@/lib/types";
import { AdminUser } from "@/features/admin-users/types";

export async function getAdminUsers(page = 1, take = 20) {
  const response = await authFetch(`${BACKEND_URL}/admin/admin-users`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return (await response.json()) as CollectionWithPagination<AdminUser>;
}
