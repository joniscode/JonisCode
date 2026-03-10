import Image from 'next/image'

type Props = {
  name: string
  image: string
  href: string
  label: string
}

export default function TechShowcaseCard({ name, image, href, label }: Props) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group block overflow-hidden rounded-2xl border border-white/10 bg-slate-950/60 shadow-[0_24px_60px_rgba(0,0,0,0.35)] backdrop-blur transition-transform duration-300 hover:-translate-y-1 hover:border-white/20"
    >
      <div className="p-4">
        <div className="relative overflow-hidden rounded-xl border border-white/10 bg-slate-900/80">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(174,103,250,0.16),_transparent_40%),radial-gradient(circle_at_80%_20%,_rgba(244,152,103,0.14),_transparent_30%)] opacity-80" />
          <div className="relative aspect-[4/3]">
            <Image
              src={image}
              alt={name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#8f5ef7] via-[#c97fd9] to-[#f49867] p-[1px]">
        <div className="bg-[#0b1220] px-5 py-5 text-center text-white">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/55">{label}</p>
          <p className="mt-3 text-lg font-black uppercase tracking-[0.08em]">{name}</p>
        </div>
      </div>
    </a>
  )
}
