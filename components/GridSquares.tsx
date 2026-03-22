// GridSquares.tsx
"use client";

import { AdvancedMarker } from "@vis.gl/react-google-maps";
import { Subsquare } from "@/app/lib/map-types";
import GridSquareOverlay from "./GridSquareOverlay";

interface Props {
  subsquares: Subsquare[][];
  onGridClick?: (code: string) => void;
}

export default function GridSquares({ subsquares, onGridClick }: Props) {
  const flat = subsquares.flat();

  return (
    <>
      <GridSquareOverlay subsquares={subsquares} />
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
            fontSize: 14,
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
