import { Address, LatLng } from "./map-types";

export function formatGridSquare(code: string): string {
  return `${code.substring(0, 2).toUpperCase()}${code.substring(2, 4)}${code.substring(4).toLowerCase()}`;
}

export function buildAddressKey(address: Address) {
  return [
    address.address1,
    address.address2,
    address.city,
    address.state,
    address.zip,
  ]
    .join("|")
    .toLowerCase();
}

export function addressHasLowerCase(address: Address) {
  return /[a-z]/.test(`${address.address1}${address.city}`);
}

const round = (value: number, decimals: number): number =>
  Math.round(value * 10 ** decimals) / 10 ** decimals;

export const MathLib = {
  round
}

export function roundPoint(point: LatLng): LatLng {
  return {
    lat: MathLib.round(point.lat, 6),
    lng: MathLib.round(point.lng, 6),
  }
}
