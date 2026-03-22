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
  activeLocationId?: string;
  onBoundsChange: (bounds: MapBounds) => void;
  debounceMs?: number;
}

const DEFAULT_ZOOM = 14;

export default function MapView({
  center,
  stations,
  activeLocationId,
  onBoundsChange,
  debounceMs = 2000,
}: Props) {
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [openId, setOpenId] = useState<string | null>(activeLocationId ?? null);

  useEffect(() => {
    setOpenId(activeLocationId ?? null);
  }, [activeLocationId]);

  const handleMarkerClick = useCallback((id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  }, []);

  const handleInfoWindowClose = useCallback(() => {
    setOpenId(null);
  }, []);

  const isFirstEvent = useRef(true);

  const handleCameraChanged = useCallback(
    (e: MapCameraChangedEvent) => {
      if (isFirstEvent.current) {
        isFirstEvent.current = false;
        return;
      }

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
          defaultZoom={DEFAULT_ZOOM}
          mapId={process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID}
          onCameraChanged={handleCameraChanged}
          gestureHandling="greedy"
          disableDefaultUI={false}
        >
          {stations.map((station) => (
            <StationMarker
              key={station.id}
              station={station}
              isOpen={openId === station.id}
              onMarkerClick={handleMarkerClick}
              onInfoWindowClose={handleInfoWindowClose}
            />
          ))}
        </Map>
      </div>
    </div>
  );
}

interface StationMarkerProps {
  station: Station;
  isOpen: boolean;
  onMarkerClick: (id: string) => void;
  onInfoWindowClose: () => void;
}

function StationMarker({
  station,
  isOpen,
  onMarkerClick,
  onInfoWindowClose,
}: StationMarkerProps) {
  const [markerEl, setMarkerEl] =
    useState<google.maps.marker.AdvancedMarkerElement | null>(null);
  const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(
    null,
  );
  const markerLib = useMapsLibrary("marker");

  const handleMarkerRef = useCallback(
    (el: google.maps.marker.AdvancedMarkerElement | null) => {
      markerRef.current = el;
      setMarkerEl(el);
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

  const handleClick = useCallback(() => {
    onMarkerClick(station.id);
  }, [onMarkerClick, station.id]);

  return (
    <>
      <AdvancedMarker
        ref={handleMarkerRef}
        position={{ lat: station.lat, lng: station.lng }}
        onClick={handleClick}
      />

      {isOpen && markerEl && (
        <InfoWindow anchor={markerEl} onClose={onInfoWindowClose}>
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
