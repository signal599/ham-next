import { LatLng } from "./map-types";
import { db } from "@/lib/db-pool";
import { zipcodes } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import logger from "@/lib/logger";

const ZIPCODE_RE = /^\d{5}$/;

export async function GeocodeZipcode(rawZipcode: string): Promise<LatLng> {
  const zipcode = rawZipcode.trim();

  if (!ZIPCODE_RE.test(zipcode)) {
    throw new Error(`for-user: ${rawZipcode} is not a valid zipcode`);
  }

  const cached = await getCachedZipcode(zipcode);
  if (cached) {
    return cached;
  }

  const location = await geocodeWithGeocodio(zipcode);

  await cacheZipcode(zipcode, location);

  return location;
}

// Best-effort read: if the zipcodes table is missing or the query fails, treat
// it as a cache miss and fall back to Geocodio rather than failing the request.
async function getCachedZipcode(zipcode: string): Promise<LatLng | null> {
  try {
    const [row] = await db
      .select({ lat: zipcodes.lat, lng: zipcodes.lng })
      .from(zipcodes)
      .where(eq(zipcodes.zipcode, zipcode))
      .limit(1);

    if (!row) {
      return null;
    }

    return { lat: parseFloat(row.lat), lng: parseFloat(row.lng) };
  } catch (err) {
    logger.warn("zipcode cache read failed", {
      event: "zipcode_cache_read_error",
      zipcode,
      error: err instanceof Error ? err.message : String(err),
    });
    return null;
  }
}

async function geocodeWithGeocodio(zipcode: string): Promise<LatLng> {
  const params = new URLSearchParams({
    postal_code: zipcode,
    country: "US",
    api_key: process.env.GEOCODIO_API_KEY!,
  });

  const response = await fetch(`https://api.geocod.io/v2/geocode?${params}`);

  // 422 = Geocodio processed the request but found no match for this zip.
  if (response.status === 422) {
    throw new Error(`for-user: ${zipcode} is not a valid zipcode`);
  }

  // Any other non-2xx (auth, rate limit, outage) is a system problem, not the
  // user's fault — surface it as a generic error so it gets logged upstream.
  if (!response.ok) {
    throw new Error(
      `Geocodio request failed for zipcode ${zipcode}: HTTP ${response.status}`,
    );
  }

  const data = await response.json();
  const location = data?.results?.[0]?.location;

  if (
    !location ||
    typeof location.lat !== "number" ||
    typeof location.lng !== "number"
  ) {
    throw new Error(`for-user: Unable to get location for zipcode ${zipcode}`);
  }

  return { lat: location.lat, lng: location.lng };
}

// Best-effort write: a successful geocode is still returned even if we can't
// persist it. onDuplicateKeyUpdate keeps it idempotent if two requests race to
// cache the same zip.
async function cacheZipcode(zipcode: string, location: LatLng): Promise<void> {
  const lat = location.lat.toString();
  const lng = location.lng.toString();

  try {
    await db
      .insert(zipcodes)
      .values({ zipcode, lat, lng })
      .onDuplicateKeyUpdate({ set: { lat, lng } });
  } catch (err) {
    logger.error("zipcode cache write failed", {
      event: "zipcode_cache_write_error",
      zipcode,
      error: err instanceof Error ? err.message : String(err),
    });
  }
}
