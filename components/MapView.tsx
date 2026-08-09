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
  openId?: number;
  onOpenIdChange: (id?: number) => void;
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
    (id: number) => {
      onOpenIdChange(openId === id ? undefined : id);
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
      onOpenIdChange();
    }
  }, [map, openId, locations, onOpenIdChange]);

  const handleInfoWindowCloseClick = useCallback(() => {
    // User explicitly clicked the X button.
    onOpenIdChange();
  }, [onOpenIdChange]);

  // Map height tracks the viewport rather than a width breakpoint: a phone in
  // landscape is wide but only ~375px tall, so a width-based rule would give it
  // a map taller than the screen. svh keeps it stable as mobile browsers
  // collapse and expand their URL bar.
  return (
    <div className="w-full h-[70svh] min-h-64 max-h-[600px] rounded-lg overflow-hidden">
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

// Google copies a marker's title to its aria-label, so this is what a screen
// reader reads when it lands on the marker.
function markerTitle(location: Location, stationCount: number): string {
  const address = location.addresses[0];
  const { callsign } = address.stations[0];
  const others = stationCount - 1;

  const more =
    others > 0 ? ` and ${others} other station${others > 1 ? "s" : ""}` : "";

  return `${callsign}${more}, ${address.city}, ${address.state}`;
}

interface LocationMarkerProps {
  location: Location;
  isOpen: boolean;
  onMarkerClick: (id: number) => void;
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

  const stationCount = location.addresses.reduce((acc, address) => {
    return acc + address.stations.length;
  }, 0);

  // The pin's glyph is drawn content, so it never reaches the accessibility
  // tree — without this the marker announces as an unnamed button.
  const title = markerTitle(location, stationCount);

  useEffect(() => {
    if (!markerRef.current || !markerLib) return;

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
  }, [markerEl, markerLib, location, stationCount]);

  const handleClick = useCallback(() => {
    onMarkerClick(location.id);
  }, [onMarkerClick, location.id]);

  return (
    <>
      <AdvancedMarker
        ref={handleMarkerRef}
        position={{ lat: location.lat, lng: location.lng }}
        title={title}
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
