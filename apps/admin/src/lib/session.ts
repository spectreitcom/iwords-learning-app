import { SECRET_KEY } from "@/lib/constants";
import { cookies } from "next/headers";
import { jwtVerify, SignJWT } from "jose";

export type Session = {
  id: string;
  email: string;
  name: string;
  accessToken: string;
  refreshToken: string;
};

const encodedKey = new TextEncoder().encode(SECRET_KEY);

export async function createSession(payload: Session) {
  const session = await new SignJWT(payload)
    .setProtectedHeader({
      alg: "HS256",
    })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);

  const expiredAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const cookiesStore = await cookies();
  cookiesStore.set("session", session, {
    httpOnly: true,
    secure: true,
    expires: expiredAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function deleteSession() {
  const cookiesStore = await cookies();
  cookiesStore.delete("session");
}

export async function getSession() {
  const cookiesStore = await cookies();
  const session = cookiesStore.get("session")?.value;
  if (!session) return null;

  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });

    return payload as Session;
  } catch (e) {
    console.error("Failed to verify session: ", e);
    return null;
  }
}
