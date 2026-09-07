"use client";

import { Marker } from "react-map-gl/maplibre";
import { GridSquare } from "@/lib/map-types";
import GridSquareOverlay from "./GridSquareOverlay";

interface Props {
  gridSquares: GridSquare[];
  onGridClick?: (code: string) => void;
}

export default function GridSquares({ gridSquares, onGridClick }: Props) {
  return (
    <>
      <GridSquareOverlay gridSquares={gridSquares} />
      {gridSquares.map((sq) => (
        <Marker key={sq.code} longitude={sq.lng} latitude={sq.lat} anchor="center">
          <button
            type="button"
            aria-label={`Show gridsquare ${sq.code}`}
            disabled={!onGridClick}
            onClick={() => onGridClick?.(sq.code)}
            style={{
              background: "yellow",
              border: "1px solid #999",
              borderRadius: 2,
              padding: "1px 4px",
              fontSize: 16,
              fontWeight: "bold",
              whiteSpace: "nowrap",
              cursor: onGridClick ? "pointer" : "default",
            }}
          >
            {sq.code}
          </button>
        </Marker>
      ))}
    </>
  );
}
