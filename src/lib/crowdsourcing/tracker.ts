/**
 * MOTEUR DE CROWDSOURCING — 4 RÈGLES MÉTIER
 *
 * Règle #1 — Collecte passive : toute interaction est un signal
 * Règle #2 — Apprentissage = capteur : les quiz génèrent des données de marché
 * Règle #3 — Service = collecteur : l'inventaire produit des données d'offre
 * Règle #4 — Pro valide : les boutiques pondèrent les estimations apprenants
 */

import type { CrowdsourcingEvent, EventType } from '@/types'

// ─── Génération d'un ID de session anonyme ────────────────────────────────────

function getSessionId(): string {
  if (typeof window === 'undefined') return 'server'

  let sessionId = sessionStorage.getItem('tcgv_sid')
  if (!sessionId) {
    sessionId = `s_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
    sessionStorage.setItem('tcgv_sid', sessionId)
  }
  return sessionId
}

function getUserLevel(): CrowdsourcingEvent['userLevel'] {
  if (typeof window === 'undefined') return 'guest'
  // Phase 1 : tous guests. Phase 2 : lire depuis le contexte auth
  return (localStorage.getItem('tcgv_level') as CrowdsourcingEvent['userLevel']) ?? 'guest'
}

// ─── Envoi d'un événement (fire & forget) ────────────────────────────────────

export function trackEvent(
  type: EventType,
  payload?: Record<string, unknown>,
): void {
  const event: CrowdsourcingEvent = {
    type,
    cardId: payload?.cardId as string | undefined,
    setId: payload?.setId as string | undefined,
    payload,
    sessionId: getSessionId(),
    userLevel: getUserLevel(),
    timestamp: new Date().toISOString(),
  }

  // Fire & forget — ne bloque jamais l'UI
  fetch('/api/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event),
    keepalive: true, // survit à la fermeture de page
  }).catch(() => {
    // Silencieux — on ne veut pas polluer la console utilisateur
  })
}

// ─── Helpers sémantiques par règle ───────────────────────────────────────────

/** Règle #1 — Collecte passive */
export const passive = {
  search: (query: string, setId?: string) =>
    trackEvent('search', { query, setId }),

  cardView: (cardId: string, setId: string, durationMs?: number) =>
    trackEvent('card_view', { cardId, setId, durationMs }),

  correction: (cardId: string, field: string, oldValue: unknown, newValue: unknown) =>
    trackEvent('correction', { cardId, field, oldValue, newValue }),
}

/** Règle #2 — Apprentissage = capteur */
export const learning = {
  quizEstimation: (
    cardId: string,
    estimatedPrice: number,
    condition: string,
    isCorrect: boolean,
  ) =>
    trackEvent('quiz_estimation', { cardId, estimatedPrice, condition, isCorrect }),

  quizIdentification: (
    cardId: string,
    wasIdentified: boolean,
    secondsTaken: number,
  ) =>
    trackEvent('quiz_identification', { cardId, wasIdentified, secondsTaken }),
}

/** Règle #3 — Service = collecteur */
export const service = {
  collectionAdd: (cardId: string, condition: string, quantity: number) =>
    trackEvent('collection_add', { cardId, condition, quantity }),

  collectionRemove: (cardId: string, reason?: 'sold' | 'traded' | 'lost') =>
    trackEvent('collection_remove', { cardId, reason }),

  inventoryUpdate: (cardId: string, buyPrice: number, sellPrice: number) =>
    trackEvent('inventory_update', { cardId, buyPrice, sellPrice }),
}

/** Règle #4 — Pro valide */
export const pro = {
  priceValidation: (cardId: string, condition: string, agreedWithMarket: boolean) =>
    trackEvent('pro_price_validation', { cardId, condition, agreedWithMarket }),

  buybackEntry: (
    cardId: string,
    condition: string,
    buybackPrice: number,
    currency: 'EUR' | 'USD',
  ) =>
    trackEvent('pro_buyback_entry', { cardId, condition, buybackPrice, currency }),
}
