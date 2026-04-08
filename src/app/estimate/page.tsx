import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { BottomNav } from '@/components/layout/BottomNav'

export default function EstimatePage() {
  return (
    <div className="min-h-screen pb-24">
      <Header />
      <main className="flex flex-col items-center justify-center py-40 px-4 text-center">
        <div className="text-5xl mb-6">🃏</div>
        <h1 className="font-display text-2xl font-bold mb-3">Outil d&apos;estimation</h1>
        <p className="text-ink/50 text-sm max-w-xs leading-relaxed mb-8">
          Scanne ta carte ou recherche-la pour obtenir une estimation. Cette fonctionnalité arrive bientôt !
        </p>
        <Link
          href="/search"
          className="px-5 py-2.5 rounded-xl bg-ink text-white text-sm font-medium hover:bg-ink/85 transition"
        >
          Rechercher une carte →
        </Link>
      </main>
      <BottomNav />
    </div>
  )
}
