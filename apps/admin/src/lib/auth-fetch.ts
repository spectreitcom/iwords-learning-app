import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

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

  if (response.status === 401) {
    redirect("/auth/sign-in");
    // const newAccessToken = await refreshToken();
    // init.headers.Authorization = `Bearer ${newAccessToken}`;
    // response = await fetch(url, init);
  }

  return response;
}
