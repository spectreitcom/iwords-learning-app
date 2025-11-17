import { getSession } from "@/lib/session";

interface AuthFetchOptions extends RequestInit {
  headers?: Record<string, string>;
  noAuthRedirect?: boolean;
}

export async function authFetch(
  url: string | URL,
  init: AuthFetchOptions = {},
) {
  const session = await getSession();

  init.headers = {
    ...init.headers,
    Authorization: `Bearer ${session?.accessToken}`,
  };

  const response = await fetch(url, init);

  if (response.status === 401 && !init.noAuthRedirect) {
    const { redirect } = await import("next/navigation");
    redirect("/api/auth/sign-out");
  }

  return response;
}
