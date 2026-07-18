import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { timingSafeEqual } from 'crypto';

// Constant-time comparison that tolerates missing / mismatched-length inputs.
function tokenMatches(
  provided: string | null | undefined,
  expected: string | undefined,
): boolean {
  if (!provided || !expected) return false;

  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;

  return timingSafeEqual(a, b);
}

// Prefer the token from a header; fall back to the query string so the
// existing caller keeps working. Once haminfo-cli sends the header, the
// query-string branch can be removed.
function getProvidedToken(request: NextRequest): string | null {
  const headerToken = request.headers.get('x-revalidate-token');
  if (headerToken) return headerToken;

  const auth = request.headers.get('authorization');
  if (auth?.startsWith('Bearer ')) return auth.slice('Bearer '.length);

  // TODO: remove query-string fallback once haminfo-cli sends the header.
  return request.nextUrl.searchParams.get('token');
}

export async function POST(request: NextRequest) {
  const provided = getProvidedToken(request);

  if (!tokenMatches(provided, process.env.REVALIDATE_STATUS_TOKEN)) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }

  revalidateTag('status', 'max');
  revalidatePath('/status');
  revalidatePath('/map', 'layout');
  revalidatePath('/api/map-query');

  return NextResponse.json({ revalidated: true, now: Date.now() });
}
