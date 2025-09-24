import { getSession } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/auth/sign-in"];

export async function middleware(request: NextRequest) {
  if (
    request.nextUrl.pathname.startsWith("/") &&
    !PUBLIC_PATHS.includes(request.nextUrl.pathname)
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
