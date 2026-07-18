import { hamAddress, hamLocation, hamStation } from "@/src/db/schema";
import { and, asc, eq, inArray, isNotNull, lt, sql, SQL } from "drizzle-orm";
import { MySql2Database } from "drizzle-orm/mysql2";
import { db as dbFromPool } from "@/lib/db-pool";
import {
  Address,
  LatLng,
  Location,
  LocationsResponse,
  SearchQuery,
  Station,
} from "./map-types";
import { addressHasLowerCase, buildAddressKey, roundPoint } from "./utils";
import { getNeighboringGridSquares, GridSquareToLatLng } from "./gridsquares";
import { GeocodeZipcode } from "./geocode-zipcode";

const METERS_PER_LAT_DEGREE = 111132;
const RADIUS = 32187; // 20 miles in meters.

const GEOCODE_STATUS_PENDING = 0;
const GEOCODE_STATUS_SUCCESS = 1;
const GEOCODE_STATUS_NOT_FOUND = 2;
const GEOCODE_STATUS_PO_BOX = 3;

export async function doQuery(
  query: SearchQuery,
  initialCallsign: string | null,
): Promise<LocationsResponse> {
  const center = await getMapCenterInfo(dbFromPool, query);
  const locationIds = await getLocationIds(
    dbFromPool,
    center.lat,
    center.lng,
    RADIUS,
  );
  const flatLocations = await getLocations(dbFromPool, locationIds);
  const { locations, activeLocationId } = getMarkerData(
    flatLocations,
    initialCallsign,
  );
  const gridsquares = getNeighboringGridSquares(center.lat, center.lng);

  return {
    center,
    gridsquares,
    locations,
    activeLocationId,
  };
}

async function getMapCenterInfo(
  db: MySql2Database,
  query: SearchQuery,
): Promise<LatLng> {
  switch (query.type) {
    case "callsign":
      return await getCallsignCoords(db, query.value);

    case "gridsquare":
      return GridSquareToLatLng(query.value);

    case "zipcode":
      return await GeocodeZipcode(query.value);

    case "point":
      return { lat: query.lat, lng: query.lng };
  }
}

async function getCallsignCoords(
  db: MySql2Database,
  callsign: string,
): Promise<LatLng> {
  const rows = await db
    .select({
      location_id: hamLocation.id,
      lat: hamLocation.latitude,
      lng: hamLocation.longitude,
      geocodeStatus: hamAddress.geocodeStatus,
    })
    .from(hamStation)
    .innerJoin(hamAddress, eq(hamAddress.hash, hamStation.addressHash))
    .leftJoin(hamLocation, eq(hamLocation.id, hamAddress.locationId))
    .where(eq(hamStation.callsign, callsign));

  if (!rows.length) {
    throw new Error(`for-user: We have no record of callsign ${callsign}`);
  }

  const row = rows[0];

  switch (row.geocodeStatus) {
    case GEOCODE_STATUS_PENDING:
      throw new Error(
        `for-user: The address for ${callsign} has not been geocoded yet.`,
      );

    case GEOCODE_STATUS_NOT_FOUND:
      throw new Error(
        `for-user: The address for ${callsign} could not be geocoded.`,
      );

    case GEOCODE_STATUS_PO_BOX:
      throw new Error(`for-user: The address for ${callsign} is a PO Box.`);
  }

  if (
    row.geocodeStatus !== GEOCODE_STATUS_SUCCESS ||
    row.lat === null ||
    row.lng === null
  ) {
    throw new Error(
      `for-user: The address for ${callsign} could not be geocoded.`,
    );
  }

  return roundPoint({
    lat: parseFloat(row.lat),
    lng: parseFloat(row.lng),
  });
}

async function getLocationIds(
  db: MySql2Database,
  lat: number,
  lng: number,
  radius: number,
): Promise<number[]> {
  const distanceFormula = buildDistanceFormula(lat, lng);
  const boundingBoxFormula = buildBoundingBoxFormula(lat, lng, radius);

  // Compute the distance once as a selected column, then reference that alias
  // for the radius filter (HAVING) and the sort — otherwise MySQL evaluates
  // ST_Distance_Sphere twice per candidate row.
  const distanceColumn = distanceFormula.as("distance");

  const rows = await db
    .select({ id: hamLocation.id, distance: distanceColumn })
    .from(hamLocation)
    .where(
      and(
        boundingBoxFormula,
        isNotNull(hamLocation.latitude),
        isNotNull(hamLocation.longitude),
      ),
    )
    .having(lt(sql`\`distance\``, radius))
    .orderBy(asc(sql`\`distance\``))
    .limit(200);

  return rows.map((row) => row.id);
}

