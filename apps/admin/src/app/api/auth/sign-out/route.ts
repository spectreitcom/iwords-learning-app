import { deleteSession } from "@/lib/session";
import { authFetch } from "@/lib/auth-fetch";
import { BACKEND_URL } from "@/lib/constants";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await authFetch(`${BACKEND_URL}/auth/sign-out`, {
    method: "POST",
    noAuthRedirect: true,
  });
  await deleteSession();
  return NextResponse.redirect(new URL("/auth/sign-in", req.url));
}
