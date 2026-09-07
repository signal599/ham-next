"use client";

import { useCallback, useEffect, useRef } from "react";
import Map, {
  Marker,
  Popup,
  NavigationControl,
  type ViewStateChangeEvent,
  type PopupInstance,
} from "react-map-gl/maplibre";
import { setWorkerUrl } from "maplibre-gl";
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

// Height of the pin's pointer. The marker is shifted up by this much so the
// tip, rather than the bottom of the label, sits on the coordinate.
const POINTER_HEIGHT = 5;

// Clears the pin so the popup doesn't cover the callsign that opened it.
const POPUP_OFFSET = 28;

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
          onClose={() => onPopupClose()}
          maxWidth="none"
        >
          <LocationContent location={location} />
        </Popup>
      )}
    </>
  );
}
