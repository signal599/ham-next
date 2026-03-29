import { SearchQuery, LocationsResponse, HamInfoQuery } from "./map-types";

export async function doQuery(q: SearchQuery): Promise<LocationsResponse> {
  const q2 = getHamInfoQuery(q);
  const response = await fetch(`${process.env.HAMINFO_API_URL}?type=${q2.type}&value=${q2.value}`);
  const result = await response.json();

 return {
    center: {lat: result.mapCenterLat, lng: result.mapCenterLng},
    gridsquares: result.subsquares,
    locations: result.locations,
    activeLocationId: result.queryLocationId,
  } as LocationsResponse;
}

function getHamInfoQuery(q: SearchQuery): HamInfoQuery {
  switch (q.type) {
    case 'callsign':    return {type: 'c', value: q.value}
    case 'gridsquare':  return {type: 'g', value: q.value}
    case 'zipcode':     return {type: 'z', value: q.value}
    case 'point':       return {type: 'latlng', value: `${q.lat},${q.lng}`}
  }
}
