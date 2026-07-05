import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db-pool";
import { appUsers, magicLinkTokens } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { randomBytes } from "crypto";
import { sendMagicLinkEmail } from "@/lib/email";

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
    return NextResponse.json({ ok: true });
  }

  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  await db.insert(magicLinkTokens).values({ email, token, expiresAt });

  const magicLink = `${process.env.BASE_URL}/api/auth/verify?token=${token}`;

  try {
    await sendMagicLinkEmail(email, magicLink);
  } catch (err) {
    console.error("Failed to send magic link email:", err);
    return NextResponse.json({ error: "Failed to send email. Please try again later." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
