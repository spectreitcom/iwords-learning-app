"use server";

import { auth } from "@clerk/nextjs/server";

interface AuthFetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

export async function authFetch(
  url: string | URL,
  init: AuthFetchOptions = {},
) {
  const { isAuthenticated, getToken, redirectToSignIn } = await auth();

  if (!isAuthenticated) {
    redirectToSignIn();
  }

  const response = await fetch(url, {
    ...init,
    headers: {
      ...init.headers,
      Authorization: `Bearer ${await getToken()}`,
    },
  });

  if (response.status === 401) {
    redirectToSignIn();
  }

  return response;
}
