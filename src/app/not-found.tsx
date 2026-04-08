import Link from 'next/link'
import { Header } from '@/components/layout/Header'

export default function NotFound() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="flex flex-col items-center justify-center py-40 px-4 text-center">
        <p className="font-mono text-6xl font-bold text-ink/10 mb-4">404</p>
        <h1 className="font-display text-2xl font-bold mb-2">Carte introuvable</h1>
        <p className="text-ink/50 text-sm mb-8">
          Cette carte n&apos;existe pas ou a été retirée de la base de données.
        </p>
        <Link
          href="/search"
          className="px-5 py-2.5 rounded-xl bg-ink text-white text-sm font-medium hover:bg-ink/85 transition"
        >
          Retour à la recherche
        </Link>
      </main>
    </div>
  )
}
