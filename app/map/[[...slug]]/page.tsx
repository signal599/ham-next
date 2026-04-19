import { parseSlug } from "@/lib/parse-slug";
import MapPage from "@/components/MapPage";
import PageLayout from "@/components/page-layout";
import Link from "next/link";

interface Props {
  params: { slug?: string[] };
}

export default async function MapSlugPage({ params }: Props) {
  const { slug } = await params;
  const query = parseSlug(slug);
  return (
    <PageLayout title="Amateur Radio License Map" extra_classes="sm:pr-28">
      <p className="-mt-5"><Link href="/map/help">Click here for help</Link></p>
      <MapPage initialQuery={query} />
    </PageLayout>
  );
}
