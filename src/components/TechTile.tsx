// components/TechTile.tsx
'use client'
import { useMemo, useState } from 'react'

export default function TechTile({
  label,
  slug,
  icon,
}: {
  label: string
  slug: string
  icon?: string
}) {
  // candidatos de imagen (el primero es el que esperamos que exista)
  const sources = useMemo(() => {
    const base = `/icons/${slug}`
    const arr = [icon, `${base}.png`, `${base}.svg`, `${base}.webp`].filter(Boolean) as string[]
    // eliminar duplicados
    return Array.from(new Set(arr))
  }, [slug, icon])

  const [idx, setIdx] = useState(0)

  return (
    <div
      className="
        group relative flex h-40 w-36
        select-none flex-col items-center justify-center
        rounded-2xl border border-white/10 bg-black/10 dark:bg-white/5 backdrop-blur
        transition-shadow
        ring-0 hover:ring-2 hover:ring-cyan-300/60
        hover:shadow-[0_0_30px_6px_rgba(56,189,248,0.35)]
      "
    >
      <img
        src={sources[idx]}
        alt={label}
        draggable={false}
        className="h-14 w-14 object-contain opacity-95"
        onError={() => {
          // intenta el siguiente formato si falla
          setIdx((i) => (i + 1 < sources.length ? i + 1 : i))
        }}
      />
      <div className="mt-3 text-sm font-semibold">{label}</div>
    </div>
  )
}
