import Image from 'next/image'

type Props = {
  className?: string
  icon?: string
  title: string
  roleLine: string
  companyLine?: string
  tags?: string[]
  description?: string
  achievements?: string[]
  period?: string
  linkHref?: string
  linkLabel?: string
}

export default function ExperienceCard({
  className,
  icon, title, roleLine, companyLine, tags = [],
  description, achievements = [], period, linkHref, linkLabel,
}: Props) {
  return (
    <div className={`relative pl-10 ${className ?? ''}`}>
      {/* línea vertical del ítem */}
      <div className="absolute left-4 top-0 bottom-0 w-px bg-white/10" />

      {/* nodo */}
      <div className="absolute left-0 top-6 w-8 h-8 rounded-full bg-slate-700/70 ring-2 ring-white/20 grid place-items-center">
        {icon ? (
          <Image src={icon} alt="" width={16} height={16} className="object-contain opacity-90" />
        ) : (
          <span className="text-[10px] opacity-80">•</span>
        )}
      </div>

      {/* card */}
      <article className="rounded-xl border border-white/10 bg-black/30 dark:bg-white/5 backdrop-blur p-6 shadow-xl">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="mt-1 opacity-80">{roleLine}</p>
        {companyLine && <p className="mt-3 opacity-80">{companyLine}</p>}

        {tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {tags.map(t => (
              <span key={t} className="rounded-full border border-white/15 px-3 py-1 text-xs opacity-90">
                {t}
              </span>
            ))}
          </div>
        )}

        {description && <p className="mt-4 leading-relaxed opacity-90">{description}</p>}

        {achievements.length > 0 && (
          <div className="mt-4">
            <p className="font-semibold">Logros personales:</p>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              {achievements.map((a, i) => <li key={i}>{a}</li>)}
            </ul>
          </div>
        )}

        {(period || linkHref) && (
          <div className="mt-4 flex flex-wrap items-center gap-4 opacity-80">
            {period && <span>{period}</span>}
            {linkHref && (
              <a className="underline hover:opacity-100" href={linkHref} target="_blank" rel="noreferrer">
                {linkLabel ?? 'Visita el sitio web'}
              </a>
            )}
          </div>
        )}
      </article>
    </div>
    
  )
}
