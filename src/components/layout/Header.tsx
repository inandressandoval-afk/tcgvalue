import Link from 'next/link'
import { Search, BookOpen, Store } from 'lucide-react'

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-surface/90 backdrop-blur-sm border-b border-ink/8">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-6">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="font-display font-bold text-lg tracking-tight">
            TCG<span className="text-card-gold">Value</span>
          </span>
        </Link>

        {/* Nav */}
        <nav className="hidden sm:flex items-center gap-1">
          <Link
            href="/search"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-ink/60 hover:text-ink hover:bg-ink/5 transition"
          >
            <Search size={15} />
            Recherche
          </Link>
          <Link
            href="/learn"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-ink/60 hover:text-ink hover:bg-ink/5 transition"
          >
            <BookOpen size={15} />
            Formation
          </Link>
          <Link
            href="/pro"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-ink/60 hover:text-ink hover:bg-ink/5 transition"
          >
            <Store size={15} />
            Pro
          </Link>
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-2">
          <Link
            href="/pro"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-card-gold/40 text-card-gold text-sm font-medium hover:bg-card-gold/8 transition"
          >
            Accès Pro
          </Link>
          <Link
            href="/search"
            className="sm:hidden p-2 rounded-lg text-ink/60 hover:text-ink hover:bg-ink/5 transition"
          >
            <Search size={20} />
          </Link>
        </div>

      </div>
    </header>
  )
}
