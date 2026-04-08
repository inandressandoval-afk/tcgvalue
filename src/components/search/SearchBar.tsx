'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import clsx from 'clsx'

const RARITIES = [
  'Common', 'Uncommon', 'Rare', 'Rare Holo',
  'Rare Ultra', 'Illustration Rare', 'Special Illustration Rare',
  'Hyper Rare', 'Rare Secret',
]

const TYPES = [
  'Colorless', 'Darkness', 'Dragon', 'Fairy', 'Fighting',
  'Fire', 'Grass', 'Lightning', 'Metal', 'Psychic', 'Water',
]

interface SearchBarProps {
  initialQuery?: string
}

export function SearchBar({ initialQuery = '' }: SearchBarProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [query, setQuery] = useState(initialQuery)
  const [rarity, setRarity] = useState('')
  const [type, setType] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  function handleSearch(q?: string) {
    const searchQuery = (q ?? query).trim()
    const params = new URLSearchParams()
    if (searchQuery) params.set('q', searchQuery)
    if (rarity) params.set('rarity', rarity)
    if (type) params.set('type', type)
    params.set('page', '1')
    startTransition(() => {
      router.push(`/search?${params.toString()}`)
    })
  }

  const hasFilters = rarity || type

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder="Rechercher une carte… ex: Charizard, Pikachu ex"
            className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-ink/15 bg-white text-ink placeholder:text-ink/35 font-body text-sm focus:outline-none focus:ring-2 focus:ring-card-gold/40 focus:border-card-gold/60 transition"
          />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/30 hover:text-ink/60 transition">
              <X size={16} />
            </button>
          )}
        </div>

        <button
          onClick={() => setShowFilters(v => !v)}
          className={clsx(
            'p-3.5 rounded-xl border transition flex items-center gap-1.5 text-sm',
            showFilters || hasFilters
              ? 'border-card-gold/60 bg-card-gold/10 text-card-gold'
              : 'border-ink/15 bg-white text-ink/50 hover:border-ink/30',
          )}
        >
          <SlidersHorizontal size={18} />
          {hasFilters && <span className="w-2 h-2 rounded-full bg-card-gold" />}
        </button>

        <button
          onClick={() => handleSearch()}
          disabled={isPending}
          className="px-5 py-3.5 rounded-xl bg-ink text-white text-sm font-medium hover:bg-ink/85 disabled:opacity-50 transition"
        >
          {isPending ? '…' : 'Chercher'}
        </button>
      </div>

      {showFilters && (
        <div className="mt-3 p-4 bg-white rounded-xl border border-ink/10 grid grid-cols-2 gap-4 animate-fade-up">
          <div>
            <label className="text-xs font-medium text-ink/50 mb-1.5 block uppercase tracking-wide">Rareté</label>
            <select value={rarity} onChange={e => setRarity(e.target.value)} className="w-full text-sm py-2 px-3 rounded-lg border border-ink/15 bg-surface focus:outline-none focus:ring-2 focus:ring-card-gold/30">
              <option value="">Toutes</option>
              {RARITIES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-ink/50 mb-1.5 block uppercase tracking-wide">Type</label>
            <select value={type} onChange={e => setType(e.target.value)} className="w-full text-sm py-2 px-3 rounded-lg border border-ink/15 bg-surface focus:outline-none focus:ring-2 focus:ring-card-gold/30">
              <option value="">Tous</option>
              {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>
      )}
    </div>
  )
}
