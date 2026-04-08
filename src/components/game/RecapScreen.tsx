'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import type { PokemonCard } from '@/types'
import { scoreLabel } from '@/lib/game/scoring'

export interface GameResult {
  card: PokemonCard
  estimated: number
  real: number
  score: number
}

interface RecapScreenProps {
  results: GameResult[]
  onPlayAgain: () => void
}

function formatPrice(p: number) {
  return p.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €'
}

export function RecapScreen({ results, onPlayAgain }: RecapScreenProps) {
  const totalScore = results.reduce((s, r) => s + r.score, 0)
  const maxScore = results.length * 100
  const pct = Math.round((totalScore / maxScore) * 100)
  const { label, color } = scoreLabel(pct)

  return (
    <div className="min-h-screen bg-surface pb-28">

      {/* Header sticky */}
      <div className="sticky top-0 z-20 bg-surface/95 backdrop-blur-sm border-b border-ink/8">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link
            href="/"
            className="w-9 h-9 rounded-full border border-ink/15 flex items-center justify-center text-ink/60 hover:text-ink hover:border-ink/30 transition shrink-0"
          >
            <ChevronLeft size={18} />
          </Link>
          <div className="flex-1">
            <h1 className="font-display font-bold text-base leading-tight">Récapitulatif estimations</h1>
            <p className="text-xs text-ink/45">Bravo ! Voici les cartes que tu as estimées aujourd&apos;hui !</p>
          </div>
          {/* Score global */}
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm text-white shrink-0"
            style={{ background: color }}
          >
            {pct}%
          </div>
        </div>
      </div>

      {/* Score détaillé */}
      <div className="max-w-7xl mx-auto px-4 mt-4 mb-4">
        <div className="p-4 rounded-2xl border border-ink/10 bg-white flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl text-white shrink-0"
            style={{ background: color }}
          >
            {pct}%
          </div>
          <div>
            <p className="font-display font-bold text-lg">{label}</p>
            <p className="text-sm text-ink/50">{totalScore} pts sur {maxScore} possibles</p>
          </div>
        </div>
      </div>

      {/* Grille cartes : 2 mobile → 4 tablette → 6 desktop */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {results.map(({ card, estimated, real, score }) => {
            const { color: sc } = scoreLabel(score)
            const diff = estimated - real
            const diffStr = (diff >= 0 ? '+' : '') + diff.toFixed(2) + '€'

            return (
              <div key={card.id} className="bg-white rounded-2xl border border-ink/8 overflow-hidden">
                {/* Image */}
                <div className="relative aspect-[3/4]">
                  <Image src={card.images.small} alt={card.name} fill className="object-contain p-2" />
                  {/* Badge score */}
                  <div
                    className="absolute bottom-2 right-2 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg"
                    style={{ background: sc }}
                  >
                    {score}
                  </div>
                  {/* Icônes favori + partage */}
                  <div className="absolute top-2 right-2 flex gap-1">
                    <button className="w-7 h-7 rounded-full bg-black/40 flex items-center justify-center text-white text-xs hover:bg-black/60 transition">♥</button>
                    <button className="w-7 h-7 rounded-full bg-black/40 flex items-center justify-center text-white text-xs hover:bg-black/60 transition">↗</button>
                  </div>
                </div>

                {/* Infos */}
                <div className="p-2.5">
                  <p className="font-display font-semibold text-xs leading-tight truncate">{card.name}</p>
                  <p className="text-xs text-ink/40 truncate">{card.set?.name} · #{card.number}</p>
                  <div className="mt-2 space-y-0.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-ink/50 font-bold">Ton estimation</span>
                      <span className="font-mono font-medium">{formatPrice(estimated)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-ink/50">Prix réel</span>
                      <span className="font-mono font-medium text-card-gold">{formatPrice(real)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-ink/50">Écart</span>
                      <span className={`font-mono font-medium ${diff > 0 ? 'text-red-500' : diff < 0 ? 'text-blue-500' : 'text-green-500'}`}>
                        {diffStr}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* CTA bas */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-surface/95 backdrop-blur-sm border-t border-ink/8 flex gap-3 max-w-7xl mx-auto">
        <button
          onClick={onPlayAgain}
          className="flex-1 py-3.5 rounded-xl bg-ink text-white font-medium text-sm hover:bg-ink/85 transition"
        >
          Rejouer
        </button>
        <Link
          href="/auth/register"
          className="flex-1 py-3.5 rounded-xl border-2 text-center font-medium text-sm transition"
          style={{ borderColor: '#C9A84C', color: '#C9A84C' }}
        >
          Créer un compte
        </Link>
      </div>
    </div>
  )
}
