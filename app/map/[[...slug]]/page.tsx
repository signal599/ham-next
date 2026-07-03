import { parseSlug } from "@/lib/parse-slug";
import MapPage from "@/components/MapPage";
import PageLayout from "@/components/page-layout";
import Link from "next/link";
import { cookies } from "next/headers";
import { verifySessionToken, COOKIE_NAME } from "@/lib/auth";

interface Props {
  params: { slug?: string[] };
}

export default async function MapSlugPage({ params }: Props) {
  const { slug } = await params;
  const query = parseSlug(slug);

  let isAuthenticated = false;
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (token) {
      await verifySessionToken(token);
      isAuthenticated = true;
    }
  } catch {
    // not authenticated
  }

  return (
    <PageLayout title="Amateur Radio License Map" extra_classes="sm:pr-28">

      {isAuthenticated && (
        <div className="flex justify-end -mt-5 mb-2">
          <Link href="/export" className="btn btn-sm btn-outline">Export to file</Link>
        </div>
      )}

      <div className="collapse collapse-arrow bg-base-100 rounded-lg border border-gray-300 -mt-5 mb-5">
        <input type="checkbox" />
        <div className="collapse-title font-semibold">
          Click to show instructions
        </div>
        <div className="collapse-content text-sm">
          <p className="mt-0">
            Use this map to find amateur radio license holders in the USA.{" "}
            <a href="/news">Click here</a> for more general info and history.
          </p>
          <ul>
            <li>
              Select the type of input (callsign, gridsquare, zip code or street
              address).
            </li>
            <li>Enter an appropriate search value.</li>
            <li>Press Enter or hit the Go button.</li>
            <li>
              Scroll down see the map. You might need to click on the empty
              space to the right of the map to avoid zooming the map
              unintentionally.
            </li>
          </ul>
          <p>The selection determines the center of the map.</p>
          <p>
            When the map appears, you can adjust the zoom level and drag the map
            around. If you’re looking at a sparsely populated area, you might
            need to zoom out.
          </p>
          <p>
            After two seconds of not moving, it will reload with stations for
            the new area. You can also click on the gridsquare labels to center
            the map on that square. Use the “Show gridsquares” checkbox to
            temporarily remove the gridsquare lines and labels if they get in
            the way.
          </p>
          <p className="mb-0">Click on a marker to see a popup of name and address info.</p>
        </div>
      </div>

      <MapPage initialQuery={query} />
    </PageLayout>
  );
}
