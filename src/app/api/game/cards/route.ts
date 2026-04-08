import { NextResponse } from 'next/server'
import { searchCards } from '@/lib/api/pokemon-tcg'

// Extensions avec bonnes données de prix — cartes francophones disponibles
const SETS_WITH_PRICES = [
  'sv3pt5', // 151
  'sv3',    // Obsidian Flames
  'sv4pt5', // Paldean Fates
  'sv4',    // Paradox Rift
  'sv5',    // Temporal Forces
  'swsh12pt5', // Crown Zenith
  'swsh9',  // Brilliant Stars
  'swsh10', // Astral Radiance
]

const RARITIES_WITH_PRICES = [
  'Common',
  'Uncommon',
  'Rare',
  'Rare Holo',
  'Double Rare',
  'Ultra Rare',
  'Illustration Rare',
  'Special Illustration Rare',
  'Hyper Rare',
]

export async function GET() {
  try {
    // On tire un set aléatoire parmi ceux qui ont des prix
    const randomSet = SETS_WITH_PRICES[Math.floor(Math.random() * SETS_WITH_PRICES.length)]

    const result = await searchCards({
      set: randomSet,
      pageSize: 100,
      page: 1,
    })

    // Filtrer uniquement les cartes avec prix TCGPlayer ou Cardmarket
    const cardsWithPrices = result.cards.filter(card => {
      const hasTcg = !!(card.tcgplayer?.prices?.holofoil?.market ||
                        card.tcgplayer?.prices?.normal?.market)
      const hasCm = !!(card.cardmarket?.prices?.averageSellPrice)
      return hasTcg || hasCm
    })

    if (cardsWithPrices.length < 10) {
      // Fallback sur sv3pt5 qui a toujours des prix
      const fallback = await searchCards({ set: 'sv3pt5', pageSize: 100, page: 1 })
      const fallbackWithPrices = fallback.cards.filter(c =>
        c.tcgplayer?.prices?.holofoil?.market || c.cardmarket?.prices?.averageSellPrice
      )
      const shuffled = fallbackWithPrices.sort(() => Math.random() - 0.5).slice(0, 10)
      return NextResponse.json({ cards: shuffled })
    }

    // Mélange et prend 10 cartes
    const shuffled = cardsWithPrices.sort(() => Math.random() - 0.5).slice(0, 10)

    return NextResponse.json({ cards: shuffled })
  } catch (err) {
    console.error('[GAME CARDS]', err)
    return NextResponse.json({ error: 'Failed to load game cards' }, { status: 500 })
  }
}
