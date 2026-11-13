import type { MetadataRoute } from 'next'
import THEME from '@/config/theme'
import { META, PROFILE } from '@/data/site'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: META.title,
    short_name: PROFILE.brand,
    start_url: '/',
    display: 'standalone',
    theme_color: THEME.bg,
    background_color: THEME.bg,
    icons: [{ src: '/icon.png', sizes: '512x512', type: 'image/png' }],
  }
}
