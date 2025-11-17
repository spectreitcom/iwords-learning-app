import { getSession } from "@/lib/session";

interface AuthFetchOptions extends RequestInit {
  headers?: Record<string, string>;
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

  return await fetch(url, init);
}
