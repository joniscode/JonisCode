import { ImageResponse } from 'next/og'
import THEME from '@/config/theme'
import { META, PROFILE } from '@/data/site'

export const alt = META.title
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Imagen que se muestra al compartir el enlace en LinkedIn, WhatsApp, etc.
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 72,
          background: THEME.bg,
          color: THEME.ink,
        }}
      >
        <div style={{ display: 'flex', fontSize: 26, letterSpacing: 6, color: THEME.accent }}>
          {META.ogLabel}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', fontSize: 150, fontWeight: 900, lineHeight: 0.95 }}>
          {PROFILE.nameLines.map((line) => (
            <span key={line}>{line.toUpperCase()}</span>
          ))}
        </div>
        <div style={{ display: 'flex', fontSize: 30, color: THEME.muted }}>
          {META.ogStack}
        </div>
      </div>
    ),
    size
  )
}
