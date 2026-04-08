import Link from 'next/link'
import { Suspense } from 'react'
import { Header } from '@/components/layout/Header'
import { BottomNav } from '@/components/layout/BottomNav'
import { SearchBar } from '@/components/search/SearchBar'

const FEATURED_CARDS = [
  { id: 'sv3pt5-6',    name: 'Charizard ex',       set: '151',             num: '6',   img: 'https://images.pokemontcg.io/sv3pt5/6.png' },
  { id: 'sv3pt5-183',  name: 'Charizard ex',       set: '151',             num: '183', img: 'https://images.pokemontcg.io/sv3pt5/183.png' },
  { id: 'sv3pt5-199',  name: 'Charizard ex',       set: '151',             num: '199', img: 'https://images.pokemontcg.io/sv3pt5/199.png' },
  { id: 'sv3-125',     name: 'Charizard ex',       set: 'Obsidian Flames', num: '125', img: 'https://images.pokemontcg.io/sv3/125.png' },
  { id: 'sv3-223',     name: 'Charizard ex',       set: 'Obsidian Flames', num: '223', img: 'https://images.pokemontcg.io/sv3/223.png' },
  { id: 'sv4pt5-54',   name: 'Charizard ex',       set: 'Paldean Fates',   num: '54',  img: 'https://images.pokemontcg.io/sv4pt5/54.png' },
  { id: 'sv4pt5-234',  name: 'Charizard ex',       set: 'Paldean Fates',   num: '234', img: 'https://images.pokemontcg.io/sv4pt5/234.png' },
  { id: 'sv3-228',     name: 'Charizard ex',       set: 'Obsidian Flames', num: '228', img: 'https://images.pokemontcg.io/sv3/228.png' },
  { id: 'sv3-215',     name: 'Charizard ex',       set: 'Obsidian Flames', num: '215', img: 'https://images.pokemontcg.io/sv3/215.png' },
  { id: 'swsh12pt5-20',name: 'Radiant Charizard',  set: 'Crown Zenith',    num: '20',  img: 'https://images.pokemontcg.io/swsh12pt5/20.png' },
  { id: 'swsh12pt5-19',name: 'Charizard VSTAR',    set: 'Crown Zenith',    num: '19',  img: 'https://images.pokemontcg.io/swsh12pt5/19.png' },
  { id: 'swsh12pt5-18',name: 'Charizard V',        set: 'Crown Zenith',    num: '18',  img: 'https://images.pokemontcg.io/swsh12pt5/18.png' },
]

export default function HomePage() {
  return (
    <div className="min-h-screen pb-24">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden bg-ink text-white px-5 pt-10 pb-12">
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage: 'url(https://images.pokemontcg.io/sv3pt5/199_hires.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(10px) saturate(1.5)',
            transform: 'scale(1.1)',
          }}
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(10,10,30,0.75), rgba(10,10,30,0.96))' }} />

        <div className="relative z-10 max-w-2xl mx-auto text-center">
          <p className="text-xs font-medium text-card-gold uppercase tracking-widest mb-3">
            Estimation de cartes Pokémon
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold leading-tight mb-4">
            Tu cherches une carte<br />en particulier ?
          </h1>

          {/* CTA → /estimate (à brancher plus tard) */}
          <Link
            href="/estimate"
            className="inline-flex items-center mb-6 px-5 py-2.5 rounded-xl border border-card-gold/40 text-card-gold text-sm font-medium hover:bg-card-gold/10 transition"
          >
            Estime tes cartes ici →
          </Link>

          <p className="text-white/40 text-xs mb-2 uppercase tracking-wide">Cherche une carte</p>
          <Suspense>
            <SearchBar />
          </Suspense>
        </div>
      </section>

      {/* Bloc jeu → /play */}
      <section className="max-w-2xl mx-auto px-4 mt-4">
        <Link href="/play" className="block">
          <div
            className="relative rounded-2xl overflow-hidden p-5 flex items-center justify-between"
            style={{ background: 'linear-gradient(135deg, #F0D080, #C9A84C)' }}
          >
            <div className="flex-1 pr-4">
              <p className="text-xs font-bold uppercase tracking-widest text-amber-900/60 mb-1">JEU</p>
              <h2 className="font-display font-bold text-xl text-amber-950 leading-tight">
                Est-ce que tu as l&apos;œil<br />pour l&apos;estimation?
              </h2>
              <p className="text-sm text-amber-900/70 mt-1">
                Découvre si tu sais bien estimer une carte !
              </p>
            </div>
            <div className="shrink-0 w-28 h-32 relative">
              <img
                src="https://images.pokemontcg.io/sv3pt5/199.png"
                alt="Carte Pokémon"
                className="w-full h-full object-contain drop-shadow-xl"
              />
            </div>
          </div>
        </Link>
      </section>

      {/* Dernières estimations */}
      <section className="mt-6 px-4 max-w-7xl mx-auto">
        <h2 className="text-xs font-bold uppercase tracking-widest text-ink/40 mb-1">
          Dernières estimations
        </h2>
        <p className="text-sm text-ink/60 mb-4">
          Regarde les dernières estimations de cartes Pokémon
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {FEATURED_CARDS.map((card, i) => (
            <Link
              key={`${card.id}-${i}`}
              href={`/card/${card.id}`}
              className="bg-white rounded-2xl border border-ink/8 overflow-hidden card-hover"
            >
              <div className="relative aspect-[3/4]">
                <img src={card.img} alt={card.name} className="w-full h-full object-contain p-2" loading="lazy" />
              </div>
              <div className="p-2.5">
                <p className="font-display font-semibold text-xs leading-tight truncate">{card.name}</p>
                <p className="text-xs text-ink/40 truncate">{card.set} · #{card.num}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <BottomNav />
    </div>
  )
}
