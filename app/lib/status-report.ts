import { drizzle } from "drizzle-orm/mysql2";
import { sql, gt, notInArray, and } from "drizzle-orm";
import { hamAddress } from "@/src/db/schema";

const db = drizzle(process.env.DATABASE_URL!);

export default async function getStatusData() {
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
      if (!counts.has(row.state)) {
        counts.set(row.state, [0, 0, 0, 0, row.state]);
      }

      const value = counts.get(row.state);
      value[row.status!] = row.count;
      counts.set(row.state, value);
      totals[row.status!] += row.count;
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
