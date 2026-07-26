import { LatLng } from "./map-types";
import { db } from "@/lib/db-pool";
import { zipcodes } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import logger from "@/lib/logger";

const ZIPCODE_RE = /^\d{5}$/;

type ZipcodeRow = {
  lat: string | null;
  lng: string | null;
  responseCode: number | null;
};

export async function GeocodeZipcode(rawZipcode: string): Promise<LatLng> {
  const zipcode = rawZipcode.trim();

  if (!ZIPCODE_RE.test(zipcode)) {
    throw new Error(`for-user: ${rawZipcode} is not a valid zipcode`);
  }

  const row = await getZipcodeRow(zipcode);

  // The zipcodes table is the authoritative list of valid US zipcodes. A zip
  // that isn't in the table is not one we recognize — don't geocode it (that
  // would let bots burn through the Geocodio allowance on garbage input).
  if (!row) {
    throw new Error(`for-user: ${zipcode} is not a valid zipcode`);
  }

  // Already geocoded successfully.
  if (row.responseCode === 200 && row.lat !== null && row.lng !== null) {
    return { lat: parseFloat(row.lat), lng: parseFloat(row.lng) };
  }

  // 422 = Geocodio processed the request but found no match. It's good enough
  // that we trust it and treat the zip as invalid rather than retrying.
  if (row.responseCode === 422) {
    throw new Error(`for-user: ${zipcode} is not a valid zipcode`);
  }

  // response_code is null (never attempted) or a transient failure such as 403
  // (daily allowance exhausted) or a network/technical error — worth retrying.
  const { status, location } = await geocodeWithGeocodio(zipcode);

  await updateZipcode(zipcode, status, location);

  if (status !== 200 || !location) {
    throw new Error(
      `for-user: We are unable to geocode ${zipcode} at this time.`,
    );
  }

  return location;
}

// Reads the row for this zip. A DB failure is a system problem, not a signal
// that the zip is invalid, so surface it as a generic error rather than
// returning null (which would tell the user the zip doesn't exist).
async function getZipcodeRow(zipcode: string): Promise<ZipcodeRow | null> {
  try {
    const [row] = await db
      .select({
        lat: zipcodes.lat,
        lng: zipcodes.lng,
        responseCode: zipcodes.responseCode,
      })
      .from(zipcodes)
      .where(eq(zipcodes.zipcode, zipcode));

    return row ?? null;
  } catch (err) {
    logger.error("zipcode table read failed", {
      event: "zipcode_table_read_error",
      zipcode,
      error: err instanceof Error ? err.message : String(err),
    });
    throw new Error(`zipcode table read failed for ${zipcode}`);
  }
}

async function geocodeWithGeocodio(
  zipcode: string,
): Promise<{ status: number; location: LatLng | null }> {
  const params = new URLSearchParams({
    postal_code: zipcode,
    country: "US",
    api_key: process.env.GEOCODIO_API_KEY!,
  });

  const response = await fetch(`https://api.geocod.io/v2/geocode?${params}`);

  if (response.status !== 200) {
    return { status: response.status, location: null };
  }

  const data = await response.json();
  const location = data?.results?.[0]?.location;

  if (
    !location ||
    typeof location.lat !== "number" ||
    typeof location.lng !== "number"
  ) {
    return { status: response.status, location: null };
  }

  return { status: response.status, location: { lat: location.lat, lng: location.lng } };
}

// Best-effort write: the geocode result is still returned even if we can't
// persist it. The row always exists (we only reach here after finding it), so
// this only ever updates. lat/lng are left untouched when we didn't get a
// location, so an existing value survives a transient failure.
//
// Only 200 and 422 are recorded — a definitive success or "no such zip". Any
// other code (403 rate limit, network/technical error) leaves response_code as
// it was so the zip is retried later. This keeps response_code to null/200/422,
// matching haminfo-cli's zip-geocode.ts.
async function updateZipcode(
  zipcode: string,
  status: number,
  location: LatLng | null,
): Promise<void> {
  if (status !== 200 && status !== 422) {
    return;
  }

  const set = location
    ? {
        responseCode: status,
        lat: location.lat.toString(),
        lng: location.lng.toString(),
      }
    : { responseCode: status };

  try {
    await db.update(zipcodes).set(set).where(eq(zipcodes.zipcode, zipcode));
  } catch (err) {
    logger.error("zipcode table write failed", {
      event: "zipcode_table_write_error",
      zipcode,
      error: err instanceof Error ? err.message : String(err),
    });
  }
}
