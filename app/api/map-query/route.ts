import { NextRequest, NextResponse } from 'next/server'
import { doQuery as doQueryTmp } from '@/lib/map-query-tmp'
import { doQuery } from '@/lib/map-query'
import { SearchQuery } from '@/lib/map-types'

export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams
  const type = p.get('type')

  let query: SearchQuery | null = null

  if (type === 'callsign' && p.get('value')) {
    query = { type: 'callsign', value: p.get('value')! }
  } else if (type === 'gridsquare' && p.get('value')) {
    query = { type: 'gridsquare', value: p.get('value')! }
  } else if (type === 'zipcode' && p.get('value')) {
    query = { type: 'zipcode', value: p.get('value')! }
  } else if (type === 'point' && p.get('lat') && p.get('lng')) {
    query = { type: 'point', lat: Number(p.get('lat')), lng: Number(p.get('lng')) }
  }

  if (!query) {
    return NextResponse.json({ error: 'Invalid query parameters' }, { status: 400 })
  }

  try {
    const data = await doQueryTmp(query)
    const data2 = await doQuery(query);

    return NextResponse.json(data)
  } catch (e) {
    return NextResponse.json({ error: 'Query failed' }, { status: 500 })
  }
}
