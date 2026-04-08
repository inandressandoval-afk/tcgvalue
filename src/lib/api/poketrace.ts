import type { CardPrices, PricePoint } from '@/types'

/**
 * Récupère les prix d'une carte.
 * Priorité : données PokéTCG (tcgplayer + cardmarket intégrés) → PokeTrace API → mock
 */

function toPricePoint(
  data: { low?: number; mid?: number; high?: number; market?: number } | undefined,
  currency: 'EUR' | 'USD',
): PricePoint | null {
  if (!data?.market && !data?.mid) return null
  const avg = data.market ?? data.mid ?? 0
  return {
    avg: parseFloat(avg.toFixed(2)),
    low: parseFloat((data.low ?? avg * 0.85).toFixed(2)),
    high: parseFloat((data.high ?? avg * 1.3).toFixed(2)),
    currency,
    updatedAt: new Date().toISOString(),
  }
}

function fromCardmarketPrices(
  cm: { averageSellPrice?: number; lowPrice?: number; trendPrice?: number } | undefined,
  currency: 'EUR' = 'EUR',
): PricePoint | null {
  if (!cm?.averageSellPrice && !cm?.trendPrice) return null
  const avg = cm.averageSellPrice ?? cm.trendPrice ?? 0
  return {
    avg: parseFloat(avg.toFixed(2)),
    low: parseFloat((cm.lowPrice ?? avg * 0.7).toFixed(2)),
    high: parseFloat((avg * 1.3).toFixed(2)),
    currency,
    updatedAt: new Date().toISOString(),
  }
}

// ─── Prix depuis les données PokéTCG (tcgplayer + cardmarket inclus) ─────────

export function getPricesFromCard(card: {
  id: string
  name: string
  rarity?: string | null
  tcgplayer?: {
    prices?: {
      normal?: { low?: number; mid?: number; high?: number; market?: number }
      holofoil?: { low?: number; mid?: number; high?: number; market?: number }
      reverseHolofoil?: { low?: number; mid?: number; high?: number; market?: number }
    }
  }
  cardmarket?: {
    prices?: {
      averageSellPrice?: number
      lowPrice?: number
      trendPrice?: number
    }
  }
}): CardPrices {
  const tcgPrices = card.tcgplayer?.prices
  const cmPrices = card.cardmarket?.prices

  // TCGPlayer — prend holofoil en priorité, sinon normal
  const tcgPoint =
    toPricePoint(tcgPrices?.holofoil, 'USD') ??
    toPricePoint(tcgPrices?.normal, 'USD') ??
    null

  // Cardmarket
  const cmPoint = fromCardmarketPrices(cmPrices, 'EUR')

  const hasTcg = !!tcgPoint
  const hasCm = !!cmPoint
  const isMocked = !hasTcg && !hasCm

  // Prix communauté simulés basés sur le vrai prix
  const basePrice = cmPoint?.avg ?? (tcgPoint ? tcgPoint.avg * 0.92 : null)
  const community = basePrice
    ? {
        rachat: {
          avg: parseFloat((basePrice * 0.45).toFixed(2)),
          low: parseFloat((basePrice * 0.35).toFixed(2)),
          high: parseFloat((basePrice * 0.55).toFixed(2)),
          currency: 'EUR' as const,
          updatedAt: new Date().toISOString(),
        },
        revente: {
          avg: parseFloat((basePrice * 0.85).toFixed(2)),
          low: parseFloat((basePrice * 0.75).toFixed(2)),
          high: parseFloat((basePrice * 0.95).toFixed(2)),
          currency: 'EUR' as const,
          updatedAt: new Date().toISOString(),
        },
        estimations: Math.floor(Math.random() * 20) + 3,
        confidence: 0.4,
      }
    : null

  return {
    cardId: card.id,
    cardName: card.name,
    tcgplayer: tcgPoint ? { NEAR_MINT: tcgPoint } : undefined,
    cardmarket: cmPoint ? { NEAR_MINT: cmPoint } : undefined,
    ebay: tcgPoint
      ? {
          NEAR_MINT: {
            ...tcgPoint,
            avg: parseFloat((tcgPoint.avg * 1.15).toFixed(2)),
          },
        }
      : undefined,
    community,
    isMocked,
  }
}

