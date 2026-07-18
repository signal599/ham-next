import { unstable_cache } from "next/cache";
import { sql, gt, notInArray, and } from "drizzle-orm";
import { hamAddress } from "@/src/db/schema";
import { db } from '@/lib/db-pool';

export const getStatusData = unstable_cache(fetchStatusData, ["status-report"], {
  tags: ["status"],
  revalidate: 3600,
});

async function fetchStatusData() {
  const rows = await db
    .select({
      state: hamAddress.addressAdministrativeArea,
      status: hamAddress.geocodeStatus,
      count: sql<number>`count(*)`,
    })
    .from(hamAddress)
    .where(
      and(
        gt(hamAddress.addressAdministrativeArea, ""),
        notInArray(hamAddress.addressAdministrativeArea, ["AA", "AE"]),
      ),
    )
    .groupBy(hamAddress.addressAdministrativeArea, hamAddress.geocodeStatus);

    const totals = [0, 0, 0, 0];
    const counts = new Map();

    rows.forEach(row => {
      const status = row.status;

      // Skip rows with an unknown geocode status; the counts arrays only have
      // slots for statuses 0-3.
      if (status === null || status < 0 || status > 3) {
        return;
      }

      if (!counts.has(row.state)) {
        counts.set(row.state, [0, 0, 0, 0, row.state]);
      }

      const value = counts.get(row.state);
      value[status] = row.count;
      counts.set(row.state, value);
      totals[status] += row.count;
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
