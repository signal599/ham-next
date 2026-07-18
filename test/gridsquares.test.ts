import { describe, it, expect } from "vitest";
import {
  latLngToGridSquare,
  GridSquareToLatLng,
  getNeighboringGridSquares,
  getGridSquareBounds,
} from "@/lib/gridsquares";

// Characterization tests for the Maidenhead locator math.

describe("latLngToGridSquare", () => {
  it("maps the origin (0, 0) to the expected square", () => {
    expect(latLngToGridSquare(0, 0)).toBe("JJ00aa");
  });

  it("produces a well-formed 6-char locator", () => {
    const code = latLngToGridSquare(42.5, -71.3);
    expect(code).toMatch(/^[A-R]{2}[0-9]{2}[a-x]{2}$/);
  });
});

describe("GridSquareToLatLng", () => {
  it("rejects malformed codes", () => {
    expect(() => GridSquareToLatLng("ZZ99zz")).toThrow(/Invalid gridsquare/);
    expect(() => GridSquareToLatLng("1234ab")).toThrow(/Invalid gridsquare/);
    expect(() => GridSquareToLatLng("")).toThrow(/Invalid gridsquare/);
  });

  it("returns the center of the subsquare", () => {
    // Snapshot pins the exact current center calculation.
    expect(GridSquareToLatLng("FN42dt")).toMatchInlineSnapshot(`
      {
        "lat": 42.8125,
        "lng": -71.708333,
      }
    `);
  });

  it("round-trips: center of a square maps back to that square", () => {
    for (const code of ["AA00aa", "FN42dt", "DM79lx", "RR99xx"]) {
      const { lat, lng } = GridSquareToLatLng(code);
      expect(latLngToGridSquare(lat, lng)).toBe(code);
    }
  });
});

describe("getNeighboringGridSquares", () => {
  it("returns an 11x11 grid of squares (121)", () => {
    const grids = getNeighboringGridSquares(42.5, -71.3);
    expect(grids).toHaveLength(121);
  });

  it("every neighbor is a valid, distinct locator", () => {
    const grids = getNeighboringGridSquares(42.5, -71.3);
    for (const g of grids) {
      expect(g.code).toMatch(/^[A-R]{2}[0-9]{2}[a-x]{2}$/);
    }
    const codes = grids.map((g) => g.code);
    expect(new Set(codes).size).toBe(codes.length);
  });

  it("matches the recorded neighbor codes", () => {
    const codes = getNeighboringGridSquares(42.5, -71.3).map((g) => g.code);
    expect(codes).toMatchSnapshot();
  });
});

describe("getGridSquareBounds", () => {
  it("brackets the point by half a subsquare", () => {
    const b = getGridSquareBounds(42.5, -71.3);
    expect(b.north).toBeCloseTo(42.520833, 6);
    expect(b.south).toBeCloseTo(42.479167, 6);
    expect(b.east).toBeCloseTo(-71.258333, 6);
    expect(b.west).toBeCloseTo(-71.341667, 6);
  });
});
