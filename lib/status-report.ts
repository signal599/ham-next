import { unstable_cache } from "next/cache";
import { sql, gt, notInArray, and } from "drizzle-orm";
import { hamAddress } from "@/src/db/schema";
import { db } from '@/lib/db-pool';
import {
  GEOCODE_STATUS_NOT_FOUND,
  GEOCODE_STATUS_NOT_FOUND_RAW_ADDRESS,
  GEOCODE_STATUS_PENDING,
  GEOCODE_STATUS_SUCCESS,
} from "@/lib/geocode-status";

// Report columns, in display order.
const COLUMN_NEW = 0;
const COLUMN_SUCCESS = 1;
const COLUMN_NOT_FOUND = 2;
const COLUMN_NO_GEOCODE = 3;

export const getStatusData = unstable_cache(fetchStatusData, ["status-report"], {
  tags: ["status"],
  revalidate: 3600,
});

async function fetchStatusData() {
  const rows = await db
    .select({
      state: hamAddress.addressAdministrativeArea,
      status: hamAddress.geocodeStatus,
      noGeocode: hamAddress.noGeocode,
      count: sql<number>`count(*)`,
    })
    .from(hamAddress)
    .where(
      and(
        gt(hamAddress.addressAdministrativeArea, ""),
        notInArray(hamAddress.addressAdministrativeArea, ["AA", "AE"]),
      ),
    )
    .groupBy(
      hamAddress.addressAdministrativeArea,
      hamAddress.geocodeStatus,
      hamAddress.noGeocode,
    );

    const totals = [0, 0, 0, 0];
    const counts = new Map();

    rows.forEach(row => {
      const column = getColumn(row.status, row.noGeocode);

      // Skip rows with an unknown geocode status.
      if (column === null) {
        return;
      }

      if (!counts.has(row.state)) {
        counts.set(row.state, [0, 0, 0, 0, row.state]);
      }

      const value = counts.get(row.state);
      // Several status/no_geocode combinations can share a column, so add.
      value[column] += row.count;
      counts.set(row.state, value);
      totals[column] += row.count;
    });

    const result = counts.values().toArray().sort((a, b) => {
      if (a[4] < b[4]) {
        return -1;
      }
      else if (a[4] > b[4]) {
        return 1;
      }
      return 0;
    });

    return { result, totals };
}

// Success is checked before no_geocode because manually geocoded addresses are
// successful pins on the map even though no_geocode keeps the batch geocoder
// away from them.
function getColumn(status: number | null, noGeocode: number): number | null {
  if (status === GEOCODE_STATUS_SUCCESS) {
    return COLUMN_SUCCESS;
  }

  if (noGeocode) {
    return COLUMN_NO_GEOCODE;
  }

  switch (status) {
    case GEOCODE_STATUS_PENDING:
      return COLUMN_NEW;

    case GEOCODE_STATUS_NOT_FOUND_RAW_ADDRESS:
    case GEOCODE_STATUS_NOT_FOUND:
      return COLUMN_NOT_FOUND;
  }

  return null;
}
