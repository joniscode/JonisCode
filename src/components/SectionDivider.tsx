import type { CSSProperties } from 'react'

type Props = {
  duration?: number
  delay?: number
  edge?: string
}

export default function SectionDivider({ duration = 5000, delay = 0, edge = '10%' }: Props) {
  const maskStyle = { '--edge': edge } as CSSProperties & { '--edge': string }

  return (
    <div className="relative my-8 overflow-hidden">
      <div className="h-px bg-gradient-to-r from-transparent via-black/15 to-transparent dark:via-white/15" />

      <div className="pointer-events-none absolute inset-0 mask-edge-fade" style={maskStyle}>
        <div
          className="animate-beam absolute top-1/2 h-[2px] w-28 -translate-y-1/2 bg-gradient-to-r from-transparent via-black to-transparent dark:via-white"
          style={{ animationDuration: `${duration}ms`, animationDelay: `${delay}ms` }}
        />
        <div
          className="animate-beam absolute top-1/2 h-[2px] w-28 -translate-y-1/2 bg-gradient-to-r from-transparent via-black/70 to-transparent blur-[6px] dark:via-white/70"
          style={{ animationDuration: `${duration}ms`, animationDelay: `${delay}ms` }}
        />
      </div>
    </div>
  )
}
