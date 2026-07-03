import { SignJWT, jwtVerify } from "jose";

export const COOKIE_NAME = "ham_session";

function getSecret(): Uint8Array {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not set");
  return new TextEncoder().encode(process.env.JWT_SECRET);
}

export interface SessionPayload {
  email: string;
  exp: number;
}

export async function signSessionToken(email: string): Promise<string> {
  return new SignJWT({ email })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(getSecret());
}

export async function verifySessionToken(token: string): Promise<SessionPayload> {
  const { payload } = await jwtVerify(token, getSecret());
  return payload as unknown as SessionPayload;
}
