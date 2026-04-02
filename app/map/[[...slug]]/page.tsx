import { parseSlug } from '@/lib/parse-slug'
import MapPage from '@/components/MapPage'

interface Props {
  params: { slug?: string[] }
}

export default async function MapSlugPage({ params }: Props) {
  const { slug } = await params
  const query = parseSlug(slug)
  return (
    <div className="p-4 pt-0">
    <h1 className="m-0">Amateur Radio License Map</h1>
    <MapPage initialQuery={query} />
    </div>
)
}
