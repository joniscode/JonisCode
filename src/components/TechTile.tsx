import Image from 'next/image'

type Props = {
  label: string
  slug: string
  icon?: string
  size?: 'compact' | 'cozy' | 'regular'
}

const SIZE_CLASSNAMES: Record<NonNullable<Props['size']>, { frame: string; icon: string; label: string }> = {
  compact: {
    frame:
      'h-24 w-20 rounded-2xl px-2 py-3 sm:h-32 sm:w-28',
    icon: 'h-8 w-8 sm:h-11 sm:w-11',
    label: 'mt-2 text-[11px] sm:mt-3 sm:text-xs',
  },
  cozy: {
    frame:
      'h-26 w-22 rounded-2xl px-3 py-3 sm:h-36 sm:w-32',
    icon: 'h-9 w-9 sm:h-12 sm:w-12',
    label: 'mt-2 text-xs sm:mt-3 sm:text-sm',
  },
  regular: {
    frame:
      'h-28 w-24 rounded-2xl px-3 py-3 sm:h-40 sm:w-36',
    icon: 'h-10 w-10 sm:h-14 sm:w-14',
    label: 'mt-2 text-xs sm:mt-3 sm:text-sm',
  },
}

export default function TechTile({ label, slug, icon, size = 'regular' }: Props) {
  const src = icon ?? `/icons/${slug}.png`
  const classes = SIZE_CLASSNAMES[size]

  return (
    <div
      className={[
        'group relative flex select-none flex-col items-center justify-center border border-slate-200/80 bg-white/75 text-slate-800 backdrop-blur transition-shadow ring-0 hover:ring-2 hover:ring-cyan-300/60 hover:shadow-[0_0_30px_6px_rgba(56,189,248,0.35)] dark:border-white/10 dark:bg-slate-950/30 dark:text-slate-100',
        classes.frame,
      ].join(' ')}
    >
      <Image
        src={src}
        alt={label}
        width={56}
        height={56}
        draggable={false}
        className={`${classes.icon} object-contain opacity-95`}
        style={{ width: 'auto', height: 'auto' }}
      />
      <div className={`${classes.label} text-center font-semibold leading-tight`}>{label}</div>
    </div>
  )
}
