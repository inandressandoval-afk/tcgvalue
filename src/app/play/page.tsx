import { Suspense } from 'react'
import { GameEngine } from '@/components/game/GameEngine'

export const metadata = {
  title: 'Estimer — TCGValue',
  description: 'Teste ton œil pour l\'estimation de cartes Pokémon !',
}

export default function PlayPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-ink">
        <div className="w-12 h-12 rounded-full border-4 border-card-gold/30 border-t-card-gold animate-spin" />
      </div>
    }>
      <GameEngine />
    </Suspense>
  )
}
