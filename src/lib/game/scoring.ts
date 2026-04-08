import type { PokemonCard } from '@/types'

export interface CardRealPrice {
  eur: number | null
  usd: number | null
  display: number   // Prix principal affiché (EUR si dispo, sinon USD converti)
  currency: 'EUR' | 'USD'
  source: 'cardmarket' | 'tcgplayer'
}

export function getRealPrice(card: PokemonCard): CardRealPrice {
  const cmPrice = card.cardmarket?.prices?.averageSellPrice ?? null
  const tcgPrice =
    card.tcgplayer?.prices?.holofoil?.market ??
    card.tcgplayer?.prices?.normal?.market ??
    null

  // Priorité : Cardmarket EUR (marché français)
  if (cmPrice && cmPrice > 0) {
    return {
      eur: cmPrice,
      usd: tcgPrice,
      display: cmPrice,
      currency: 'EUR',
      source: 'cardmarket',
    }
  }

  // Fallback : TCGPlayer USD → conversion approximative EUR (x0.92)
  if (tcgPrice && tcgPrice > 0) {
    const eurApprox = parseFloat((tcgPrice * 0.92).toFixed(2))
    return {
      eur: eurApprox,
      usd: tcgPrice,
      display: eurApprox,
      currency: 'EUR',
      source: 'tcgplayer',
    }
  }

  return { eur: null, usd: null, display: 0, currency: 'EUR', source: 'cardmarket' }
}

// Calcule le score d'une estimation (0-100)
export function calcScore(estimated: number, real: number): number {
  if (real === 0) return 0
  const diff = Math.abs(estimated - real) / real
  if (diff <= 0.05) return 100  // ±5% → parfait
  if (diff <= 0.10) return 90   // ±10%
  if (diff <= 0.20) return 75   // ±20%
  if (diff <= 0.35) return 55   // ±35%
  if (diff <= 0.50) return 35   // ±50%
  if (diff <= 0.75) return 15   // ±75%
  return 5                       // > ±75%
}

export function scoreLabel(score: number): { label: string; color: string } {
  if (score >= 90) return { label: 'Parfait !', color: '#22c55e' }
  if (score >= 75) return { label: 'Excellent', color: '#84cc16' }
  if (score >= 55) return { label: 'Bien joué', color: '#eab308' }
  if (score >= 35) return { label: 'Pas mal', color: '#f97316' }
  return { label: 'À revoir', color: '#ef4444' }
}

// Prix de départ suggéré pour le slider (proche du vrai prix mais pas exact)
export function getStartPrice(realPrice: number): number {
  if (realPrice <= 0) return 1
  // On part d'un prix légèrement aléatoire autour du vrai prix
  const variance = realPrice * 0.4
  const min = Math.max(0.5, realPrice - variance)
  const max = realPrice + variance
  const raw = min + Math.random() * (max - min)
  // Arrondi au 0.50€ le plus proche
  return Math.round(raw * 2) / 2
}
