import { NextRequest, NextResponse } from "next/server";
import { SearchQuery } from "@/lib/map-types";
import { doQuery } from "@/lib/location-query";

export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams;
  const type = p.get("type");

  let query: SearchQuery | null = null;

  if (type === "callsign" && p.get("value")) {
    query = { type: "callsign", value: p.get("value")! };
  } else if (type === "gridsquare" && p.get("value")) {
    query = { type: "gridsquare", value: p.get("value")! };
  } else if (type === "zipcode" && p.get("value")) {
    query = { type: "zipcode", value: p.get("value")! };
  } else if (type === "point" && p.get("lat") && p.get("lng")) {
    query = {
      type: "point",
      lat: Number(p.get("lat")),
      lng: Number(p.get("lng")),
    };
  }

  if (!query) {
    return NextResponse.json(
      { error: "Invalid query parameters" },
      { status: 400 },
    );
  }

  try {
    const response = await doQuery(query, p.get("init-call"));
    return NextResponse.json(response);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Server error" },
      { status: 500 },
    );
  }
}
