import Image from 'next/image'
import Link from 'next/link'

const LABELS: Record<string, string> = {
  angular: 'Angular',
  react: 'React',
  bootstrap: 'Bootstrap',
  javascript: 'JavaScript',
  css: 'CSS',
  sass: 'Sass',
  vue: 'Vue',
  typescript: 'TypeScript',
  html: 'HTML',
  github: 'GitHub',
  postman: 'Postman',
  mysql: 'MySQL',
  tailwind: 'Tailwind',
  vite: 'Vite',
}

type Props = { slug: string; icon?: string; label?: string }

export default function TechCard({ slug, icon, label: labelProp }: Props) {
  const label = labelProp ?? LABELS[slug] ?? slug
  const src = icon ?? `/icons/${slug}.png`

  return (
    <Link
      href={`/tech/${slug}`}
      className="group block w-full rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/50"
    >
      <article className="relative h-full min-h-[120px] rounded-2xl border border-slate-200/80 bg-white/75 shadow-[0_10px_30px_rgba(15,23,42,0.12)] backdrop-blur transition-colors duration-300 group-hover:border-cyan-300/60 group-hover:bg-white dark:border-white/10 dark:bg-slate-950/30 dark:shadow-[0_10px_30px_rgba(0,0,0,.35)] dark:group-hover:border-white/25 dark:group-hover:bg-white/10 sm:min-h-[160px]">
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
          style={{
            background:
              'radial-gradient(120px 90px at 50% 40%, rgba(56,189,248,.18), transparent 70%)',
          }}
        />

        <div className="relative z-10 flex h-full flex-col items-center justify-center p-4 sm:p-6">
          <div className="flex h-12 items-center justify-center transition-transform duration-300 group-hover:scale-110 sm:h-20">
            <Image
              src={src}
              alt={label}
              width={72}
              height={72}
              className="max-h-full w-auto object-contain opacity-90"
              style={{ width: 'auto', height: 'auto' }}
            />
          </div>

          <h3 className="mt-3 text-center text-base font-semibold text-slate-800 dark:text-slate-100 sm:mt-4 sm:text-lg">{label}</h3>
        </div>
      </article>
    </Link>
  )
}
