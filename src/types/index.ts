// ─── Carte Pokémon ────────────────────────────────────────────────────────────

export interface PokemonCard {
  id: string
  name: string
  number: string
  rarity: string | null
  supertype: string
  subtypes: string[]
  hp: string | null
  types: string[]
  set: CardSet
  images: {
    small: string
    large: string
  }
  artist: string | null
  flavorText: string | null
  nationalPokedexNumbers: number[]
  legalities: Record<string, string>
  tcgplayer?: TCGPlayerData
}

export interface CardSet {
  id: string
  name: string
  series: string
  printedTotal: number
  total: number
  releaseDate: string
  images: {
    symbol: string
    logo: string
  }
}

// ─── Prix ─────────────────────────────────────────────────────────────────────

export type CardCondition = 'MINT' | 'NEAR_MINT' | 'LIGHTLY_PLAYED' | 'MODERATELY_PLAYED' | 'HEAVILY_PLAYED' | 'DAMAGED'

export interface PricePoint {
  avg: number
  low: number
  high: number
  saleCount?: number
  currency: 'EUR' | 'USD'
  updatedAt: string
}

export interface CardPrices {
  cardId: string
  cardName: string
  // Sources externes (PokeTrace)
  tcgplayer?: Partial<Record<CardCondition, PricePoint>>
  ebay?: Partial<Record<CardCondition, PricePoint>>
  cardmarket?: Partial<Record<CardCondition, PricePoint>>
  // Données gradées (PSA/BGS/CGC)
  graded?: {
    psa?: Record<string, PricePoint>   // clé = grade ex: "10", "9"
    bgs?: Record<string, PricePoint>
    cgc?: Record<string, PricePoint>
  }
  // Base propriétaire (crowdsourcing)
  community?: {
    rachat: PricePoint | null          // Prix de rachat boutiques FR
    revente: PricePoint | null         // Prix de revente particuliers FR
    estimations: number                // Nb d'estimations ayant contribué
    confidence: number                 // Score 0-1
  }
  isMocked: boolean                    // true si PokeTrace non configuré
}

export interface TCGPlayerData {
  url: string
  updatedAt: string
  prices: {
    normal?: { low: number; mid: number; high: number; market: number }
    holofoil?: { low: number; mid: number; high: number; market: number }
    reverseHolofoil?: { low: number; mid: number; high: number; market: number }
  }
}

// ─── Crowdsourcing (Règles métier 1-4) ───────────────────────────────────────

export type EventType =
  // Règle #1 — Collecte passive
  | 'search'
  | 'card_view'
  | 'correction'
  // Règle #2 — Apprentissage = capteur
  | 'quiz_estimation'
  | 'quiz_identification'
  // Règle #3 — Service = collecteur
  | 'collection_add'
  | 'collection_remove'
  | 'inventory_update'
  // Règle #4 — Pro valide
  | 'pro_price_validation'
  | 'pro_buyback_entry'

export interface CrowdsourcingEvent {
  type: EventType
  cardId?: string
  setId?: string
  payload?: Record<string, unknown>
  sessionId: string          // Anonyme, côté client
  userLevel: 'guest' | 'learner' | 'pro'
  timestamp: string
}

// ─── Recherche ────────────────────────────────────────────────────────────────

export interface SearchFilters {
  q?: string
  set?: string
  rarity?: string
  type?: string
  supertype?: string
  page?: number
  pageSize?: number
}

export interface SearchResult {
  cards: PokemonCard[]
  totalCount: number
  page: number
  pageSize: number
  hasMore: boolean
}
