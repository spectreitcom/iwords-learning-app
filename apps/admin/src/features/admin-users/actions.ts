"use server";

import { authFetch } from "@/lib/auth-fetch";
import { BACKEND_URL } from "@/lib/constants";
import { CollectionWithPagination } from "@/lib/types";
import { AdminUser } from "@/features/admin-users/types";
import {
  ChangePasswordData,
  InviteAdminUserData,
} from "@/features/admin-users/schemas";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

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

export async function requestForResetPassword(email: string) {
  await fetch(`${BACKEND_URL}/auth/request-reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });
}

export async function validateResetPasswordToken(token: string) {
  const response = await fetch(
    `${BACKEND_URL}/auth/validate-reset-password-token/${token}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  return (await response.json()) as { valid: boolean };
}

export async function resetPassword(token: string, password: string) {
  const response = await fetch(`${BACKEND_URL}/auth/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token, password }),
  });

  if (!response.ok) {
    return { error: true, message: "Invalid token" };
  }

  redirect("/auth/sign-in");
}

export async function changePassword(data: ChangePasswordData) {
  const response = await authFetch(`${BACKEND_URL}/auth/change-password`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...data }),
  });

  if (!response.ok) return { error: true, message: "Password was not changed" };
}
