"use client";

import { useCallback, useEffect, useRef } from "react";
import Map, {
  Marker,
  Popup,
  NavigationControl,
  type ViewStateChangeEvent,
  type PopupInstance,
} from "react-map-gl/maplibre";
import { setWorkerUrl, type Offset } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
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

// MapLibre looks for its tile worker beside its own import.meta.url, which
// after bundling is a chunk under /_next/static with no worker next to it.
// Without this the worker 404s and the map draws its markers over a blank
// page, with nothing in the console to say why, so point it at the copy
// scripts/copy-maplibre-worker.mjs leaves in public/ instead.
setWorkerUrl("/maplibre/maplibre-gl-worker.mjs");

// OpenFreeMap serves these tiles with no key, no account and no quota, which
// is the whole reason this map is not Google's any more.
const MAP_STYLE = "https://tiles.openfreemap.org/styles/bright";

// One level lower than the Google zoom this replaces. MapLibre's world is a
// 512px square at zoom 0 where Google's is 256px, so the same view sits one
// level down here.
const DEFAULT_ZOOM = 13;

// The pin stands on its coordinate rather than straddling it: the pointer's tip
// marks the spot and the label sits above that. The marker is shifted up by the
// pointer's height so the tip, not the bottom of the label, lands on the point.
const POINTER_HEIGHT = 5;
const LABEL_HEIGHT = 19;
const PIN_HEIGHT = LABEL_HEIGHT + POINTER_HEIGHT;

// Breathing room between the pin and a popup opened off it.
const POPUP_GAP = 4;

// A plain number here would be applied radially, which assumes a marker centred
// on its point. This one is not, so the popup has the whole pin to clear when it
// opens above and nothing at all to clear when it opens below — a single number
// leaves the popup below a pin sitting a pin's height too low. MapLibre picks
// the anchor from the space available, so every direction it can pick needs its
// own offset. Sideways clearance is approximate: the pin is as wide as the
// callsign on it.
const POPUP_OFFSET: Offset = {
  center: [0, 0],
  top: [0, POPUP_GAP],
  "top-left": [0, POPUP_GAP],
  "top-right": [0, POPUP_GAP],
  bottom: [0, -(PIN_HEIGHT + POPUP_GAP)],
  "bottom-left": [0, -(PIN_HEIGHT + POPUP_GAP)],
  "bottom-right": [0, -(PIN_HEIGHT + POPUP_GAP)],
  left: [PIN_HEIGHT + POPUP_GAP, 0],
  right: [-(PIN_HEIGHT + POPUP_GAP), 0],
};

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

  // Where the camera was when we last acted on it, so a moveend that has not
  // actually gone anywhere can be told apart from a pan or a zoom.
  const lastCamera = useRef({
    lng: center.lng,
    lat: center.lat,
    zoom: DEFAULT_ZOOM,
  });

  const handleMarkerClick = useCallback(
    (id: number) => {
      onOpenIdChange(openId === id ? undefined : id);
    },
    [onOpenIdChange, openId],
  );

  const handleMoveEnd = useCallback(
    (e: ViewStateChangeEvent) => {
      const { longitude, latitude, zoom } = e.viewState;
      const last = lastCamera.current;

      // Sizing the map to its container counts as a move, and acting on it
      // would re-query the point we have just been given. Skipping the first
      // event instead would be wrong: that resize does not always happen, and
      // when it doesn't the visitor's first pan is the one that gets eaten.
      if (
        longitude === last.lng &&
        latitude === last.lat &&
        zoom === last.zoom
      ) {
        return;
      }

      lastCamera.current = { lng: longitude, lat: latitude, zoom };

      if (debounceTimer.current) clearTimeout(debounceTimer.current);

      debounceTimer.current = setTimeout(() => {
        onCenterChange({ lat: latitude, lng: longitude });
      }, debounceMs);
    },
    [onCenterChange, debounceMs],
  );

  // A pan left in flight when the map goes away would otherwise re-query for
  // the search the visitor has just navigated off.
  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  // The box this fills is sized by MapPage, which has to reserve the space
  // before this component's chunk arrives.
  return (
    <Map
      initialViewState={{
        longitude: center.lng,
        latitude: center.lat,
        zoom: DEFAULT_ZOOM,
      }}
      mapStyle={MAP_STYLE}
      onMoveEnd={handleMoveEnd}
      // The old map could not rotate or tilt, and a rotated map would leave
      // the gridsquare rectangles sitting at an angle.
      dragRotate={false}
      touchPitch={false}
      style={{ width: "100%", height: "100%" }}
    >
      <NavigationControl position="top-right" showCompass={false} />

      {locations.map((location) => (
        <LocationMarker
          key={location.id}
          location={location}
          isOpen={openId === location.id}
          onMarkerClick={handleMarkerClick}
          onPopupClose={onOpenIdChange}
        />
      ))}
      {showGridSquares && gridSquares && (
        <GridSquares gridSquares={gridSquares} onGridClick={onGridClick} />
      )}
    </Map>
  );
}

