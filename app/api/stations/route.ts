import { NextRequest, NextResponse } from 'next/server'
import { doQuery } from '@/lib/map-query'
import { HamInfoQuery, SearchQuery } from '@/lib/map-types'
import { doQuery as doQuery2 } from '@/lib/haminfo-query'

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

  let query2: HamInfoQuery | null = null

  if (type === 'callsign' && p.get('value')) {
    query2 = { type: 'c', value: p.get('value')! }
  } else if (type === 'gridsquare' && p.get('value')) {
    query2 = { type: 'g', value: p.get('value')! }
  } else if (type === 'zipcode' && p.get('value')) {
    query2 = { type: 'z', value: p.get('value')! }
  } else if (type === 'point' && p.get('lat') && p.get('lng')) {
    query2 = { type: 'latlng', value: `${p.get('lat')},${p.get('lng')}` }
  }

  if (!query2) {
    return NextResponse.json({ error: 'Invalid query parameters' }, { status: 400 })
  }

  try {
    const data = await doQuery(query)
    const data2 = await doQuery2(query2);

    return NextResponse.json(data)
  } catch (e) {
    return NextResponse.json({ error: 'Query failed' }, { status: 500 })
  }
}
