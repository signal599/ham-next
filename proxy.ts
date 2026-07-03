import { NextRequest, NextResponse } from "next/server";
import type { NextProxy, ProxyConfig } from "next/server";
import { verifySessionToken, COOKIE_NAME } from "@/lib/auth";

const PROTECTED = ["/export"];

const proxy: NextProxy = async (request: NextRequest) => {
  const { pathname } = request.nextUrl;

  if (!PROTECTED.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    await verifySessionToken(token);
    return NextResponse.next();
  } catch {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete(COOKIE_NAME);
    return response;
  }
};

export default proxy;

export const config: ProxyConfig = {
  matcher: ["/export/:path*"],
};
