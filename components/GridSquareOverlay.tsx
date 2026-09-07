"use client";

import { useMemo } from "react";
import { Source, Layer } from "react-map-gl/maplibre";
import { GridSquare } from "@/lib/map-types";
import { getGridSquareBounds } from "@/lib/gridsquares";

interface Props {
  gridSquares: GridSquare[];
}

export default function GridSquareOverlay({ gridSquares }: Props) {
  // One outline per subsquare, drawn as a single line layer. The rectangles
  // this replaces were individual map objects that had to be torn down by hand.
  const data = useMemo(() => {
    return {
      type: "FeatureCollection" as const,
      features: gridSquares.map((sq) => {
        const b = getGridSquareBounds(sq.lat, sq.lng);

        return {
          type: "Feature" as const,
          properties: { code: sq.code },
          geometry: {
            type: "Polygon" as const,
            coordinates: [
              [
                [b.west, b.north],
                [b.east, b.north],
                [b.east, b.south],
                [b.west, b.south],
                [b.west, b.north],
              ],
            ],
          },
        };
      }),
    };
  }, [gridSquares]);

  return (
    <Source id="gridsquares" type="geojson" data={data}>
      <Layer
        id="gridsquare-outlines"
        type="line"
        paint={{
          "line-color": "#000000",
          "line-opacity": 0.5,
          "line-width": 1,
        }}
      />
    </Source>
  );
}
