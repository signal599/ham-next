"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import SearchForm from "./SearchForm";
import MapView from "./MapView";
import {
  SearchQuery,
  GridSquare,
  Location,
  LocationsResponse,
  LatLng,
  HamInfoResponse,
} from "@/lib/map-types";
import { queryToPath } from "@/lib/parse-slug";
import { roundPoint } from "@/lib/utils";

interface Props {
  initialQuery: SearchQuery | null;
}

export default function MapPage({ initialQuery }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState<SearchQuery | null>(initialQuery);
  const [center, setCenter] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [locations, setLocations] = useState<Location[]>([]);
  const [gridSquares, setGridSquares] = useState<GridSquare[] | null>(null);
  const [openId, setOpenId] = useState<number | undefined>();
  const [showGridSquares, setShowGridSquares] = useState<boolean>(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query) return;
    fetchStations(query);
  }, [query]);

  async function fetchStations(q: SearchQuery, center?: LatLng) {
    setLoading(true);
    setError(null);

    try {
      const params = buildApiParams(q, center);
      const res = await fetch(`/api/map-query?${params}`);
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const infoResponse: HamInfoResponse = await res.json();

      if (infoResponse.error) {
        throw new Error(infoResponse.error);
      }

      const data: LocationsResponse = infoResponse.data!;

      // Only update center on the initial query fetch, not on bounds-driven
      // re-fetches — we don't want the map to jump when the user pans
      if (!center) {
        setCenter(data.center);
        setOpenId(data.activeLocationId);
      }

      setLocations(data.locations);
      setGridSquares(data.gridsquares);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(newQuery: SearchQuery) {
    setQuery(newQuery);
    router.push(queryToPath(newQuery));
  }

  const handleCenterChange = useCallback(
    (center: LatLng) => {
      if (!query) return;
      // The map has moved. The query value is ignored.
      fetchStations(query, roundPoint(center));
    },
    [query],
  );

  function handleGridSquareClick(code: string) {
    const query: SearchQuery = { type: "gridsquare", value: code };
    setQuery(query);
    router.push(queryToPath(query));
  }

  return (
    <div className="not-prose flex flex-col gap-6">
      <div className="flex flex-col gap-4 p-4 bg-white rounded-lg border border-gray-300 w-full max-w-md">
        <SearchForm initialQuery={initialQuery} onSearch={handleSearch} />

        <div className="flex gap-30">
        <label className="flex items-center gap-1.5 cursor-pointer text-sm">
          <input
            type="checkbox"
            name="showgridlines"
            checked={showGridSquares}
            onChange={(e) => setShowGridSquares(e.target.checked)}
          />
          Show gridsquares
        </label>

        {loading && <p className="text-sm m-0 p-0">Loading...</p>}
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {query && center && (
        <MapView
          center={center}
          locations={locations}
          openId={openId}
          onOpenIdChange={setOpenId}
          gridSquares={gridSquares}
          showGridSquares={showGridSquares}
          onCenterChange={handleCenterChange}
          onGridClick={handleGridSquareClick}
        />
      )}
    </div>
  );
}

function buildApiParams(query: SearchQuery, center?: LatLng): URLSearchParams {
  const p = new URLSearchParams();

  if (center) {
    // The map has been moved.
    p.set("type", "point");
    p.set("lat", center.lat.toString());
    p.set("lng", center.lng.toString());
    return p;
  }

  // Initial query.
  switch (query.type) {
    case "callsign":
      p.set("type", "callsign");
      p.set("value", query.value);
      break;
    case "gridsquare":
      p.set("type", "gridsquare");
      p.set("value", query.value);
      break;
    case "zipcode":
      p.set("type", "zipcode");
      p.set("value", query.value);
      break;
    case "point":
      p.set("type", "point");
      p.set("lat", String(query.lat));
      p.set("lng", String(query.lng));
      break;
  }

  return p;
}
