import {
  SearchQuery,
  LocationsResponse,
  HamInfoQuery,
  HamInfoResponse,
} from "./map-types";

export async function doQuery(q: SearchQuery): Promise<HamInfoResponse> {
  const q2 = getHamInfoQuery(q);

  try {
    const response = await fetch(
      `${process.env.HAMINFO_API_URL}?type=${q2.type}&value=${q2.value}`,
    );

    if (!response.ok) {
      return {
        error: "Query failed",
      };
    }

    const result = await response.json();
    if (result.error) {
      return {
        error: result.error,
      }
    }

    return {
      data: {
        center: { lat: result.mapCenterLat, lng: result.mapCenterLng },
        gridsquares: result.subsquares,
        locations: result.locations,
        activeLocationId: result.queryLocationId,
      } as LocationsResponse,
    };
  } catch (e) {
    return {
      error: "Query failed",
    };
  }
}

function getHamInfoQuery(q: SearchQuery): HamInfoQuery {
  switch (q.type) {
    case "callsign":
      return { type: "c", value: q.value };
    case "gridsquare":
      return { type: "g", value: q.value };
    case "zipcode":
      return { type: "z", value: q.value };
    case "point":
      return { type: "latlng", value: `${q.lat},${q.lng}` };
  }
}
