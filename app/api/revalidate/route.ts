import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('token');

  if (secret !== process.env.REVALIDATE_STATUS_TOKEN) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }

  revalidatePath('/status');

  return NextResponse.json({ revalidated: true, now: Date.now() });
}
