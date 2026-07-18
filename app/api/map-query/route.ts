import { NextRequest, NextResponse } from "next/server";
import { SearchQuery } from "@/lib/map-types";
import { doQuery } from "@/lib/location-query";
import logger from "@/lib/logger";

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
    const lat = Number(p.get("lat"));
    const lng = Number(p.get("lng"));
    if (
      Number.isFinite(lat) &&
      lat >= -90 &&
      lat <= 90 &&
      Number.isFinite(lng) &&
      lng >= -180 &&
      lng <= 180
    ) {
      query = { type: "point", lat, lng };
    }
  }

  if (!query) {
    return NextResponse.json(
      { error: "Invalid query parameters" },
      { status: 400 },
    );
  }

  try {
    const initialCallsign =
      query.type === "callsign" ? query.value : p.get("init-call");

    const response = await doQuery(query, initialCallsign);
    return NextResponse.json(response);
  } catch (e) {
    // "for-user:" errors are expected validation-style messages shown to the
    // user; anything else is an unexpected failure worth logging.
    const isUserError = e instanceof Error && e.message.startsWith("for-user:");

    if (!isUserError) {
      logger.error("map-query failed", {
        event: "map_query_error",
        query,
        error: e instanceof Error ? e.message : String(e),
        stack: e instanceof Error ? e.stack : undefined,
      });
    }

    const message = isUserError
      ? (e as Error).message.substring(9)
      : "Something went wrong.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
