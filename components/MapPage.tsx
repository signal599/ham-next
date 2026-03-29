'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import SearchForm from './SearchForm'
import MapView from "./MapView"
import { SearchQuery, Station, ds, StationsResponse, Subsquare } from '@/lib/map-types'
import { queryToPath } from "@/lib/parse-slug"
import { doQuery } from '@/lib/map-query'

interface Props {
  initialQuery: SearchQuery | null
}

export default function MapPage({ initialQuery }: Props) {
  const router = useRouter()
  const [query, setQuery]   = useState<SearchQuery | null>(initialQuery)
  const [center, setCenter] = useState<{ lat: number; lng: number } | null>(null)
  const [stations, setStations] = useState<Station[]>([])
  const [activeLocationId, setActiveLocationId] = useState<string | null>(null)
  const [subsquares, setSubsquares] = useState<Subsquare[][] | null>(null)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState<string | null>(null)

  useEffect(() => {
    if (!query) return
    fetchStations(query)
  }, [query])

  async function fetchStations(q: SearchQuery, bounds?: ds) {
    setLoading(true)
    setError(null)
    try {
      const params = buildApiParams(q, bounds)
      const res = await fetch(`/api/stations?${params}`)
      if (!res.ok) throw new Error(`Server error: ${res.status}`)
      const data: StationsResponse = await res.json()
      // Only update center on the initial query fetch, not on bounds-driven
      // re-fetches — we don't want the map to jump when the user pans
      if (!bounds) setCenter(data.center)
      setStations(data.stations)
      setActiveLocationId(data.activeLocationId || null)
      setSubsquares(data.subsquares || null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  function handleSearch(newQuery: SearchQuery) {
    setQuery(newQuery)
    router.push(queryToPath(newQuery))
  }

  const handleBoundsChange = useCallback((bounds: ds) => {
    if (!query) return
    fetchStations(query, bounds)
  }, [query])

  return (
    <div className="flex flex-col gap-6 p-4">
      <SearchForm
        initialQuery={initialQuery}
        onSearch={handleSearch}
      />

      {loading && (
        <p className="text-sm text-gray-500">Loading stations...</p>
      )}

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      {query && center && (
        <MapView
          center={center}
          stations={stations}
          activeLocationId={activeLocationId}
          subsquares={subsquares}
          onBoundsChange={handleBoundsChange}
        />
      )}
    </div>
  )
}

function buildApiParams(query: SearchQuery, bounds?: ds): URLSearchParams {
  const p = new URLSearchParams()

  switch (query.type) {
    case 'callsign':   p.set('type', 'callsign');   p.set('value', query.value); break
    case 'gridsquare': p.set('type', 'gridsquare'); p.set('value', query.value); break
    case 'zipcode':    p.set('type', 'zipcode');    p.set('value', query.value); break
    case 'point':      p.set('type', 'point')
                       p.set('lat', String(query.lat))
                       p.set('lng', String(query.lng));                          break
  }

  if (bounds) {
    p.set('north', String(bounds.north))
    p.set('south', String(bounds.south))
    p.set('east',  String(bounds.east))
    p.set('west',  String(bounds.west))
  }

  return p
}
