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

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

export default function ExperienceCard({
  className,
  icon,
  title,
  roleLine,
  companyLine,
  tags = [],
  description,
  achievements = [],
  period,
  linkHref,
  linkLabel,
}: Props) {
  return (
    <article
      className={cn(
        'mx-auto max-w-[820px] rounded-2xl border border-white/10 bg-black/30 p-6 shadow-xl backdrop-blur dark:bg-white/5',
        className,
      )}
    >
      {icon && (
        <div className="mb-4 inline-grid h-10 w-10 place-items-center rounded-full border border-white/12 bg-white/5">
          <Image
            src={icon}
            alt=""
            width={18}
            height={18}
            className="h-[18px] w-[18px] object-contain opacity-90"
            style={{ width: 'auto', height: 'auto' }}
          />
        </div>
      )}

      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="mt-1 opacity-80">{roleLine}</p>
      {companyLine && <p className="mt-3 opacity-80">{companyLine}</p>}

      {tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span key={tag} className="rounded-full border border-white/15 px-3 py-1 text-xs opacity-90">
              {tag}
            </span>
          ))}
        </div>
      )}

      {description && <p className="mt-4 leading-relaxed opacity-90">{description}</p>}

      {achievements.length > 0 && (
        <div className="mt-4">
          <p className="font-semibold">Logros personales:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {achievements.map((achievement, index) => (
              <li key={index}>{achievement}</li>
            ))}
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
  )
}
