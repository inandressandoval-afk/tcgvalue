import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { RarityBadge } from '@/components/card/RarityBadge'
import { PriceDisplay } from '@/components/card/PriceDisplay'
import { CardTracker } from '@/components/card/CardTracker'
import { getCard } from '@/lib/api/pokemon-tcg'
import { getCardPrices } from '@/lib/api/poketrace'

interface CardPageProps {
  params: { id: string }
}

export default async function CardPage({ params }: CardPageProps) {
  const [card, prices] = await Promise.all([
    getCard(params.id).catch(() => null),
    getCardPrices(params.id, '', null).catch(() => null),
  ])

  if (!card) return notFound()

  // Met à jour le nom dans les prix
  if (prices) {
    prices.cardName = card.name
  }

  const types = card.types?.join(' / ') ?? '—'

  return (
    <div className="min-h-screen">
      <Header />

      <main className="max-w-5xl mx-auto px-4 py-8">

        {/* Retour */}
        <Link
          href="/search"
          className="inline-flex items-center gap-1.5 text-sm text-ink/50 hover:text-ink transition mb-6"
        >
          <ArrowLeft size={15} />
          Retour aux résultats
        </Link>

        <div className="grid md:grid-cols-[300px_1fr] gap-8 lg:gap-12">

          {/* Colonne gauche — carte */}
          <div>
            <div className="sticky top-20">
              {/* Image grande */}
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-xl shadow-ink/10 bg-surface">
                <Image
                  src={card.images.large}
                  alt={card.name}
                  fill
                  sizes="(max-width: 768px) 90vw, 300px"
                  className="object-contain p-4"
                  priority
                />
              </div>

              {/* Métadonnées carte */}
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center justify-between py-2 border-b border-ink/6">
                  <span className="text-ink/45">Extension</span>
                  <span className="font-medium">{card.set.name}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-ink/6">
                  <span className="text-ink/45">Numéro</span>
                  <span className="font-mono text-sm">{card.number}/{card.set.printedTotal}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-ink/6">
                  <span className="text-ink/45">Type(s)</span>
                  <span className="font-medium">{types}</span>
                </div>
                {card.artist && (
                  <div className="flex items-center justify-between py-2 border-b border-ink/6">
                    <span className="text-ink/45">Illustrateur</span>
                    <span className="font-medium">{card.artist}</span>
                  </div>
                )}
                <div className="flex items-center justify-between py-2">
                  <span className="text-ink/45">Sortie</span>
                  <span className="font-medium">{card.set.releaseDate}</span>
                </div>
              </div>

              {/* Lien TCGPlayer */}
              {card.tcgplayer?.url && (
                <a
                  href={card.tcgplayer.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-ink/15 text-sm text-ink/60 hover:text-ink hover:border-ink/30 transition"
                >
                  Voir sur TCGPlayer
                  <ExternalLink size={13} />
                </a>
              )}
            </div>
          </div>

          {/* Colonne droite — infos + prix */}
          <div className="space-y-6">

            {/* En-tête */}
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <h1 className="font-display text-3xl font-bold leading-tight">
                  {card.name}
                </h1>
                <RarityBadge rarity={card.rarity} />
              </div>
              <p className="text-ink/50 text-sm">
                {card.supertype}
                {card.subtypes?.length > 0 && ` · ${card.subtypes.join(', ')}`}
                {card.hp && ` · ${card.hp} PV`}
              </p>
            </div>

            {/* Flavor text */}
            {card.flavorText && (
              <blockquote className="border-l-2 border-card-gold/40 pl-4 text-sm text-ink/50 italic">
                {card.flavorText}
              </blockquote>
            )}

            {/* Section prix */}
            <section>
              <h2 className="font-display font-semibold text-lg mb-3 flex items-center gap-2">
                Cotations du marché
                <span className="text-xs font-body font-normal text-ink/35 non-italic">
                  Mis à jour régulièrement
                </span>
              </h2>

              {prices ? (
                <PriceDisplay prices={prices} />
              ) : (
                <div className="p-6 bg-white rounded-xl border border-ink/8 text-center text-sm text-ink/40">
                  Prix temporairement indisponibles
                </div>
              )}
            </section>

            {/* Tracking crowdsourcing côté client */}
            <CardTracker cardId={card.id} setId={card.set.id} />

          </div>
        </div>
      </main>
    </div>
  )
}
