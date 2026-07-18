import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db-pool";
import { appUsers, magicLinkTokens } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { randomBytes } from "crypto";
import { sendMagicLinkEmail } from "@/lib/email";
import logger from "@/lib/logger";

function clientIp(req: NextRequest): string | undefined {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? undefined;
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const raw = (body as Record<string, unknown>)?.email;
  if (typeof raw !== "string" || !raw.trim()) {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }
  const email = raw.trim().toLowerCase();

  const [user] = await db
    .select({ id: appUsers.id })
    .from(appUsers)
    .where(eq(appUsers.email, email))
    .limit(1);

  // Always return ok to prevent user enumeration.
  if (!user) {
    logger.warn("login attempt for unknown email", {
      event: "login_unknown_email",
      email,
      ip: clientIp(req),
    });
    return NextResponse.json({ ok: true });
  }

  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  await db.insert(magicLinkTokens).values({ email, token, expiresAt });

  const magicLink = `${process.env.BASE_URL}/api/auth/verify?token=${token}`;

  try {
    await sendMagicLinkEmail(email, magicLink);
  } catch (err) {
    logger.error("failed to send magic link email", {
      event: "email_send_error",
      email,
      error: err instanceof Error ? err.message : String(err),
    });
    return NextResponse.json({ error: "Failed to send email. Please try again later." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
