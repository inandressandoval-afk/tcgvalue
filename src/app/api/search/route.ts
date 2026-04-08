import { NextRequest, NextResponse } from 'next/server'
import { searchCards } from '@/lib/api/pokemon-tcg'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)

  const filters = {
    q: searchParams.get('q') ?? undefined,
    set: searchParams.get('set') ?? undefined,
    rarity: searchParams.get('rarity') ?? undefined,
    type: searchParams.get('type') ?? undefined,
    page: parseInt(searchParams.get('page') ?? '1'),
    pageSize: parseInt(searchParams.get('pageSize') ?? '20'),
  }

  try {
    const result = await searchCards(filters)
    return NextResponse.json(result)
  } catch (err) {
    console.error('[SEARCH]', err)
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}
