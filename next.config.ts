import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: '/home', destination: '/', permanent: false },
      { source: '/tech/:slug', destination: '/#lab', permanent: false },
    ]
  },
}

export default nextConfig
