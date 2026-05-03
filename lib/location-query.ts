import { hamAddress, hamLocation, hamStation } from "@/src/db/schema";
import { and, asc, eq, inArray, isNotNull, lt, sql } from "drizzle-orm";
import { drizzle, MySql2Database } from "drizzle-orm/mysql2";
import {
  Address,
  LatLng,
  Location,
  LocationsResponse,
  SearchQuery,
  Station,
} from "./map-types";
import {
  addressHasLowerCase,
  buildAddressKey,
  roundPoint,
} from "./utils";
import { getNeighboringGridSquares, GridSquareToLatLng } from "./gridsquares";
import { GeocodeZipcode } from "./geocode-zipcode";

const MILES_PER_DEGREE = 69.0;
const RADIUS = 20;

export async function doQuery(query: SearchQuery): Promise<LocationsResponse> {
  const db = drizzle(process.env.DATABASE_URL!);
  const centerInfo = await getMapCenterInfo(db, query);

  const center = centerInfo.point;
  const locationIds = await getLocationIds(db, center.lat, center.lng, RADIUS);

  const locations = await getLocations(db, locationIds);
  const markerData = getMarkerData(locations, query.type === "callsign" ? query.value : null);
  const gridSquares = getNeighboringGridSquares(center.lat, center.lng);

  return {
    center: center,
    gridsquares: gridSquares,
    locations: markerData,
    activeLocationId: centerInfo.locationId,
  };
}

type CenterInfo = {
  point: LatLng;
  locationId?: number;
};

async function getMapCenterInfo(
  db: MySql2Database,
  query: SearchQuery,
): Promise<CenterInfo> {
  switch (query.type) {
    case "callsign":
      return await getCallsignCoords(db, query.value);
      break;

    case "gridsquare":
      return { point: GridSquareToLatLng(query.value) };
      break;

    case "zipcode":
      return { point: await GeocodeZipcode(query.value) };
      break;

    case "point":
      return { point: { lat: query.lat, lng: query.lng } };
      break;
  }
}

async function getCallsignCoords(
  db: MySql2Database,
  callsign: string,
): Promise<CenterInfo> {
  const rows = await db
    .select({
      location_id: hamLocation.id,
      lat: hamLocation.latitude,
      lng: hamLocation.longitude,
    })
    .from(hamStation)
    .innerJoin(hamAddress, eq(hamAddress.hash, hamStation.addressHash))
    .innerJoin(hamLocation, eq(hamLocation.id, hamAddress.locationId))
    .where(
      and(
        eq(hamStation.callsign, callsign),
        isNotNull(hamLocation.latitude),
        isNotNull(hamLocation.longitude),
      ),
    );

  if (!rows.length) {
    throw new Error(`We have no record of callsign ${callsign}`);
  }

  const row = rows[0];

  const point = roundPoint({
    lat: parseFloat(row.lat!),
    lng: parseFloat(row.lng!),
  });

  return {
    point,
    locationId: row.location_id,
  };
}

async function getLocationIds(
  db: MySql2Database,
  lat: number,
  lng: number,
  radius: number,
): Promise<number[]> {
  const locationAlias = "ham_location";
  const distanceFormula = buildDistanceFormula(lat, lng, locationAlias);
  const boundingBoxFormula = buildBoundingBoxFormula(
    lat,
    lng,
    radius,
    locationAlias,
  );

  const rows = await db
    .select({ id: hamLocation.id })
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

  return rows.map((row) => row.id);
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
}

type FlatLocationDTO = {
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

function getMarkerData(flatLocations: FlatLocationDTO[], activeCallsign: string | null): Location[] {
  const locations: Location[] = [];

  let locationId: number = 0;
  let locationIdx: number = 0;
  let addressId: number = 0;
  let addressIdx: number = 0;

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
        address1: flatLocation.address_line1 ?? "",
        address2: flatLocation.address_line2 ?? "",
        city: flatLocation.city ?? "",
        state: flatLocation.state ?? "",
        zip: flatLocation.zip ?? "",
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

  return locations;
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

function getStationSorter() {
  const rankings = new Map([
    ['E', 1],
    ['A', 2],
    ['G', 3],
    ['T', 4],
    ['N', 5],
  ]);

  return (stations: Station[], activeCallsign: string | null): void => {
    stations.sort((a: Station, b: Station) => {
      // Put the active call at the top/ Otherwise sort by license class.
      const rankA = (activeCallsign && a.callsign === activeCallsign) ? 0 : (rankings.get(a.operatorClass) ?? 999);
      const rankB = (activeCallsign && b.callsign === activeCallsign) ? 0 : (rankings.get(b.operatorClass) ?? 999);

      if (rankA < rankB) {
        return -1;
      }

      if (rankB > rankA) {
        return 1;
      }

      return 0;
    });
  };
}
