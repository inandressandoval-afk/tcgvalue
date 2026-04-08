'use client'

import { useEffect, useRef } from 'react'
import { passive } from '@/lib/crowdsourcing/tracker'

interface CardTrackerProps {
  cardId: string
  setId: string
}

/**
 * Règle #1 — Collecte passive
 * Composant invisible qui enregistre la consultation d'une carte.
 * Mesure aussi la durée de consultation (signal d'intérêt).
 */
export function CardTracker({ cardId, setId }: CardTrackerProps) {
  const startTime = useRef(Date.now())

  useEffect(() => {
    // Fire immédiatement à l'ouverture
    passive.cardView(cardId, setId)

    // Fire à la fermeture avec la durée
    return () => {
      const duration = Date.now() - startTime.current
      if (duration > 2000) { // Ignore les rebonds < 2s
        passive.cardView(cardId, setId, duration)
      }
    }
  }, [cardId, setId])

  // Rien à afficher — composant fantôme
  return null
}