function buildBoundingBoxFormula(lat: number, lng: number, radius: number): SQL {
  const latDelta = radius / METERS_PER_LAT_DEGREE;
  const latFrom = lat - latDelta;
  const latTo = lat + latDelta;

  const lngDelta =
    radius / (METERS_PER_LAT_DEGREE * Math.cos(degreesToRadians(lat)));
  const lngFrom = lng - lngDelta;
  const lngTo = lng + lngDelta;

  return sql`${hamLocation.latitude} BETWEEN ${latFrom} AND ${latTo} AND ${hamLocation.longitude} BETWEEN ${lngFrom} AND ${lngTo}`;
}

function buildDistanceFormula(lat1: number, lng1: number): SQL {
  return sql`
    ST_Distance_Sphere(
    ST_GeomFromText(CONCAT('POINT(', ${lat1}, ' ', ${lng1}, ')'), 4326),
    ST_GeomFromText(CONCAT('POINT(', ${hamLocation.latitude}, ' ', ${hamLocation.longitude}, ')'), 4326)
  )`;
}

function degreesToRadians(deg: number): number {
  return deg * (Math.PI / 180);
}

export type FlatLocationDTO = {
  id: number;
  lat: string | null;
  lng: string | null;
  address_id: number;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  station_id: number;
  callsign: string;
  first_name: string | null;
  middle_name: string | null;
  last_name: string | null;
  suffix: string | null;
  organization: string | null;
  operator_class: string | null;
};

async function getLocations(
  db: MySql2Database,
  locationIds: number[],
): Promise<FlatLocationDTO[]> {
  if (!locationIds.length) {
    return [];
  }

  return await db
    .select({
      id: hamLocation.id,
      lat: hamLocation.latitude,
      lng: hamLocation.longitude,
      address_id: hamAddress.id,
      address_line1: hamAddress.addressAddressLine1,
      address_line2: hamAddress.addressAddressLine2,
      city: hamAddress.addressLocality,
      state: hamAddress.addressAdministrativeArea,
      zip: hamAddress.addressPostalCode,
      station_id: hamStation.id,
      callsign: hamStation.callsign,
      first_name: hamStation.firstName,
      middle_name: hamStation.middleName,
      last_name: hamStation.lastName,
      suffix: hamStation.suffix,
      organization: hamStation.organization,
      operator_class: hamStation.operatorClass,
    })
    .from(hamLocation)
    .innerJoin(hamAddress, eq(hamAddress.locationId, hamLocation.id))
    .innerJoin(hamStation, eq(hamStation.addressHash, hamAddress.hash))
    .where(
      and(
        inArray(hamAddress.locationId, locationIds),
        isNotNull(hamLocation.latitude),
        isNotNull(hamLocation.longitude),
      ),
    )
    .orderBy(asc(hamLocation.id), asc(hamAddress.id), asc(hamStation.id));
}

