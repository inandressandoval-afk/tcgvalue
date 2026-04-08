import type { PokemonCard, CardSet, SearchFilters, SearchResult } from '@/types'

const BASE_URL = 'https://api.pokemontcg.io/v2'

function getHeaders(): HeadersInit {
  const headers: HeadersInit = { 'Content-Type': 'application/json' }
  if (process.env.POKEMON_TCG_API_KEY) {
    headers['X-Api-Key'] = process.env.POKEMON_TCG_API_KEY
  }
  return headers
}

// ─── Recherche de cartes ──────────────────────────────────────────────────────

export async function searchCards(filters: SearchFilters): Promise<SearchResult> {
  const params = new URLSearchParams()

  const queryParts: string[] = []
  if (filters.q) queryParts.push(`name:"${filters.q}*"`)
  if (filters.set) queryParts.push(`set.id:"${filters.set}"`)
  if (filters.rarity) queryParts.push(`rarity:"${filters.rarity}"`)
  if (filters.type) queryParts.push(`types:"${filters.type}"`)
  if (filters.supertype) queryParts.push(`supertype:"${filters.supertype}"`)

  if (queryParts.length > 0) params.set('q', queryParts.join(' '))
  params.set('page', String(filters.page ?? 1))
  params.set('pageSize', String(filters.pageSize ?? 20))
  params.set('orderBy', '-set.releaseDate')

  const res = await fetch(`${BASE_URL}/cards?${params}`, {
    headers: getHeaders(),
    next: { revalidate: 300 }, // cache 5min
  })

  if (!res.ok) throw new Error(`PokéTCG API error: ${res.status}`)

  const data = await res.json()

  return {
    cards: data.data as PokemonCard[],
    totalCount: data.totalCount,
    page: data.page,
    pageSize: data.pageSize,
    hasMore: data.page * data.pageSize < data.totalCount,
  }
}

// ─── Détail d'une carte ───────────────────────────────────────────────────────

export async function getCard(cardId: string): Promise<PokemonCard | null> {
  const res = await fetch(`${BASE_URL}/cards/${cardId}`, {
    headers: getHeaders(),
    next: { revalidate: 3600 }, // cache 1h
  })

  if (res.status === 404) return null
  if (!res.ok) throw new Error(`PokéTCG API error: ${res.status}`)

  const data = await res.json()
  return data.data as PokemonCard
}

// ─── Liste des extensions ─────────────────────────────────────────────────────

export async function getSets(): Promise<CardSet[]> {
  const res = await fetch(`${BASE_URL}/sets?orderBy=-releaseDate`, {
    headers: getHeaders(),
    next: { revalidate: 3600 * 24 }, // cache 24h
  })

  if (!res.ok) throw new Error(`PokéTCG API error: ${res.status}`)

  const data = await res.json()
  return data.data as CardSet[]
}

// ─── Cartes d'une extension ───────────────────────────────────────────────────

export async function getSetCards(setId: string): Promise<PokemonCard[]> {
  const res = await fetch(`${BASE_URL}/cards?q=set.id:"${setId}"&pageSize=250`, {
    headers: getHeaders(),
    next: { revalidate: 3600 },
  })

  if (!res.ok) throw new Error(`PokéTCG API error: ${res.status}`)

  const data = await res.json()
  return data.data as PokemonCard[]
}
