'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import type { PokemonCard } from '@/types'
import { getRealPrice, getStartPrice, calcScore } from '@/lib/game/scoring'
import { learning } from '@/lib/crowdsourcing/tracker'

const TIMER_SECONDS = 20
const INCREMENT = 0.5

interface GameCardProps {
  card: PokemonCard
  cardIndex: number
  totalCards: number
  onNext: (result: { card: PokemonCard; estimated: number; real: number; score: number }) => void
}

function TimerWheel({ timeLeft, total, price, onUp, onDown }: {
  timeLeft: number; total: number; price: number
  onUp: () => void; onDown: () => void
}) {
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const progress = (timeLeft / total) * circumference
  const hue = Math.round((timeLeft / total) * 120)

  return (
    <div className="relative flex items-center justify-center select-none">
      <svg width="130" height="130" viewBox="0 0 140 140">
        <circle cx="70" cy="70" r={radius} fill="#1a1a2e" />
        <circle cx="70" cy="70" r={radius} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
        <circle
          cx="70" cy="70" r={radius} fill="none"
          stroke={`hsl(${hue}, 90%, 55%)`} strokeWidth="8" strokeLinecap="round"
          strokeDasharray={`${progress} ${circumference}`}
          transform="rotate(-90 70 70)"
          style={{ transition: 'stroke-dasharray 0.5s linear, stroke 0.5s' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <button onPointerDown={onUp} className="w-8 h-8 flex items-center justify-center text-white/70 hover:text-white active:scale-90 transition-transform" style={{ fontSize: 18 }}>▲</button>
        <div className="text-white font-bold" style={{ fontSize: 20 }}>{price.toFixed(2)}€</div>
        <button onPointerDown={onDown} className="w-8 h-8 flex items-center justify-center text-white/70 hover:text-white active:scale-90 transition-transform" style={{ fontSize: 18 }}>▼</button>
      </div>
    </div>
  )
}

export function GameCard({ card, cardIndex, totalCards, onNext }: GameCardProps) {
  const router = useRouter()
  const realPrice = getRealPrice(card).display
  const [price, setPrice] = useState(() => getStartPrice(realPrice))
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS)
  const [submitted, setSubmitted] = useState(false)
  const touchStartY = useRef<number | null>(null)

  const handleSubmit = useCallback(() => {
    if (submitted) return
    setSubmitted(true)
    const score = calcScore(price, realPrice)
    learning.quizEstimation(card.id, price, 'NEAR_MINT', score >= 55)
    setTimeout(() => onNext({ card, estimated: price, real: realPrice, score }), 600)
  }, [submitted, price, realPrice, card, onNext])

  useEffect(() => {
    if (submitted) return
    if (timeLeft <= 0) { handleSubmit(); return }
    const t = setTimeout(() => setTimeLeft(t => t - 1), 1000)
    return () => clearTimeout(t)
  }, [timeLeft, submitted, handleSubmit])

  const adjustPrice = useCallback((dir: 1 | -1) => {
    setPrice(p => Math.max(0.5, parseFloat((p + dir * INCREMENT).toFixed(2))))
  }, [])

  const handleTouchStart = (e: React.TouchEvent) => { touchStartY.current = e.touches[0].clientY }
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return
    const dy = touchStartY.current - e.changedTouches[0].clientY
    if (Math.abs(dy) > 10) adjustPrice(dy > 0 ? 1 : -1)
    touchStartY.current = null
  }

  return (
    <div
      className="relative w-full h-screen flex flex-col overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Fond flouté */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <Image
          src={card.images.large} alt="" fill priority
          className="object-cover"
          style={{ filter: 'blur(20px) brightness(0.4)', transform: 'scale(1.2)', transformOrigin: 'center center' }}
        />
      </div>

      {/* Gradient bas */}
      <div className="absolute bottom-0 left-0 right-0 z-10 h-80"
        style={{ background: 'linear-gradient(to top, rgba(8,8,18,0.99) 50%, transparent)' }}
      />

      {/* Bouton back */}
      <div className="relative z-20 px-4 pt-5 shrink-0">
        <button
          onClick={() => router.push('/')}
          className="w-9 h-9 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/25 transition"
        >
          <ChevronLeft size={20} />
        </button>
      </div>

      {/* Compteur centré */}
      <div className="relative z-20 flex items-center justify-center gap-3 mt-2 shrink-0">
        <span className="text-white/70 text-sm font-mono">{cardIndex + 1}/{totalCards}</span>
        <div className="w-28 h-1.5 rounded-full bg-white/20 overflow-hidden">
          <div
            className="h-full rounded-full bg-white transition-all duration-300"
            style={{ width: `${((cardIndex + 1) / totalCards) * 100}%` }}
          />
        </div>
      </div>

      {/* Zone centrale — tout groupé, centré verticalement */}
      <div className="relative z-20 flex-1 flex flex-col items-center justify-center gap-3 px-6">

        {/* Carte */}
        <div
          className="relative rounded-2xl overflow-hidden shadow-2xl"
          style={{ width: '100%', maxWidth: 240, aspectRatio: '3/4' }}
        >
          <Image src={card.images.large} alt={card.name} fill className="object-contain" priority />
        </div>

        {/* Infos — directement sous la carte */}
        <div className="flex items-center justify-center gap-3 w-full">
          <div className="text-left">
            <h2 className="text-white font-bold" style={{ fontSize: 20 }}>{card.name}</h2>
            <p className="text-white/50 text-sm">{card.set?.name ?? ''} #{card.number ?? ''}</p>
          </div>
          {card.set?.images?.logo && (
            <div className="relative shrink-0 opacity-90" style={{ width: 80, height: 32 }}>
              <Image src={card.set.images.logo} alt={card.set.name ?? ''} fill className="object-contain" />
            </div>
          )}
        </div>

        {/* Roue + bouton */}
        <div className="flex items-center justify-center gap-4 w-full">
          <TimerWheel
            timeLeft={timeLeft} total={TIMER_SECONDS} price={price}
            onUp={() => adjustPrice(1)} onDown={() => adjustPrice(-1)}
          />
          <button
            onPointerDown={handleSubmit}
            disabled={submitted}
            className="flex-1 max-w-xs py-4 rounded-2xl font-bold text-base transition-all active:scale-95"
            style={{
              background: submitted ? '#333' : 'linear-gradient(135deg, #C9A84C, #F0D080)',
              color: submitted ? '#888' : '#1a1a00',
            }}
          >
            {submitted ? '✓ Validé' : 'Valider mon estimation'}
          </button>
        </div>

      </div>
    </div>
  )
}
