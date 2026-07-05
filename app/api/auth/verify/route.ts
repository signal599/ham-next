import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db-pool";
import { magicLinkTokens } from "@/src/db/schema";
import { and, eq, isNull, gt } from "drizzle-orm";
import { signSessionToken, COOKIE_NAME } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/login?error=invalid", process.env.BASE_URL));
  }

  const now = new Date();

  const [record] = await db
    .select()
    .from(magicLinkTokens)
    .where(
      and(
        eq(magicLinkTokens.token, token),
        isNull(magicLinkTokens.usedAt),
        gt(magicLinkTokens.expiresAt, now),
      )
    )
    .limit(1);

  if (!record) {
    return NextResponse.redirect(new URL("/login?error=invalid", process.env.BASE_URL));
  }

  await db
    .update(magicLinkTokens)
    .set({ usedAt: now })
    .where(eq(magicLinkTokens.id, record.id));

  const sessionToken = await signSessionToken(record.email);

  const response = NextResponse.redirect(new URL("/map", process.env.BASE_URL));
  response.cookies.set(COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });

  return response;
}
