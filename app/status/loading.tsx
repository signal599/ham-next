import StatusPageShell from "@/components/status-page-shell";
import {
  GeocodeHistoryTableSkeleton,
  StatusTableSkeleton,
} from "@/components/status-tables";

// Lets the router commit the navigation immediately instead of sitting on the
// previous page while the server renders. It matches the page's own fallbacks,
// so nothing jumps when the real page takes over.
export default function Loading() {
  return (
    <StatusPageShell
      statusTable={<StatusTableSkeleton />}
      historyTable={<GeocodeHistoryTableSkeleton />}
    />
  );
}
