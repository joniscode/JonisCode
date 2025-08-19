import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'JonisCode',
    short_name: 'Portafolio',
    start_url: '/',
    display: 'standalone',
    theme_color: '#040D21',
    background_color: '#040D21',
    icons: [
      { src: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}
