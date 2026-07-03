import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAME } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const response = NextResponse.redirect(new URL("/map", req.url));
  response.cookies.delete(COOKIE_NAME);
  return response;
}
