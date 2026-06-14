'use client'

type Props = {
  className?: string
  label?: string
  size?: number
}

export default function BrandLoader({
  className = '',
  label = 'Abriendo vista',
  size = 150,
}: Props) {
  return (
    <div className={`flex flex-col items-center gap-4 text-white ${className}`.trim()}>
      <svg
        width={size}
        height={(size * 72) / 160}
        viewBox="0 0 160 72"
        fill="none"
        aria-hidden
        className="animate-brand-loader-pulse"
      >
        <defs>
          <linearGradient id="joniscode-loader-gradient" x1="12" y1="14" x2="148" y2="58">
            <stop offset="0%" stopColor="#13B0F5" />
            <stop offset="55%" stopColor="#2F80ED" />
            <stop offset="100%" stopColor="#F49867" />
          </linearGradient>
        </defs>

        <path
          d="M15 36C15 23.2975 25.2975 13 38 13C50.7025 13 60.2435 21.6495 80 36C99.7565 50.3505 109.2975 59 122 59C134.7025 59 145 48.7025 145 36C145 23.2975 134.7025 13 122 13C109.2975 13 99.7565 21.6495 80 36C60.2435 50.3505 50.7025 59 38 59C25.2975 59 15 48.7025 15 36Z"
          stroke="rgba(255,255,255,0.16)"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <path
          d="M15 36C15 23.2975 25.2975 13 38 13C50.7025 13 60.2435 21.6495 80 36C99.7565 50.3505 109.2975 59 122 59C134.7025 59 145 48.7025 145 36C145 23.2975 134.7025 13 122 13C109.2975 13 99.7565 21.6495 80 36C60.2435 50.3505 50.7025 59 38 59C25.2975 59 15 48.7025 15 36Z"
          stroke="url(#joniscode-loader-gradient)"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="animate-brand-loader-stroke"
          style={{ filter: 'drop-shadow(0 0 16px rgba(47,128,237,0.35))' }}
        />
      </svg>

      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/65">JonisCode</p>
        <p className="mt-2 text-sm text-white/80">{label}</p>
      </div>
    </div>
  )
}
