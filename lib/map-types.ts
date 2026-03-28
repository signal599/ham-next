export type SearchQuery =
  | { type: 'callsign'; value: string }
  | { type: 'gridsquare'; value: string }
  | { type: 'zipcode'; value: string }
  | { type: 'point'; lat: number; lng: number }

export type Station = {
  id: string
  callsign: string
  lat: number
  lng: number
  name?: string
  city?: string
  state?: string
}

export type MapBounds = {
  north: number
  south: number
  east: number
  west: number
}

// map-types.ts additions
export type Subsquare = {
  code: string
  latNorth: number
  latCenter: number
  latSouth: number
  lngEast: number
  lngCenter: number
  lngWest: number
}

export type StationsResponse = {
  center: { lat: number; lng: number }
  stations: Station[]
  activeLocationId?: string
  subsquares?: Subsquare[][]
}
