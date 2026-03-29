import { LocationsResponse, HamInfoQuery } from "@/lib/map-types";

export async function doQuery(q: HamInfoQuery): Promise<LocationsResponse> {
  const response = await fetch(`${process.env.HAMINFO_API_URL}?type=${q.type}&value=${q.value}`);
  const result = await response.json();

  const ret = {
    center: {lat: result.mapCenterLat, lng: result.mapCenterLng},
    gridsquares: result.subsquares,
    locations: result.locations,
    activeLocationId: result.queryLocationId,
  } as LocationsResponse;

  return ret;
}