// ─── API PokeTrace (si clé configurée) ───────────────────────────────────────

export async function getCardPrices(
  cardId: string,
  cardName: string,
  rarity: string | null,
  cardData?: Parameters<typeof getPricesFromCard>[0],
): Promise<CardPrices> {
  // Priorité 1 : données déjà dans la carte PokéTCG
  if (cardData?.tcgplayer?.prices || cardData?.cardmarket?.prices) {
    return getPricesFromCard(cardData)
  }

  // Priorité 2 : API PokeTrace
  if (process.env.POKETRACE_API_KEY) {
    try {
      const res = await fetch(
        `https://api.poketrace.com/v1/cards?search=${encodeURIComponent(cardName)}&market=EU`,
        {
          headers: {
            'X-API-Key': process.env.POKETRACE_API_KEY,
            'Content-Type': 'application/json',
          },
          next: { revalidate: 900 },
        }
      )
      if (res.ok) {
        const data = await res.json()
        const card = data.data?.[0]
        if (card) {
          return {
            cardId,
            cardName,
            tcgplayer: card.prices?.tcgplayer,
            ebay: card.prices?.ebay,
            cardmarket: card.prices?.cardmarket,
            graded: card.graded,
            community: null,
            isMocked: false,
          }
        }
      }
    } catch {
      // Fallback silencieux
    }
  }

  // Priorité 3 : mock basé sur la rareté
  return getMockedPrices(cardId, rarity, cardName)
}

function getMockedPrices(cardId: string, rarity: string | null, cardName: string): CardPrices {
  const seed = cardId.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
  const baseMultiplier = (seed % 100) / 100
  const r = (rarity ?? '').toLowerCase()

  let basePrice = 0.5
  if (r.includes('special illustration')) basePrice = 20 + baseMultiplier * 80
  else if (r.includes('illustration rare')) basePrice = 10 + baseMultiplier * 40
  else if (r.includes('hyper rare')) basePrice = 15 + baseMultiplier * 60
  else if (r.includes('ultra rare') || r.includes('full art')) basePrice = 8 + baseMultiplier * 40
  else if (r.includes('vmax') || r.includes('vstar')) basePrice = 3 + baseMultiplier * 15
  else if (r.includes('rare holo')) basePrice = 1.5 + baseMultiplier * 8
  else if (r.includes('rare')) basePrice = 0.8 + baseMultiplier * 4
  else if (r.includes('uncommon')) basePrice = 0.2 + baseMultiplier * 0.8
  else basePrice = 0.05 + baseMultiplier * 0.3

  const mk = (price: number, currency: 'EUR' | 'USD'): PricePoint => ({
    avg: parseFloat(price.toFixed(2)),
    low: parseFloat((price * 0.8).toFixed(2)),
    high: parseFloat((price * 1.3).toFixed(2)),
    currency,
    updatedAt: new Date().toISOString(),
  })

  return {
    cardId,
    cardName,
    cardmarket: { NEAR_MINT: mk(basePrice, 'EUR'), LIGHTLY_PLAYED: mk(basePrice * 0.75, 'EUR') },
    tcgplayer: { NEAR_MINT: mk(basePrice * 1.1, 'USD') },
    ebay: { NEAR_MINT: mk(basePrice * 1.2, 'USD') },
    community: {
      rachat: mk(basePrice * 0.45, 'EUR'),
      revente: mk(basePrice * 0.85, 'EUR'),
      estimations: Math.floor(seed % 20) + 2,
      confidence: 0.2,
    },
    isMocked: true,
  }
}
