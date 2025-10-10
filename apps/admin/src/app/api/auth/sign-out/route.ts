import { deleteSession } from "@/lib/session";
import { redirect, RedirectType } from "next/navigation";
import { authFetch } from "@/lib/auth-fetch";
import { BACKEND_URL } from "@/lib/constants";

export async function GET() {
  await authFetch(`${BACKEND_URL}/auth/sign-out`, {
    method: "POST",
  });
  await deleteSession();
  redirect("/auth/sign-in", RedirectType.push);
}
