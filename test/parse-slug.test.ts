import { describe, it, expect } from "vitest";
import { parseSlug, queryToPath } from "@/lib/parse-slug";

// Characterization tests: these lock in the CURRENT behavior of the URL
// slug parser so future refactors don't change it unnoticed.

describe("parseSlug", () => {
  it("returns null for empty / missing slugs", () => {
    expect(parseSlug(undefined)).toBeNull();
    expect(parseSlug([])).toBeNull();
  });

  describe("point (/map/p/lat/lng)", () => {
    it("parses a valid point", () => {
      expect(parseSlug(["p", "42.5", "-71.3"])).toEqual({
        type: "point",
        lat: 42.5,
        lng: -71.3,
      });
    });

    it("rejects non-numeric coords", () => {
      expect(parseSlug(["p", "abc", "0"])).toBeNull();
    });

    it("rejects out-of-range coords", () => {
      expect(parseSlug(["p", "999", "0"])).toBeNull();
      expect(parseSlug(["p", "0", "999"])).toBeNull();
    });

    it("rejects non-finite coords", () => {
      expect(parseSlug(["p", "Infinity", "0"])).toBeNull();
    });

    it("returns null when lng segment is missing", () => {
      expect(parseSlug(["p", "42.5"])).toBeNull();
    });
  });

  describe("callsign (/map/c/CALL)", () => {
    it("parses and upper-cases", () => {
      expect(parseSlug(["c", "kt1f"])).toEqual({
        type: "callsign",
        value: "KT1F",
      });
    });
  });

  describe("gridsquare (/map/g/CODE)", () => {
    it("normalizes case (field upper, square digits, subsquare lower)", () => {
      expect(parseSlug(["g", "fn42DT"])).toEqual({
        type: "gridsquare",
        value: "FN42dt",
      });
    });
  });

  describe("zipcode (/map/z/ZIP)", () => {
    it("passes the value through verbatim", () => {
      expect(parseSlug(["z", "03086"])).toEqual({
        type: "zipcode",
        value: "03086",
      });
    });
  });

  describe("single-segment convenience (/map/CALL)", () => {
    it("treats a lone segment as a callsign", () => {
      expect(parseSlug(["W1AW"])).toEqual({
        type: "callsign",
        value: "W1AW",
      });
    });
  });
});

describe("queryToPath", () => {
  it("builds the canonical path for each query type", () => {
    expect(queryToPath({ type: "callsign", value: "KT1F" })).toBe("/map/KT1F");
    expect(queryToPath({ type: "gridsquare", value: "FN42dt" })).toBe(
      "/map/g/fn42dt",
    );
    expect(queryToPath({ type: "zipcode", value: "03086" })).toBe(
      "/map/z/03086",
    );
    expect(queryToPath({ type: "point", lat: 42.5, lng: -71.3 })).toBe(
      "/map/p/42.5/-71.3",
    );
  });

  it("round-trips through parseSlug", () => {
    const cases = [
      { type: "callsign", value: "KT1F" },
      { type: "zipcode", value: "03086" },
      { type: "point", lat: 42.5, lng: -71.3 },
    ] as const;

    for (const q of cases) {
      const segments = queryToPath(q).split("/").filter(Boolean).slice(1); // drop "map"
      expect(parseSlug(segments)).toEqual(q);
    }
  });
});
