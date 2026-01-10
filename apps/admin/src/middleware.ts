import { getSession } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

const publicPaths = new Set(["/auth/sign-in", "/auth/reset-password"]);

export async function middleware(request: NextRequest) {
  if (
    request.nextUrl.pathname.startsWith("/") &&
    !publicPaths.has(request.nextUrl.pathname)
  ) {
    const session = await getSession();

    if (!session) {
      return NextResponse.redirect(new URL("/auth/sign-in", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
