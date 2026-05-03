import { LatLng } from "./map-types";

export async function GeocodeZipcode(zipcode: string): Promise<LatLng> {

  const params = new URLSearchParams({
    key: process.env.GOOGLE_GEOCODE_KEY!,
    components: `postal_code:${zipcode}|country:US`
  });

  const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?${params}`);

  if (!response.ok) {
    throw new Error(`${zipcode} is not a valid zipcode`);
  }

  const data = await response.json();
  const location = data.results[0]?.geometry?.location;

  if (!location) {
    throw new Error(`Unable to get location for zipcode ${zipcode}`);
  }

  return location;
}
