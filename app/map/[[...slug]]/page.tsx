import MapForm from "@/components/map-form";
import Map from "@/components/map";
import { getMapData } from "@/app/lib/map-query"

export default async function Page({
  params
}: {
  params: Promise<{ slug?: string[] }>
}) {
  const { slug } = await params;

  let type = slug?.[0] ?? '';
  let query = slug?.[1] ?? '';

  if (!query) {
    query = type;
    type = 'c'
  }

  const mapData = await getMapData(type, query);

  return (
    <>
      <h1>Amateur Radio License Map</h1>
      <MapForm initialType={type} initialQuery={query} />
      <Map data={mapData} />
    </>
  );
}