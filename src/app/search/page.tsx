import { Suspense } from 'react'
import { Header } from '@/components/layout/Header'
import { SearchBar } from '@/components/search/SearchBar'
import { CardThumb } from '@/components/card/CardThumb'
import { searchCards } from '@/lib/api/pokemon-tcg'
import type { SearchFilters } from '@/types'

interface SearchPageProps {
  searchParams: Promise<{
    q?: string
    set?: string
    rarity?: string
    type?: string
    page?: string
  }>
}

async function SearchResults({ searchParams }: SearchPageProps) {
  const params = await searchParams

  const filters: SearchFilters = {
    q: params.q,
    set: params.set,
    rarity: params.rarity,
    type: params.type,
    page: parseInt(params.page ?? '1'),
    pageSize: 24,
  }

  if (!filters.q && !filters.set && !filters.rarity && !filters.type) {
    return (
      <div className="text-center py-20 text-ink/40">
        <p className="text-lg">Entrez un nom de carte pour commencer</p>
        <p className="text-sm mt-2">Ex : Charizard, Pikachu, Umbreon VMAX…</p>
      </div>
    )
  }

  let result
  try {
    result = await searchCards(filters)
  } catch {
    return (
      <div className="text-center py-20 text-red-500">
        <p>Erreur lors de la recherche. Réessayez.</p>
      </div>
    )
  }

  if (result.cards.length === 0) {
    return (
      <div className="text-center py-20 text-ink/40">
        <p className="text-lg">Aucune carte trouvée</p>
        <p className="text-sm mt-2">Essayez un autre nom ou élargissez les filtres</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-ink/50">
          <span className="font-medium text-ink">{result.totalCount.toLocaleString('fr-FR')}</span> cartes trouvées
          {params.q && (
            <> pour <span className="font-medium text-ink">&quot;{params.q}&quot;</span></>
          )}
        </p>
        <p className="text-xs text-ink/35">Page {result.page}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {result.cards.map((card, i) => (
          <CardThumb key={card.id} card={card} priority={i < 6} />
        ))}
      </div>

      {(result.hasMore || result.page > 1) && (
        <div className="flex justify-center gap-3 mt-10">
          {result.page > 1 && (
            <a
              href={`/search?${new URLSearchParams({
                ...(params.q && { q: params.q }),
                ...(params.set && { set: params.set }),
                ...(params.rarity && { rarity: params.rarity }),
                ...(params.type && { type: params.type }),
                page: String(result.page - 1),
              })}`}
              className="px-5 py-2 rounded-lg border border-ink/15 text-sm hover:border-ink/30 transition"
            >
              ← Précédent
            </a>
          )}
          {result.hasMore && (
            <a
              href={`/search?${new URLSearchParams({
                ...(params.q && { q: params.q }),
                ...(params.set && { set: params.set }),
                ...(params.rarity && { rarity: params.rarity }),
                ...(params.type && { type: params.type }),
                page: String(result.page + 1),
              })}`}
              className="px-5 py-2 rounded-lg bg-ink text-white text-sm hover:bg-ink/85 transition"
            >
              Suivant →
            </a>
          )}
        </div>
      )}
    </div>
  )
}

function SearchSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="rounded-2xl overflow-hidden bg-white border border-ink/8">
          <div className="skeleton aspect-[3/4]" />
          <div className="p-3 space-y-2">
            <div className="skeleton h-4 w-3/4 rounded" />
            <div className="skeleton h-3 w-1/2 rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams
  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Suspense>
            <SearchBar initialQuery={params.q ?? ''} />
          </Suspense>
        </div>
        <Suspense fallback={<SearchSkeleton />}>
          <SearchResults searchParams={Promise.resolve(params)} />
        </Suspense>
      </main>
    </div>
  )
}
