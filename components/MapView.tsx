"use client";

import { useCallback, useRef, useState } from "react";
import {
  Map,
  AdvancedMarker,
  InfoWindow,
  MapCameraChangedEvent,
  useMap,
} from "@vis.gl/react-google-maps";
import { Station, MapBounds } from "@/app/lib/map-types";

interface Props {
  center: { lat: number; lng: number };
  stations: Station[];
  onBoundsChange: (bounds: MapBounds) => void;
  debounceMs?: number;
}

const DEFAULT_ZOOM = 10;

export default function MapView({
  center,
  stations,
  onBoundsChange,
  debounceMs = 2000,
}: Props) {
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleCameraChanged = useCallback(
    (e: MapCameraChangedEvent) => {
      const bounds = e.detail.bounds;
      if (!bounds) return;

      if (debounceTimer.current) clearTimeout(debounceTimer.current);

      debounceTimer.current = setTimeout(() => {
        onBoundsChange({
          north: bounds.north,
          south: bounds.south,
          east: bounds.east,
          west: bounds.west,
        });
      }, debounceMs);
    },
    [onBoundsChange, debounceMs],
  );

  return (
    <div className="w-full h-[600px] rounded-lg overflow-hidden">
      <Map
        defaultCenter={center}
        defaultZoom={DEFAULT_ZOOM}
        mapId={process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID}
        onCameraChanged={handleCameraChanged}
        gestureHandling="greedy"
        disableDefaultUI={false}
      >
        {stations.map((station) => (
          <StationMarker key={station.callsign} station={station} />
        ))}
      </Map>
    </div>
  );
}

// Separate component so each marker can have its own info window state
function StationMarker({ station }: { station: Station }) {
  const [open, setOpen] = useState(false)
  const [marker, setMarker] = useState<google.maps.marker.AdvancedMarkerElement | null>(null)

  return (
    <>
      <AdvancedMarker
        ref={setMarker}
        position={{ lat: station.lat, lng: station.lng }}
        onClick={() => setOpen(o => !o)}
      />

      {open && marker && (
        <InfoWindow
          anchor={marker}
          onClose={() => setOpen(false)}
        >
          <div className="text-sm">
            <p className="font-semibold">{station.callsign}</p>
            {station.name && <p>{station.name}</p>}
            {station.city && <p>{station.city}, {station.state}</p>}
          </div>
        </InfoWindow>
      )}
    </>
  )
}