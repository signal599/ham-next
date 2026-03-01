import getStatusData from "../lib/status-report";

export default async function Page() {
  const { result, totals } = await getStatusData();
  return (
    <>
      <h1>Status</h1>
      <table>
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
    </>
  );
}