// What a screen reader reads when it lands on the marker: the pin's own text is
// just a callsign, which says nothing about where it is or how many stations
// share the spot.
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
  onPopupClose: () => void;
}

function LocationMarker({
  location,
  isOpen,
  onMarkerClick,
  onPopupClose,
}: LocationMarkerProps) {
  const stationCount = location.addresses.reduce((acc, address) => {
    return acc + address.stations.length;
  }, 0);

  const title = markerTitle(location, stationCount);
  const plus = stationCount > 1 ? " +" : "";

  const handleClick = useCallback(() => {
    onMarkerClick(location.id);
  }, [onMarkerClick, location.id]);

  const popupRef = useRef<PopupInstance | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Opening the popup moves focus into it, so closing has to hand focus back
  // to the pin. Without that a keyboard visitor is dropped at the top of the
  // document and has to tab through the whole page to reach the map again.
  const closePopup = useCallback(() => {
    onPopupClose();
    buttonRef.current?.focus();
  }, [onPopupClose]);

  // MapLibre has no Escape handling of its own. Only the open marker listens,
  // and only one is ever open.
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePopup();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closePopup]);

  // MapLibre decides which side of the pin the popup sits on from the popup's
  // height, which is still zero at the moment it is created: React has not
  // filled in the content yet. Setting the position again once it has makes
  // that choice a second time, with a height to work from.
  useEffect(() => {
    popupRef.current?.setLngLat([location.lng, location.lat]);
  }, [isOpen, location.lng, location.lat]);

  return (
    <>
      <Marker
        longitude={location.lng}
        latitude={location.lat}
        anchor="bottom"
        offset={[0, -POINTER_HEIGHT]}
      >
        {/* A real button rather than a styled div: the pin has to be reachable
            by keyboard, and it is the only way into the station details. */}
        <button
          ref={buttonRef}
          type="button"
          aria-label={title}
          aria-expanded={isOpen}
          onClick={handleClick}
          className="relative block cursor-pointer rounded-sm border border-[#C5221F] bg-[#EA4335] px-1 py-px text-xs font-bold leading-tight text-black whitespace-nowrap after:absolute after:left-1/2 after:top-full after:-ml-[5px] after:border-[5px] after:border-transparent after:border-t-[#C5221F] after:content-['']"
        >
          {location.addresses[0].stations[0].callsign}
          {plus}
        </button>
      </Marker>

      {isOpen && (
        <Popup
          ref={popupRef}
          longitude={location.lng}
          latitude={location.lat}
          offset={POPUP_OFFSET}
          closeOnClick={false}
          // Wrapped: MapLibre hands onClose the popup event, which would
          // otherwise arrive as the id to open.
          onClose={() => closePopup()}
          maxWidth="none"
        >
          <LocationContent location={location} />
        </Popup>
      )}
    </>
  );
}
