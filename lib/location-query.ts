import { hamLocation } from "@/src/db/schema";
import { and, asc, between, desc, isNotNull, lt, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";

const MILES_PER_DEGREE = 69.0;
const RADIUS = 20;

export async function doQuery(query) {
  const lat = 42.801469;
  const lng = -71.741511;

  const locations = getLocations(lat, lng, RADIUS);
}

async function getLocations(lat: number, lng: number, radius: number) {
  const db = drizzle(process.env.DATABASE_URL!);
  const locationAlias = "ham_location";
  const distanceFormula = buildDistanceFormula(lat, lng, locationAlias);
  const boundingBoxFormula = buildBoundingBoxFormula(
    lat,
    lng,
    radius,
    locationAlias,
  );

  const rows = await db
    .select({
      id: hamLocation.id,
      lat: hamLocation.latitude,
      lng: hamLocation.longitude,
      distance: sql.raw(distanceFormula),
    })
    .from(hamLocation)
    .where(
      and(
        sql.raw(boundingBoxFormula),
        lt(sql.raw(distanceFormula), radius),
        isNotNull(hamLocation.latitude),
        isNotNull(hamLocation.longitude),
      ),
    )
    .orderBy(asc(sql.raw(distanceFormula)))
    .limit(200);

  return rows.map((location) => {
    return {
      id: location.id,
      lat: parseFloat(location.lat!),
      lng: parseFloat(location.lng!),
    };
  });
}

function buildBoundingBoxFormula(
  lat: number,
  lng: number,
  radius: number,
  tableAlias: string,
): string {
  const latDelta = radius / MILES_PER_DEGREE;
  const latFrom = lat - latDelta;
  const latTo = lat + latDelta;

  const lngDelta =
    radius / (MILES_PER_DEGREE * Math.cos(degreesToRadians(lat)));
  const lngFrom = lng - lngDelta;
  const lngTo = lng + lngDelta;

  return `${tableAlias}.latitude BETWEEN ${latFrom} AND ${latTo} AND ${tableAlias}.longitude BETWEEN ${lngFrom} AND ${lngTo}`;
}

function buildDistanceFormula(
  lat1: number,
  lng1: number,
  tableAlias: string,
): string {
  // distance_unit *
  // DEGREES(
  //     ATAN2(
  //       SQRT(
  //         POW(COS(RADIANS(lat2)) * SIN(RADIANS(lng2 - lng1)), 2) +
  //         POW(COS(RADIANS(lat1)) * SIN(RADIANS(lat2)) -
  //             (SIN(RADIANS(lat1)) * COS(RADIANS(lat2)) *
  //               COS(RADIANS(lng2 - lng1))), 2)),
  //       SIN(RADIANS(lat1)) * SIN(RADIANS(lat2)) +
  //       COS(RADIANS(lat1)) * COS(RADIANS(lat2)) * COS(RADIANS(lng2 - lng1))))

  const formula = `unitFactor *
  DEGREES(
      ATAN2(
        SQRT(
          POW(COS(RADIANS(lat2)) * SIN(RADIANS(lng2 - lng1)), 2) +
          POW(COS(RADIANS(lat1)) * SIN(RADIANS(lat2)) -
              (SIN(RADIANS(lat1)) * COS(RADIANS(lat2)) *
                COS(RADIANS(lng2 - lng1))), 2)),
        SIN(RADIANS(lat1)) * SIN(RADIANS(lat2)) +
        COS(RADIANS(lat1)) * COS(RADIANS(lat2)) * COS(RADIANS(lng2 - lng1))))`;

  lat1 = degreesToRadians(lat1);

  return formula
    .replaceAll("unitFactor", MILES_PER_DEGREE.toString())
    .replaceAll("COS(RADIANS(lat1))", Math.cos(lat1).toString())
    .replaceAll("SIN(RADIANS(lat1))", Math.sin(lat1).toString())
    .replaceAll("lng1", lng1.toString())
    .replaceAll("lat2", `${tableAlias}.latitude`)
    .replaceAll("lng2", `${tableAlias}.longitude`);
}

function degreesToRadians(deg: number): number {
  return deg * (Math.PI / 180);
};
