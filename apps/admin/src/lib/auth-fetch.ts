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

  const response = await fetch(url, init);

  // UWAGA: Nie wykonujemy tutaj redirectów. Helper zwraca odpowiedź,
  // a decyzja o nawigacji (np. przekierowanie na stronę logowania przy 401)
  // pozostaje wyżej (akcja/strona). Patrz: info/admin.md — punkt 4.
  return response;
}
