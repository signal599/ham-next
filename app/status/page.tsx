import { getStatusData } from "@/lib/status-report";
import PageLayout from "@/components/page-layout";

export const metadata = { title: "Status" };

export default async function Page() {
  const { result, totals } = await getStatusData();
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

      <table className="table-zebra max-w-3xl">
        <thead>
          <tr>
            <th>State</th>
            <th>New</th>
            <th>Successful</th>
            <th>Not Found</th>
            <th>PO Box</th>
          </tr>
        </thead>
        <tbody>
          {result.map((row) => {
            return (
              <tr key={row[4]}>
                <td>{row[4]}</td>
                <td>{row[0]}</td>
                <td>{row[1]}</td>
                <td>{row[2]}</td>
                <td>{row[3]}</td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr>
            <th>Totals</th>
            <td>{totals[0]}</td>
            <td>{totals[1]}</td>
            <td>{totals[2]}</td>
            <td>{totals[3]}</td>
          </tr>
        </tfoot>
      </table>
    </PageLayout>
  );
}
