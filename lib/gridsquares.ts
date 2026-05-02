import { GridSquare } from "./map-types";
import { roundPoint } from "./utils";

export function latLngToGridSquare(lat: number, lng: number): string {
  // Normalize coordinates
  const adjLng = lng + 180;
  const adjLat = lat + 90;

  // Field (characters 1-2)
  const field1 = String.fromCharCode(65 + Math.floor(adjLng / 20));
  const field2 = String.fromCharCode(65 + Math.floor(adjLat / 10));

  // Square (characters 3-4)
  const square1 = String(Math.floor((adjLng % 20) / 2));
  const square2 = String(Math.floor(adjLat % 10));

  // Subsquare (characters 5-6)
  const subLng = (adjLng % 2) / 2;
  const subLat = adjLat % 1;
  const sub1 = String.fromCharCode(65 + Math.floor(subLng * 24)).toLowerCase();
  const sub2 = String.fromCharCode(65 + Math.floor(subLat * 24)).toLowerCase();

  return `${field1}${field2}${square1}${square2}${sub1}${sub2}`;
}

export function GridSquareToLatLng(grid: string): { lat: number; lng: number } {
  if (!/^[A-Ra-r]{2}[0-9]{2}[A-Xa-x]{2}$/.test(grid)) {
    throw new Error("Invalid Maidenhead grid locator");
  }

  const g = grid.toUpperCase();

  // Field (chars 1-2): each field is 20° lng × 10° lat
  const lng = (g.charCodeAt(0) - 65) * 20 - 180;
  const lat = (g.charCodeAt(1) - 65) * 10 - 90;

  // Square (chars 3-4): each square is 2° lng × 1° lat
  const lng2 = parseInt(g[2]) * 2;
  const lat2 = parseInt(g[3]) * 1;

  // Subsquare (chars 5-6): each subsquare is 5' lng × 2.5' lat
  const lng3 = (g.charCodeAt(4) - 65) * (2 / 24);
  const lat3 = (g.charCodeAt(5) - 65) * (1 / 24);

  // Center offset: half a subsquare
  const lngCenter = 1 / 24;
  const latCenter = 0.5 / 24;

  return roundPoint({
    lat: lat + lat2 + lat3 + latCenter,
    lng: lng + lng2 + lng3 + lngCenter,
  });
}

export function getNeighboringGridSquares(lat: number, lng: number): GridSquare[] {
  const sqLng = 2 / 24;
  const sqLat = 1 / 24;

  const centerGrid = latLngToGridSquare(lat, lng);
  const { lat: centerLat, lng: centerLng } = GridSquareToLatLng(centerGrid);

  const grids: GridSquare[] = [];

  for (let row = 5; row >= -5; row--) {
    for (let col = -5; col <= 5; col++) {
      const pointLat = centerLat + row * sqLat;
      const pointLng = centerLng + col * sqLng;
      const code = latLngToGridSquare(pointLat, pointLng);
      const { lat: gridLat, lng: gridLng } = GridSquareToLatLng(code);
      grids.push({ code, lat: gridLat, lng: gridLng });
    }
  }

  return grids;
}

type GridSquareBounds = {
  north: number;
  south: number;
  east: number;
  west: number;
}

export function getGridSquareBounds(lat: number, lng: number): GridSquareBounds {
  const halfLng = 1 / 24;   // half subsquare width  (~0.04167°)
  const halfLat = 0.5 / 24; // half subsquare height (~0.02083°)

  return {
    north: lat + halfLat,
    south: lat - halfLat,
    east:  lng + halfLng,
    west:  lng - halfLng,
  };
}
