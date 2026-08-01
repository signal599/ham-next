// Mirrors the geocode_status values written by haminfo-cli. A separate
// no_geocode column marks addresses the geocoder skips (PO boxes, opt-outs and
// manually geocoded rows), so it is no longer a status value.
export const GEOCODE_STATUS_PENDING = 0;
export const GEOCODE_STATUS_SUCCESS = 1;
export const GEOCODE_STATUS_NOT_FOUND_RAW_ADDRESS = 2;
export const GEOCODE_STATUS_NOT_FOUND = 3;
