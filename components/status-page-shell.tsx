import PageLayout from "@/components/page-layout";

// The static half of /status. Both the page and its loading state render this,
// so the explanatory text is on screen before either query comes back and does
// not move when they do.
export default function StatusPageShell({
  statusTable,
  historyTable,
}: {
  statusTable: React.ReactNode;
  historyTable: React.ReactNode;
}) {
  return (
    <PageLayout title="License Map Status">
      <p>The table below shows the status of the geocoding.</p>
      <ul>
        <li>
          <em>New:</em> The number of newly added or updated addresses which
          have not been geocoded yet. Any non-zero number should reduce in the
          coming hours.
        </li>
        <li>
          <em>Successful</em>: The number of successfully geocoded addresses.
          This represents unique pins on the map.
        </li>
        <li>
          <em>Not found</em>: The number of addresses that the system attempted
          to geocode but failed. Geocoding is not perfect. Sometimes the
          geocoding service simply doesn’t understand the address for various
          reasons.
        </li>
        <li>
          <em>PO Box</em>: The number of addresses that it didn’t bother trying
          to geocode because it looks like a PO Box.
        </li>
      </ul>

      {statusTable}

      <h2 className="mt-8">Geocoding history</h2>
      <p>
        The following shows how many addresses were geocoded in each month. A
        process is running which is slowly re-geocoding all addresses. This is
        to take advantage of the improved accuracy and success rates since the
        project started. The counts for the older months will slowly reduce over
        time as those addresses are re-geocoded.
      </p>

      {historyTable}
    </PageLayout>
  );
}
