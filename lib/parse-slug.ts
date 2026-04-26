import { SearchQuery } from './map-types'
import { formatGridSquare } from './utils'

export function parseSlug(slug: string[] | undefined): SearchQuery | null {
  if (!slug || slug.length === 0) return null

  const [first, second, third] = slug

  // /map/p/lat/lng
  if (first === 'p' && second && third) {
    const lat = parseFloat(second)
    const lng = parseFloat(third)
    if (!isNaN(lat) && !isNaN(lng)) return { type: 'point', lat, lng }
    return null
  }

  // /map/c/KT1F
  if (first === 'c' && second) {
    return { type: 'callsign', value: second.toUpperCase() }
  }

  // /map/g/fn42dt
  if (first === 'g' && second) {
    return { type: 'gridsquare', value: formatGridSquare(second) }
  }

  // /map/z/03086
  if (first === 'z' && second) {
    return { type: 'zipcode', value: second }
  }

  // /map/KT1F  (convenience — single segment, no prefix)
  if (slug.length === 1) {
    return { type: 'callsign', value: first.toUpperCase() }
  }

  return null
}

export function queryToPath(query: SearchQuery): string {
  switch (query.type) {
    case 'callsign':  return `/map/${query.value.toUpperCase()}`
    case 'gridsquare': return `/map/g/${query.value.toLowerCase()}`
    case 'zipcode':   return `/map/z/${query.value}`
    case 'point':     return `/map/p/${query.lat}/${query.lng}`
  }
}
