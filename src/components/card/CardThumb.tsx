import Image from 'next/image'
import Link from 'next/link'
import type { PokemonCard } from '@/types'
import { RarityBadge } from './RarityBadge'

interface CardThumbProps {
  card: PokemonCard
  priority?: boolean
}

export function CardThumb({ card, priority = false }: CardThumbProps) {
  return (
    <Link
      href={`/card/${card.id}`}
      className="group block bg-white rounded-2xl border border-ink/8 overflow-hidden card-hover animate-fade-up"
    >
      {/* Image */}
      <div className="relative aspect-[3/4] bg-surface overflow-hidden">
        <Image
          src={card.images.small}
          alt={card.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
          priority={priority}
        />
      </div>

      {/* Infos */}
      <div className="p-3">
        <p className="font-display font-semibold text-sm leading-tight truncate">
          {card.name}
        </p>
        <p className="text-xs text-ink/50 mt-0.5 truncate">
          {card.set.name} · #{card.number}
        </p>
        <div className="mt-2">
          <RarityBadge rarity={card.rarity} size="sm" />
        </div>
      </div>
    </Link>
  )
}