export function getMarkerData(
  flatLocations: FlatLocationDTO[],
  activeCallsign: string | null,
): { locations: Location[]; activeLocationId: number | undefined } {
  const locations: Location[] = [];

  let locationId: number = 0;
  let locationIdx: number = 0;
  let addressId: number = 0;
  let addressIdx: number = 0;
  let activeLocationId = undefined;

  const addressNormalizer = getAddressNormalizer();

  flatLocations.forEach((flatLocation: FlatLocationDTO) => {
    if (flatLocation.id !== locationId) {
      const point: LatLng = roundPoint({
        lat: parseFloat(flatLocation.lat!),
        lng: parseFloat(flatLocation.lng!),
      });

      locations.push({
        id: flatLocation.id,
        lat: point.lat,
        lng: point.lng,
        addresses: [],
      });

      locationId = flatLocation.id;
      locationIdx = locations.length - 1;
      addressId = 0;
    }

    if (flatLocation.address_id !== addressId) {
      locations[locationIdx].addresses.push({
        id: flatLocation.address_id,
        address1: addressNormalizer(flatLocation.address_line1 ?? ""),
        address2: flatLocation.address_line2 ?? "",
        city: flatLocation.city ?? "",
        state: flatLocation.state ?? "",
        zip: (flatLocation.zip ?? "").split("-")[0], // Only use 5 digit zip.
        stations: [],
      });

      addressId = flatLocation.address_id;
      addressIdx = locations[locationIdx].addresses.length - 1;
    }

    locations[locationIdx].addresses[addressIdx].stations.push({
      id: flatLocation.station_id,
      callsign: flatLocation.callsign,
      name: getStationName(flatLocation),
      operatorClass: flatLocation.operator_class ?? "",
    });

    if (activeCallsign && activeCallsign === flatLocation.callsign) {
      activeLocationId = flatLocation.id;
    }
  });

  const stationSorter = getStationSorter();

  locations.forEach((location) => {
    if (location.addresses.length > 1) {
      location.addresses = addressCleanup(location.addresses);
    }

    location.addresses.forEach((address) => {
      if (address.stations.length > 1) {
        stationSorter(address.stations, activeCallsign);
      }
    });
  });

  return { locations, activeLocationId };
}

function addressCleanup(addresses: Address[]) {
  const addMap = new Map();

  addresses.forEach((address) => {
    const key = buildAddressKey(address);
    const existing = addMap.get(key) || [];
    addMap.set(key, [...existing, address]);
  });

  const newAddresses: Address[] = [];

  for (const adds of addMap.values()) {
    if (adds.length === 1) {
      newAddresses.push(adds[0]);
    } else {
      const allStations: Station[] = [];
      let bestAddress: Address | null = null;

      for (const add of adds) {
        allStations.push(...add.stations);

        if (!bestAddress && addressHasLowerCase(add)) {
          bestAddress = add;
        }
      }

      if (!bestAddress) {
        bestAddress = adds[0];
      }

      bestAddress!.stations = allStations;
      newAddresses.push(bestAddress!);
    }
  }

  return newAddresses;
}

function getStationName(flatLocation: FlatLocationDTO): string {
  if (flatLocation.organization) {
    return flatLocation.organization;
  }

  const name = [flatLocation.first_name];

  if (flatLocation.middle_name) {
    name.push(flatLocation.middle_name);
  }

  name.push(flatLocation.last_name);

  if (flatLocation.suffix) {
    name.push(flatLocation.suffix);
  }

  return name.join(" ");
}

function getStationSorter(): (
  stations: Station[],
  activeCallsign: string | null,
) => void {
  const rankings = new Map([
    ["E", 1],
    ["A", 2],
    ["G", 3],
    ["T", 4],
    ["N", 5],
  ]);

  return (stations: Station[], activeCallsign: string | null): void => {
    stations.sort((a: Station, b: Station) => {
      // Put the active call at the top/ Otherwise sort by license class.
      const rankA =
        activeCallsign && a.callsign === activeCallsign
          ? 0
          : (rankings.get(a.operatorClass) ?? 999);
      const rankB =
        activeCallsign && b.callsign === activeCallsign
          ? 0
          : (rankings.get(b.operatorClass) ?? 999);

      if (rankA !== rankB) return rankA - rankB;
      if (a.callsign < b.callsign) return -1;
      if (a.callsign > b.callsign) return 1;

      return 0;
    });
  };
}

function getAddressNormalizer(): (address: string) => string {
  const map = [
    ["Road", "Rd"],
    ["Street", "St"],
    ["Avenue", "Ave"],
    ["Drive", "Dr"],
    ["Lane", "Ln"],
    ["Circle", "Cir"],
    ["Court", "Ct"],
  ];

  const length = map.length;

  for (let idx = 0; idx < length; idx++) {
    const item = map[idx];
    map.push([item[0].toUpperCase(), item[1].toUpperCase()]);
    map.push([item[0].toLowerCase(), item[1].toLowerCase()]);
  }

  return (address: string): string => {
    for (let idx = 0; idx < map.length; idx++) {
      const [long, short] = map[idx];

      if (address.includes(` ${long}`)) {
        address = address.replace(` ${long}`, ` ${short}`);
        break;
      }
    }

    // Remove period from the end. Replace multiple spaces with one.
    address = address.replace(/\.$/, "").replace(/\s+/g, " ");

    return address;
  };
}
