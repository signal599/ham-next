import { getGeocodeHistory, getStatusData } from "@/lib/status-report";

const STATUS_HEADERS = ["State", "New", "Successful", "Not Found", "PO Box"];
const HISTORY_HEADERS = ["Month", "Count"];

// Both the real tables and their skeletons render through this, so the ghost
// keeps the same columns and header styling as the content it stands in for.
function TableFrame({
  caption,
  headers,
  children,
}: {
  caption: string;
  headers: string[];
  children: React.ReactNode;
}) {
  return (
    <table className="table-zebra max-w-3xl">
      <caption className="sr-only">{caption}</caption>
      <thead className="[&_th]:sticky [&_th]:top-0 [&_th]:z-10 [&_th]:bg-white">
        <tr>
          {headers.map((header) => (
            <th key={header} scope="col">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      {children}
    </table>
  );
}

// Cycled rather than random so the server and client markup agree.
const BAR_WIDTHS = ["w-10", "w-14", "w-12", "w-16", "w-11", "w-13"];

function SkeletonRows({ rows, columns }: { rows: number; columns: number }) {
  return (
    <tbody className="animate-pulse">
      {Array.from({ length: rows }, (_, row) => (
        <tr key={row}>
          {Array.from({ length: columns }, (_, column) => (
            <td key={column}>
              <div
                className={`h-4 rounded bg-gray-200 ${
                  BAR_WIDTHS[(row + column) % BAR_WIDTHS.length]
                }`}
              />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}

// The skeletons carry the live region: they are what is on screen while the
// query runs, and swapping in the real table announces the update.
function TableSkeleton({
  caption,
  headers,
  rows,
}: {
  caption: string;
  headers: string[];
  rows: number;
}) {
  return (
    <div role="status" aria-live="polite">
      <span className="sr-only">Loading {caption.toLowerCase()}…</span>
      <div aria-hidden="true">
        <TableFrame caption={caption} headers={headers}>
          <SkeletonRows rows={rows} columns={headers.length} />
        </TableFrame>
      </div>
    </div>
  );
}

export function StatusTableSkeleton() {
  return (
    <TableSkeleton
      caption="Geocoding status by state"
      headers={STATUS_HEADERS}
      rows={16}
    />
  );
}

export function GeocodeHistoryTableSkeleton() {
  return (
    <TableSkeleton
      caption="Addresses geocoded per month"
      headers={HISTORY_HEADERS}
      rows={10}
    />
  );
}

export async function StatusTable() {
  const { result, totals } = await getStatusData();

  return (
    <TableFrame caption="Geocoding status by state" headers={STATUS_HEADERS}>
      <tbody>
        {result.map((row) => (
          <tr key={row[4]}>
            <th scope="row" className="font-normal">
              {row[4]}
            </th>
            <td>{row[0]}</td>
            <td>{row[1]}</td>
            <td>{row[2]}</td>
            <td>{row[3]}</td>
          </tr>
        ))}
      </tbody>
      <tfoot>
        <tr>
          <th scope="row">Totals</th>
          <td>{totals[0]}</td>
          <td>{totals[1]}</td>
          <td>{totals[2]}</td>
          <td>{totals[3]}</td>
        </tr>
      </tfoot>
    </TableFrame>
  );
}

export async function GeocodeHistoryTable() {
  const history = await getGeocodeHistory();

  return (
    <TableFrame
      caption="Addresses geocoded per month"
      headers={HISTORY_HEADERS}
    >
      <tbody>
        {history.map((row) => (
          <tr key={row.month}>
            <th scope="row" className="font-normal">
              {row.month}
            </th>
            <td>{row.count}</td>
          </tr>
        ))}
      </tbody>
    </TableFrame>
  );
}
