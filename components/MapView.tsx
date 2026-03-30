"use client";

import { useCallback, useRef, useState, useEffect } from "react";
import {
  Map,
  AdvancedMarker,
  InfoWindow,
  MapCameraChangedEvent,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";
import { Location, GridSquare, LatLng } from "@/lib/map-types";
import GridSquares from "./GridSquares";

interface Props {
  center: { lat: number; lng: number };
  locations: Location[];
  openId: string | null;
  onOpenIdChange: (id: string | null) => void;
  gridSquares: GridSquare[][] | null;
  onCenterChange: (center: LatLng) => void;
  onGridClick?: (code: string) => void;
  debounceMs?: number;
}

const DEFAULT_ZOOM = 14;

export default function MapView({
  center,
  locations,
  openId,
  onOpenIdChange,
  onCenterChange,
  gridSquares,
  onGridClick,
  debounceMs = 2000,
}: Props) {

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleMarkerClick = useCallback(
    (id: string) => {
      onOpenIdChange(openId === id ? null : id);
    },
    [onOpenIdChange, openId],
  );

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
        onCenterChange(e.detail.center as LatLng);
      }, debounceMs);
    },
    [onCenterChange, debounceMs],
  );

  const handleInfoWindowClose = useCallback(() => {
    onOpenIdChange(null);
  }, [onOpenIdChange]);

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
          {locations.map((location) => (
            <LocationMarker
              key={location.id}
              location={location}
              isOpen={openId === location.id}
              onMarkerClick={handleMarkerClick}
              onInfoWindowClose={handleInfoWindowClose}
            />
          ))}
          {gridSquares && (
            <GridSquares gridSquares={gridSquares} onGridClick={onGridClick} />
          )}
        </Map>
      </div>
    </div>
  );
}

interface LocationMarkerProps {
  location: Location;
  isOpen: boolean;
  onMarkerClick: (id: string) => void;
  onInfoWindowClose: () => void;
}

function LocationMarker({
  location,
  isOpen,
  onMarkerClick,
  onInfoWindowClose,
}: LocationMarkerProps) {
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
      glyphText: location.addresses[0].stations[0].callsign,
      glyphColor: "black",
      background: "#EA4335",
      borderColor: "#C5221F",
    } as google.maps.marker.PinElementOptions);

    markerRef.current.content = pin;

    return () => {
      if (markerRef.current) markerRef.current.content = null;
    };
  }, [markerEl, markerLib, location]);

  const handleClick = useCallback(() => {
    onMarkerClick(location.id);
  }, [onMarkerClick, location.id]);

  return (
    <>
      <AdvancedMarker
        ref={handleMarkerRef}
        position={{ lat: location.lat, lng: location.lng }}
        onClick={handleClick}
      />

      {isOpen && markerEl && (
        <InfoWindow anchor={markerEl} onCloseClick={onInfoWindowClose}>
          <div className="text-sm">
            <p className="font-semibold">
              {location.addresses[0].stations[0].callsign}
            </p>
          </div>
        </InfoWindow>
      )}
    </>
  );
}
