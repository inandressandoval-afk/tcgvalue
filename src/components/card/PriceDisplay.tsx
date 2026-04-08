'use client'

import type { CardPrices, PricePoint, CardCondition } from '@/types'
import clsx from 'clsx'

const CONDITIONS: { key: CardCondition; label: string; short: string }[] = [
  { key: 'NEAR_MINT',         label: 'Near Mint',          short: 'NM' },
  { key: 'LIGHTLY_PLAYED',    label: 'Lightly Played',     short: 'LP' },
  { key: 'MODERATELY_PLAYED', label: 'Moderately Played',  short: 'MP' },
  { key: 'HEAVILY_PLAYED',    label: 'Heavily Played',     short: 'HP' },
]

function formatPrice(price: number, currency: 'EUR' | 'USD'): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price)
}

function PriceRow({ label, point, currency }: {
  label: string
  point: PricePoint | undefined
  currency: 'EUR' | 'USD'
}) {
  if (!point) return null
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-ink/5 last:border-0">
      <span className="text-sm text-ink/60">{label}</span>
      <div className="text-right">
        <span className="price-tag font-medium text-sm">
          {formatPrice(point.avg, currency)}
        </span>
        {point.saleCount && (
          <span className="text-xs text-ink/40 ml-2">({point.saleCount} ventes)</span>
        )}
      </div>
    </div>
  )
}

function SourceBlock({
  title,
  flag,
  currency,
  prices,
}: {
  title: string
  flag: string
  currency: 'EUR' | 'USD'
  prices: Partial<Record<CardCondition, PricePoint>> | undefined
}) {
  if (!prices) return null
  const hasData = CONDITIONS.some(c => prices[c.key])
  if (!hasData) return null

  return (
    <div className="bg-white rounded-xl border border-ink/8 p-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-base">{flag}</span>
        <span className="font-medium text-sm">{title}</span>
        <span className="text-xs text-ink/40 font-mono ml-auto">{currency}</span>
      </div>
      {CONDITIONS.map(({ key, short }) =>
        prices[key] ? (
          <PriceRow key={key} label={short} point={prices[key]} currency={currency} />
        ) : null
      )}
    </div>
  )
}

interface PriceDisplayProps {
  prices: CardPrices
}

export function PriceDisplay({ prices }: PriceDisplayProps) {
  const hasGraded = prices.graded?.psa || prices.graded?.bgs || prices.graded?.cgc
  const hasCommunity = prices.community?.rachat || prices.community?.revente

  return (
    <div className="space-y-3">
      {/* Badge mock */}
      {prices.isMocked && (
        <div className="flex items-center gap-2">
          <span className="mock-badge">PRIX SIMULÉS</span>
          <span className="text-xs text-ink/50">
            Configurez votre clé PokeTrace pour les prix réels
          </span>
        </div>
      )}

      {/* Sources de marché */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <SourceBlock
          title="Cardmarket"
          flag="🇪🇺"
          currency="EUR"
          prices={prices.cardmarket}
        />
        <SourceBlock
          title="TCGPlayer"
          flag="🇺🇸"
          currency="USD"
          prices={prices.tcgplayer}
        />
        <SourceBlock
          title="eBay"
          flag="🌍"
          currency="USD"
          prices={prices.ebay}
        />
      </div>

      {/* Prix gradés */}
      {hasGraded && (
        <div className="bg-white rounded-xl border border-ink/8 p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-base">🏆</span>
            <span className="font-medium text-sm">Cartes gradées (PSA)</span>
            <span className="text-xs text-ink/40 font-mono ml-auto">USD</span>
          </div>
          {Object.entries(prices.graded?.psa ?? {}).map(([grade, point]) => (
            <PriceRow
              key={grade}
              label={`PSA ${grade}`}
              point={point}
              currency="USD"
            />
          ))}
        </div>
      )}

      {/* Prix communautaires — Règle #3 */}
      {hasCommunity && (
        <div className="bg-gradient-to-br from-card-gold/5 to-card-rare/5 rounded-xl border border-card-gold/20 p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-base">🤝</span>
            <span className="font-medium text-sm">Prix marché FR (communauté)</span>
            {prices.community?.confidence !== undefined && (
              <div className={clsx(
                'ml-auto text-xs px-2 py-0.5 rounded-full',
                prices.community.confidence > 0.6
                  ? 'bg-green-100 text-green-700'
                  : prices.community.confidence > 0.3
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-gray-100 text-gray-500',
              )}>
                {prices.community.estimations} estimations
              </div>
            )}
          </div>
          {prices.community?.rachat && (
            <PriceRow
              label="Rachat boutique"
              point={prices.community.rachat}
              currency="EUR"
            />
          )}
          {prices.community?.revente && (
            <PriceRow
              label="Revente particulier"
              point={prices.community.revente}
              currency="EUR"
            />
          )}
        </div>
      )}
    </div>
  )
}
