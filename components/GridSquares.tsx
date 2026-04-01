// GridSquares.tsx
"use client";

import { AdvancedMarker } from "@vis.gl/react-google-maps";
import { GridSquare } from "@/lib/map-types";
import GridSquareOverlay from "./GridSquareOverlay";

interface Props {
  gridSquares: GridSquare[][];
  onGridClick?: (code: string) => void;
}

export default function GridSquares({ gridSquares, onGridClick }: Props) {
  const flat = gridSquares.flat();

  return (
    <>
      <GridSquareOverlay gridSquares={gridSquares} />
      {flat.map((sq) => (
        <AdvancedMarker
          key={sq.code}
          position={{ lat: sq.latCenter, lng: sq.lngCenter }}
          onClick={() => onGridClick?.(sq.code)}
        >
          <div style={{
            background: "yellow",
            border: "1px solid #999",
            borderRadius: 2,
            padding: "1px 4px",
            fontSize: 16,
            fontWeight: "bold",
            whiteSpace: "nowrap",
            cursor: onGridClick ? "pointer" : "default",
            transform: "translate(-50%, -50%)",
          }}>
            {sq.code}
          </div>
        </AdvancedMarker>
      ))}
    </>
  );
}
