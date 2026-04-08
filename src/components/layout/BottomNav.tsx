'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, BarChart2, Layers, Settings } from 'lucide-react'
import clsx from 'clsx'

const NAV = [
  { href: '/',          icon: Home,       label: 'Accueil' },
  { href: '/search',    icon: Search,     label: 'Recherche' },
  { href: '/play',      icon: BarChart2,  label: 'Estimer',  primary: true },
  { href: '/collection',icon: Layers,     label: 'Collection' },
  { href: '/settings',  icon: Settings,   label: 'Réglages' },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t border-ink/8 flex items-center justify-around px-2 pb-safe-area-inset-bottom"
      style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
    >
      {NAV.map(({ href, icon: Icon, label, primary }) => {
        const active = pathname === href || (href !== '/' && pathname.startsWith(href))
        return primary ? (
          <Link
            key={href}
            href={href}
            className="flex flex-col items-center -mt-5"
          >
            <div className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg"
              style={{ background: 'linear-gradient(135deg, #C9A84C, #F0D080)' }}
            >
              <Icon size={24} color="#1a1a00" />
            </div>
            <span className="text-xs mt-1 font-medium" style={{ color: '#C9A84C' }}>
              {label}
            </span>
          </Link>
        ) : (
          <Link
            key={href}
            href={href}
            className={clsx(
              'flex flex-col items-center gap-0.5 py-2 px-3 rounded-xl transition',
              active ? 'text-ink' : 'text-ink/35 hover:text-ink/60',
            )}
          >
            <Icon size={22} />
            <span className="text-xs">{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
