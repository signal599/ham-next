"use client";

import { useCallback, useRef, useState, useEffect } from "react";
import {
  Map,
  AdvancedMarker,
  InfoWindow,
  MapCameraChangedEvent,
  useMapsLibrary,
  useMap,
} from "@vis.gl/react-google-maps";
import { Location, GridSquare, LatLng } from "@/lib/map-types";
import GridSquares from "./GridSquares";
import LocationContent from "./LocationContent";

interface Props {
  center: { lat: number; lng: number };
  locations: Location[];
  openId: string | null;
  onOpenIdChange: (id: string | null) => void;
  gridSquares: GridSquare[] | null;
  showGridSquares: boolean;
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
  showGridSquares,
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

  const map = useMap();

  const handleInfoWindowClose = useCallback(() => {
    // Only accept close if the marker has scrolled off screen.
    // Spurious SDK closes while marker is in bounds are ignored here —
    // genuine user X clicks are handled by onCloseClick instead.
    if (!map || !openId) return;

    const location = locations.find((l) => l.id === openId);
    if (!location) return;

    const bounds = map.getBounds();
    if (!bounds) return;

    const markerPos = new google.maps.LatLng(location.lat, location.lng);
    if (!bounds.contains(markerPos)) {
      onOpenIdChange(null);
    }
  }, [map, openId, locations, onOpenIdChange]);

  const handleInfoWindowCloseClick = useCallback(() => {
    // User explicitly clicked the X button.
    onOpenIdChange(null);
  }, [onOpenIdChange]);

  return (
    <div className="w-full h-[600px] rounded-lg overflow-hidden">
      <Map
        defaultCenter={center}
        defaultZoom={DEFAULT_ZOOM}
        mapId={process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID}
        onCameraChanged={handleCameraChanged}
        gestureHandling="greedy"
        disableDefaultUI={false}
        zoomControl={true}
      >
        {locations.map((location) => (
          <LocationMarker
            key={location.id}
            location={location}
            isOpen={openId === location.id}
            onMarkerClick={handleMarkerClick}
            onInfoWindowClose={handleInfoWindowClose}
            onInfoWindowCloseClick={handleInfoWindowCloseClick}
          />
        ))}
        {showGridSquares && gridSquares && (
          <GridSquares gridSquares={gridSquares} onGridClick={onGridClick} />
        )}
      </Map>
    </div>
  );
}

interface LocationMarkerProps {
  location: Location;
  isOpen: boolean;
  onMarkerClick: (id: string) => void;
  onInfoWindowClose: () => void;
  onInfoWindowCloseClick: () => void;
}

function LocationMarker({
  location,
  isOpen,
  onMarkerClick,
  onInfoWindowClose,
  onInfoWindowCloseClick,
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

    const stationCount = location.addresses.reduce((acc, address) => {
      return acc + address.stations.length;
    }, 0);

    const plus = stationCount > 1 ? " +" : "";

    const pin = new markerLib.PinElement({
      glyphText: `${location.addresses[0].stations[0].callsign}${plus}`,
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
        <InfoWindow
          anchor={markerEl}
          onClose={onInfoWindowClose}
          onCloseClick={onInfoWindowCloseClick}
        >
          <LocationContent location={location} />
        </InfoWindow>
      )}
    </>
  );
}
