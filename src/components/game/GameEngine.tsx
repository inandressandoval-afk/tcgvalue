'use client'

import { useState, useEffect } from 'react'
import type { PokemonCard } from '@/types'
import { GameCard } from './GameCard'
import { RecapScreen, type GameResult } from './RecapScreen'

type GameState = 'loading' | 'playing' | 'recap' | 'error'

export function GameEngine() {
  const [state, setState] = useState<GameState>('loading')
  const [cards, setCards] = useState<PokemonCard[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [results, setResults] = useState<GameResult[]>([])

  const loadCards = async () => {
    setState('loading')
    setResults([])
    setCurrentIndex(0)
    try {
      const res = await fetch('/api/game/cards')
      if (!res.ok) throw new Error('Failed')
      const data = await res.json()
      setCards(data.cards)
      setState('playing')
    } catch {
      setState('error')
    }
  }

  useEffect(() => { loadCards() }, [])

  const handleNext = (result: GameResult) => {
    const newResults = [...results, result]
    setResults(newResults)

    if (currentIndex + 1 >= cards.length) {
      setState('recap')
    } else {
      setCurrentIndex(i => i + 1)
    }
  }

  if (state === 'loading') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-ink gap-4">
        <div className="w-16 h-16 rounded-full border-4 border-card-gold/30 border-t-card-gold animate-spin" />
        <p className="text-white/60 text-sm">Chargement des cartes…</p>
      </div>
    )
  }

  if (state === 'error') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-8 text-center">
        <p className="text-ink/60">Impossible de charger les cartes.</p>
        <button
          onClick={loadCards}
          className="px-6 py-3 rounded-xl bg-ink text-white text-sm"
        >
          Réessayer
        </button>
      </div>
    )
  }

  if (state === 'recap') {
    return <RecapScreen results={results} onPlayAgain={loadCards} />
  }

  const currentCard = cards[currentIndex]
  if (!currentCard) return null

  return (
    <GameCard
      key={currentCard.id}
      card={currentCard}
      cardIndex={currentIndex}
      totalCards={cards.length}
      onNext={handleNext}
    />
  )
}
