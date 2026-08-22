import { Suspense } from "react";
import StatusPageShell from "@/components/status-page-shell";
import {
  GeocodeHistoryTable,
  GeocodeHistoryTableSkeleton,
  StatusTable,
  StatusTableSkeleton,
} from "@/components/status-tables";

export const metadata = { title: "Status" };

// The two queries take seconds when the cache is cold, so neither is awaited
// here. The page shell streams out first and each table replaces its skeleton
// as soon as its own query finishes.
export default function Page() {
  return (
    <StatusPageShell
      statusTable={
        <Suspense fallback={<StatusTableSkeleton />}>
          <StatusTable />
        </Suspense>
      }
      historyTable={
        <Suspense fallback={<GeocodeHistoryTableSkeleton />}>
          <GeocodeHistoryTable />
        </Suspense>
      }
    />
  );
}
