import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/lib/db-pool";
import { exportQueue } from "@/src/db/schema";
import { verifySessionToken, COOKIE_NAME } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(COOKIE_NAME)?.value;

  if (!sessionToken) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let email: string;
  try {
    const payload = await verifySessionToken(sessionToken);
    email = payload.email;
  } catch {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { state, zip, delimiter, enclosure } = body as Record<string, unknown>;

  const stateVal = typeof state === "string" ? state.trim().toUpperCase() : "";
  const zipVal = typeof zip === "string" ? zip.trim() : "";
  const delimiterVal = typeof delimiter === "string" ? delimiter : ",";
  const enclosureVal = typeof enclosure === "string" ? enclosure : '"';

  const errors: string[] = [];

  if (stateVal && !/^([A-Z]{2}|\*\*)$/.test(stateVal)) {
    errors.push("State must be a two-letter abbreviation or **.");
  }
  if (zipVal && !/^\d{5}$/.test(zipVal)) {
    errors.push("Zip must be a 5-digit code.");
  }
  if (stateVal && zipVal) {
    errors.push("Specify either State or Zip, not both.");
  }
  if (!stateVal && !zipVal) {
    errors.push("Either State or Zip is required.");
  }
  if (!delimiterVal || delimiterVal.length !== 1) {
    errors.push("Delimiter must be a single character.");
  }
  if (!enclosureVal || enclosureVal.length !== 1) {
    errors.push("Enclosure must be a single character.");
  }

  if (errors.length > 0) {
    return NextResponse.json({ error: errors.join(" ") }, { status: 422 });
  }

  await db.insert(exportQueue).values({
    email,
    state: stateVal || null,
    zip: zipVal || null,
    delimiter: delimiterVal,
    enclosure: enclosureVal,
  });

  return NextResponse.json({ ok: true });
}
