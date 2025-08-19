'use client';
import { useMemo, useState } from 'react';
import Image from 'next/image';

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
  mysql: 'MySql',
  tailwind: 'Tailwind',
  vite: 'Vite',
};

type Props = { slug: string; icon?: string; label?: string };

export default function TechCard({ slug, icon, label: labelProp }: Props) {
  const label = labelProp ?? LABELS[slug] ?? slug;

  // Cadena de fallback: custom -> png -> svg -> text
  const [phase, setPhase] = useState<'custom' | 'png' | 'svg' | 'text'>(
    icon ? 'custom' : 'png'
  );

  const src = useMemo(() => {
    switch (phase) {
      case 'custom': return icon!;
      case 'png':    return `/icons/${slug}.png`;
      case 'svg':    return `/icons/${slug}.svg`;
      default:       return '';
    }
  }, [phase, icon, slug]);

  const onError = () => {
    setPhase(prev =>
      prev === 'custom' ? 'png' :
      prev === 'png'    ? 'svg' :
      /* was svg */       'text'
    );
  };

  return (
    <a
      href={`/tech/${slug}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group block w-full rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
    >
      <article
        className="
          relative h-full min-h-[140px] sm:min-h-[160px]
          rounded-2xl border border-white/10 bg-black/20 dark:bg-white/5
          backdrop-blur transition-colors duration-300
          shadow-[0_10px_30px_rgba(0,0,0,.35)]
          group-hover:border-white/25 group-hover:bg-white/10
        "
      >
        {/* glow */}
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0
                     group-hover:opacity-100 group-focus-visible:opacity-100
                     transition-opacity duration-300 blur-xl"
          style={{
            background:
              'radial-gradient(120px 90px at 50% 40%, rgba(255,255,255,.18), transparent 70%)',
          }}
        />

        {/* contenido */}
        <div className="relative z-10 flex h-full flex-col items-center justify-center p-6">
          <div className="h-16 sm:h-20 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
            {phase !== 'text' ? (
              <Image
                src={src}
                alt={label}
                width={72}
                height={72}
                className="max-h-full w-auto object-contain opacity-90"
                onError={onError}
                priority={false}
              />
            ) : (
              <span className="text-base font-semibold opacity-90">{label}</span>
            )}
          </div>

          <h3 className="mt-4 text-lg font-semibold text-center">{label}</h3>
        </div>
      </article>
    </a>
  );
}
