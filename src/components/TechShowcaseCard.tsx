import Image from 'next/image'

type Props = {
  name: string
  image: string
  href: string
  label: string
  description?: string
  download?: boolean
}

export default function TechShowcaseCard({ name, image, href, label, description, download }: Props) {
  const hasDescription = Boolean(description)

  return (
    <a
      href={href}
      target={download ? undefined : '_blank'}
      rel={download ? undefined : 'noopener noreferrer'}
      download={download ? true : undefined}
      aria-label={download ? 'Descargar ' + name : undefined}
      className="group block overflow-hidden rounded-2xl border border-slate-200/80 bg-white/80 shadow-[0_24px_60px_rgba(15,23,42,0.12)] backdrop-blur transition-transform duration-300 hover:-translate-y-1 hover:border-cyan-300/60 dark:border-white/10 dark:bg-slate-950/50 dark:shadow-[0_24px_60px_rgba(0,0,0,0.35)] dark:hover:border-white/20"
    >
      <div className="p-4">
        <div
          className={
            hasDescription
              ? 'relative mx-auto aspect-square max-w-[360px] overflow-hidden rounded-full border-2 border-cyan-300/70 bg-slate-950 shadow-[0_0_34px_rgba(34,211,238,0.22)] dark:border-emerald-300/60'
              : 'relative overflow-hidden rounded-xl border border-slate-200/80 bg-slate-100 dark:border-white/10 dark:bg-slate-900/80'
          }
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(174,103,250,0.16),_transparent_40%),radial-gradient(circle_at_80%_20%,_rgba(244,152,103,0.14),_transparent_30%)] opacity-80" />
          <div className={hasDescription ? 'relative aspect-square' : 'relative aspect-[4/3]'}>
            <Image
              src={image}
              alt={name}
              fill
              sizes="(min-width: 1280px) 544px, (min-width: 768px) 44vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {description ? (
              <div className="absolute inset-x-6 bottom-6 translate-y-3 rounded-lg bg-slate-950/90 px-4 py-3 text-center text-sm font-medium leading-relaxed text-white opacity-0 shadow-xl backdrop-blur transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                {description}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#8f5ef7] via-[#c97fd9] to-[#f49867] p-[1px]">
        <div className="bg-white px-5 py-5 text-center text-slate-900 dark:bg-[#0b1220] dark:text-white">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-white/55">{label}</p>
          <p className="mt-3 text-lg font-black uppercase tracking-[0.08em]">{name}</p>
        </div>
      </div>
    </a>
  )
}
