import clsx from 'clsx'

const RARITY_MAP: Record<string, { label: string; cls: string }> = {
  'common':                      { label: 'Commune',           cls: 'rarity-common' },
  'uncommon':                    { label: 'Peu commune',        cls: 'rarity-uncommon' },
  'rare':                        { label: 'Rare',              cls: 'rarity-rare' },
  'rare holo':                   { label: 'Rare Holo',         cls: 'rarity-rare' },
  'rare holo v':                 { label: 'Rare V',            cls: 'rarity-ultra' },
  'rare holo vmax':              { label: 'VMAX',              cls: 'rarity-ultra' },
  'rare holo vstar':             { label: 'VSTAR',             cls: 'rarity-ultra' },
  'rare ultra':                  { label: 'Ultra Rare',        cls: 'rarity-ultra' },
  'rare secret':                 { label: 'Secret Rare',       cls: 'rarity-secret' },
  'illustration rare':           { label: 'Illus. Rare',       cls: 'rarity-special' },
  'special illustration rare':   { label: 'Spéciale Illus.',   cls: 'rarity-special' },
  'hyper rare':                  { label: 'Hyper Rare',        cls: 'rarity-secret' },
  'double rare':                 { label: 'Double Rare',       cls: 'rarity-ultra' },
  'promo':                       { label: 'Promo',             cls: 'rarity-uncommon' },
}

function getRarity(rarity: string | null) {
  if (!rarity) return { label: '—', cls: 'rarity-common' }
  const key = rarity.toLowerCase()
  return RARITY_MAP[key] ?? { label: rarity, cls: 'rarity-common' }
}

interface RarityBadgeProps {
  rarity: string | null
  size?: 'sm' | 'md'
}

export function RarityBadge({ rarity, size = 'md' }: RarityBadgeProps) {
  const { label, cls } = getRarity(rarity)
  return (
    <span
      className={clsx(
        cls,
        'inline-flex items-center rounded-full font-body font-medium',
        size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1',
      )}
    >
      {label}
    </span>
  )
}
