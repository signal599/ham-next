import PageLayout from "@/components/page-layout";
import Link from "next/link";

const title = "News and Info: July 2025";

export const metadata = { title };

export default function Page() {
  return (
    <PageLayout title={title}>
      <p>
        Use this map to find amateur radio license holders in the USA.{" "}
        <a href="/news">Click here</a> for more general info and history.
      </p>
      <ul>
        <li>
          Select the type of input (callsign, gridsquare, zip code or street
          address).
        </li>
        <li>
          Enter an appropriate search value.
        </li>
        <li>
          Press Enter or hit the Go button.
        </li>
        <li>
          Scroll down see the map. You might need to click on the empty space to the right of the map to avoid zooming the map unintentionally.
        </li>
      </ul>
      <p>The selection determines the center of the map.</p>
      <p>
        When the map appears, you can adjust the zoom level and drag the map
        around. If you’re looking at a sparsely populated area, you might need
        to zoom out.
      </p>
      <p>
        After two seconds of not moving, it will reload with stations for
        the new area. You can also click on the gridsquare labels to center the
        map on that square. Use the “Show gridsquares” checkbox to temporarily
        remove the gridsquare lines and labels if they get in the way.
      </p>
      <p>Click on a marker to see a popup of name and address info.</p>

      <p><Link href="/map">Return to the map</Link></p>
    </PageLayout>
  );
}
