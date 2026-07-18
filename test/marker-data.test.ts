import { describe, it, expect } from "vitest";
import { getMarkerData, type FlatLocationDTO } from "@/lib/location-query";

// Characterization tests for getMarkerData — the pure transform that folds the
// flat joined rows into grouped locations/addresses/stations. Input rows are
// assumed ordered by (location id, address id, station id), as the SQL returns.

function row(overrides: Partial<FlatLocationDTO>): FlatLocationDTO {
  return {
    id: 1,
    lat: "42.5",
    lng: "-71.3",
    address_id: 10,
    address_line1: "123 Main St",
    address_line2: "",
    city: "Nashua",
    state: "NH",
    zip: "03060",
    station_id: 100,
    callsign: "W1AAA",
    first_name: "Jane",
    middle_name: null,
    last_name: "Doe",
    suffix: null,
    organization: null,
    operator_class: "G",
    ...overrides,
  };
}

describe("getMarkerData grouping", () => {
  it("builds a single location/address/station and rounds the point", () => {
    const { locations, activeLocationId } = getMarkerData(
      [
        row({
          lat: "42.50000049",
          lng: "-71.3",
          zip: "03060-1234",
          address_line1: "123 Main Street",
          first_name: "Hiram",
          middle_name: "Percy",
          last_name: "Maxim",
          operator_class: "E",
        }),
      ],
      null,
    );

    expect(activeLocationId).toBeUndefined();
    expect(locations).toHaveLength(1);

    const loc = locations[0];
    expect(loc.lat).toBe(42.5); // rounded to 6dp
    expect(loc.addresses).toHaveLength(1);

    const addr = loc.addresses[0];
    expect(addr.address1).toBe("123 Main St"); // "Street" -> "St"
    expect(addr.zip).toBe("03060"); // 9-digit zip truncated to 5
    expect(addr.stations).toHaveLength(1);
    expect(addr.stations[0].name).toBe("Hiram Percy Maxim");
    expect(addr.stations[0].operatorClass).toBe("E");
  });

  it("uses organization as the station name when present", () => {
    const { locations } = getMarkerData(
      [row({ organization: "ARRL HQ Operators Club", first_name: "X" })],
      null,
    );
    expect(locations[0].addresses[0].stations[0].name).toBe(
      "ARRL HQ Operators Club",
    );
  });
});

describe("getMarkerData station ordering", () => {
  it("sorts stations at one address by license class then callsign", () => {
    const { locations } = getMarkerData(
      [
        row({ station_id: 1, callsign: "W1N", operator_class: "N" }),
        row({ station_id: 2, callsign: "W1E", operator_class: "E" }),
        row({ station_id: 3, callsign: "W1T", operator_class: "T" }),
        row({ station_id: 4, callsign: "W1G", operator_class: "G" }),
        row({ station_id: 5, callsign: "W1A", operator_class: "A" }),
      ],
      null,
    );

    const order = locations[0].addresses[0].stations.map((s) => s.callsign);
    expect(order).toEqual(["W1E", "W1A", "W1G", "W1T", "W1N"]);
  });

  it("hoists the active callsign to the top and reports its location id", () => {
    const { locations, activeLocationId } = getMarkerData(
      [
        row({ id: 7, station_id: 1, callsign: "W1E", operator_class: "E" }),
        row({ id: 7, station_id: 2, callsign: "W1N", operator_class: "N" }),
      ],
      "W1N",
    );

    expect(activeLocationId).toBe(7);
    expect(locations[0].addresses[0].stations[0].callsign).toBe("W1N");
  });
});

describe("getMarkerData address de-duplication", () => {
  it("merges addresses with the same key, keeping the mixed-case variant", () => {
    const { locations } = getMarkerData(
      [
        // Two address rows on the same location, same normalized key,
        // one ALL CAPS and one mixed case.
        row({
          address_id: 10,
          address_line1: "123 MAIN ST",
          city: "NASHUA",
          station_id: 1,
          callsign: "W1CAPS",
          operator_class: "E",
        }),
        row({
          address_id: 11,
          address_line1: "123 Main St",
          city: "Nashua",
          station_id: 2,
          callsign: "W1MIXED",
          operator_class: "G",
        }),
      ],
      null,
    );

    expect(locations).toHaveLength(1);
    const addresses = locations[0].addresses;
    expect(addresses).toHaveLength(1); // merged

    const merged = addresses[0];
    expect(merged.address1).toBe("123 Main St"); // mixed-case kept
    expect(merged.city).toBe("Nashua");
    expect(merged.stations.map((s) => s.callsign).sort()).toEqual([
      "W1CAPS",
      "W1MIXED",
    ]);
  });
});

describe("getMarkerData full-shape snapshot", () => {
  it("captures the current output for a multi-location fixture", () => {
    const result = getMarkerData(
      [
        row({ id: 1, address_id: 10, station_id: 1, callsign: "W1A", operator_class: "E" }),
        row({ id: 1, address_id: 10, station_id: 2, callsign: "W1B", operator_class: "N" }),
        row({
          id: 2,
          lat: "40.1",
          lng: "-75.0",
          address_id: 20,
          address_line1: "5 Oak Road",
          city: "Reading",
          state: "PA",
          zip: "19601",
          station_id: 3,
          callsign: "K3XYZ",
          organization: "Reading Radio Club",
          operator_class: "",
        }),
      ],
      null,
    );

    expect(result).toMatchSnapshot();
  });
});
