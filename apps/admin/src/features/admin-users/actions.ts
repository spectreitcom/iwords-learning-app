"use server";

import { authFetch } from "@/lib/auth-fetch";
import { BACKEND_URL } from "@/lib/constants";
import { collectionWithPaginationSchema } from "@/lib/types";
import { adminUserSchema } from "@/features/admin-users/types";
import {
  ChangePasswordData,
  InviteAdminUserData,
} from "@/features/admin-users/schemas";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

export async function getAdminUsers(page = 1, take = 20) {
  try {
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

    const data = await response.json();
    return collectionWithPaginationSchema(adminUserSchema).parse(data);
  } catch (error) {
    console.error("Error in getAdminUsers:", error);
    throw error;
  }
}

export async function inviteAdminUser(data: InviteAdminUserData) {
  try {
    await authFetch(`${BACKEND_URL}/admin-users/invite`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...data }),
    });

    revalidatePath("/admin-users");
  } catch (error) {
    console.error("Error in inviteAdminUser:", error);
    throw error;
  }
}

export async function blockAdminUser(adminUserId: string) {
  try {
    await authFetch(`${BACKEND_URL}/admin-users/block`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ adminUserId }),
    });

    revalidatePath("/admin-users");
  } catch (error) {
    console.error("Error in blockAdminUser:", error);
    throw error;
  }
}

export async function unblockAdminUser(adminUserId: string) {
  try {
    await authFetch(`${BACKEND_URL}/admin-users/unblock`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ adminUserId }),
    });

    revalidatePath("/admin-users");
  } catch (error) {
    console.error("Error in unblockAdminUser:", error);
    throw error;
  }
}

export async function requestForResetPassword(email: string) {
  try {
    await fetch(`${BACKEND_URL}/auth/request-reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
  } catch (error) {
    console.error("Error in requestForResetPassword:", error);
    throw error;
  }
}

export async function validateResetPasswordToken(token: string) {
  try {
    const response = await fetch(
      `${BACKEND_URL}/auth/validate-reset-password-token/${token}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const data = await response.json();
    return z.object({ valid: z.boolean() }).parse(data);
  } catch (error) {
    console.error("Error in validateResetPasswordToken:", error);
    throw error;
  }
}

export async function resetPassword(token: string, password: string) {
  try {
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
  } catch (error) {
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error;
    }
    console.error("Error in resetPassword:", error);
    throw error;
  }
}

export async function changePassword(data: ChangePasswordData) {
  try {
    const response = await authFetch(`${BACKEND_URL}/auth/change-password`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...data }),
    });

    if (!response.ok)
      return { error: true, message: "Password was not changed" };
  } catch (error) {
    console.error("Error in changePassword:", error);
    throw error;
  }
}
