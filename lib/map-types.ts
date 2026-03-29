export type SearchQuery =
  | { type: 'callsign'; value: string }
  | { type: 'gridsquare'; value: string }
  | { type: 'zipcode'; value: string }
  | { type: 'point'; lat: number; lng: number }

export type LatLng = {
  lat: number
  lng: number
}

export type GridSquare = {
  code: string
  latNorth: number
  latCenter: number
  latSouth: number
  lngEast: number
  lngCenter: number
  lngWest: number
}

export type Station = {
  callsign: string
  name: string
  operatorClass: string
}

export type Address = {
  address1: string
  address2: string
  city: string
  state: string
  zip: string
  stations: Station[]
}

export type Location = {
  id: string
  lat: number
  lng: number
  addresses: Address[]
}

export type LocationsResponse = {
  center: { lat: number; lng: number }
  locations: Location[]
  activeLocationId: string | null
  gridsquares: GridSquare[][]
}

export type HamInfoQuery =
  | { type: 'c'; value: string }
  | { type: 'g'; value: string }
  | { type: 'z'; value: string }
  | { type: 'latlng'; value: string}
