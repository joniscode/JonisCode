'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'

type Props = {
  label: string
  slug: string
  icon?: string
}

export default function TechTile({ label, slug, icon }: Props) {
  const sources = useMemo(() => {
    const base = `/icons/${slug}`
    const candidates = [icon, `${base}.png`, `${base}.svg`, `${base}.webp`].filter(Boolean) as string[]
    return Array.from(new Set(candidates))
  }, [slug, icon])

  const [idx, setIdx] = useState(0)

  return (
    <div className="group relative flex h-28 w-24 select-none flex-col items-center justify-center rounded-2xl border border-white/10 bg-black/10 backdrop-blur transition-shadow ring-0 hover:ring-2 hover:ring-cyan-300/60 hover:shadow-[0_0_30px_6px_rgba(56,189,248,0.35)] dark:bg-white/5 sm:h-40 sm:w-36">
      <Image
        src={sources[idx]}
        alt={label}
        width={56}
        height={56}
        draggable={false}
        className="h-10 w-10 object-contain opacity-95 sm:h-14 sm:w-14"
        style={{ width: 'auto', height: 'auto' }}
        onError={() => {
          setIdx((value) => (value + 1 < sources.length ? value + 1 : value))
        }}
      />
      <div className="mt-2 text-xs font-semibold sm:mt-3 sm:text-sm">{label}</div>
    </div>
  )
}
