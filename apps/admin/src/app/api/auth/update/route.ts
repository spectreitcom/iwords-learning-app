import { NextRequest } from "next/server";
import { LoginResponse } from "@/features/auth/types";
import { createSession } from "@/lib/session";

export async function POST(req: NextRequest) {
  const body: LoginResponse = await req.json();
  const { accessToken, refreshToken, user } = body;

  await createSession({
    accessToken,
    refreshToken,
    email: user.email,
    name: user.name,
    id: user.adminUserId,
  });

  return new Response("OK", { status: 200 });
}
