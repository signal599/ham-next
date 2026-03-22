"use client";

import { useCallback, useRef, useState, useEffect } from "react";
import {
  Map,
  AdvancedMarker,
  InfoWindow,
  MapCameraChangedEvent,
  useMapsLibrary,
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
    <div className="not-prose">
      <div className="w-full h-[600px] rounded-lg overflow-hidden">
        <Map
          defaultCenter={center}
          defaultZoom={14}
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
    </div>
  );
}

function StationMarker({ station }: { station: Station }) {
  const [open, setOpen] = useState(false);
  const [markerEl, setMarkerEl] =
    useState<google.maps.marker.AdvancedMarkerElement | null>(null);
  const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(
    null,
  );
  const markerLib = useMapsLibrary("marker");

  const handleMarkerRef = useCallback(
    (el: google.maps.marker.AdvancedMarkerElement | null) => {
      markerRef.current = el;
      setMarkerEl(el); // triggers re-render so InfoWindow condition works
    },
    [],
  );

  useEffect(() => {
    if (!markerRef.current || !markerLib) return;

    const pin = new markerLib.PinElement({
      glyphText: station.callsign,
      glyphColor: "black",
      background: "#EA4335",
      borderColor: "#C5221F",
    } as google.maps.marker.PinElementOptions);

    markerRef.current.content = pin;

    return () => {
      if (markerRef.current) markerRef.current.content = null;
    };
  }, [markerEl, markerLib, station.callsign]);

  return (
    <>
      <AdvancedMarker
        ref={handleMarkerRef}
        position={{ lat: station.lat, lng: station.lng }}
        onClick={() => setOpen((o) => !o)}
      />

      {open && markerEl && (
        <InfoWindow anchor={markerEl} onClose={() => setOpen(false)}>
          <div className="text-sm">
            <p className="font-semibold">{station.callsign}</p>
            {station.name && <p>{station.name}</p>}
            {station.city && (
              <p>
                {station.city}, {station.state}
              </p>
            )}
          </div>
        </InfoWindow>
      )}
    </>
  );
}
