import { SearchQuery } from "./map-types";

export async function doQuery(q: SearchQuery): Promise<string> {
  let lat = 0, lng = 0;

  if (q.type === 'point') {
    lat = q.lat;
    lng = q.lng;
  }

  const data = {
    center: {lat, lng},
    stations: [
      {
        id: '1',
        callsign: 'KT1F',
        lat: 42.803135, lng: -71.741880
      },
      {
        id: '2',
        callsign: 'N1EVQ',
        lat: 42.798834, lng: -71.747694
      }
    ],
    activeLocationId: '1'
  }

  return JSON.stringify(data);
}
