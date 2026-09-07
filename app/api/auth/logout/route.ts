import { NextResponse } from "next/server";
import { COOKIE_NAME } from "@/lib/auth";

export async function POST() {
  const response = NextResponse.redirect(new URL("/map", process.env.BASE_URL));
  response.cookies.delete(COOKIE_NAME);
  return response;
}
