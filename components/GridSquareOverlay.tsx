"use client";

import { useEffect } from "react";
import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import { GridSquare } from "@/lib/map-types";

interface Props {
  gridSquares: GridSquare[][];
  onGridClick?: (code: string) => void;
}

export default function GridSquareOverlay({ gridSquares, onGridClick }: Props) {
  const map = useMap();
  const mapsLib = useMapsLibrary("maps");

  useEffect(() => {
    if (!map || !mapsLib) return;

    const flat = gridSquares.flat();

    const rectangles = flat.map((sq) => {
      const rect = new mapsLib.Rectangle({
        map,
        bounds: {
          north: sq.latNorth,
          south: sq.latSouth,
          east: sq.lngEast,
          west: sq.lngWest,
        },
        strokeColor: "#000000",
        strokeOpacity: 0.5,
        strokeWeight: 1,
        fillOpacity: 0,
        clickable: false,
      });
      return rect;
    });

    return () => {
      rectangles.forEach((r) => r.setMap(null));
    };
  }, [map, mapsLib, gridSquares]);

  return null;
}
