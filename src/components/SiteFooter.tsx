'use client'

import { usePathname } from 'next/navigation'

export default function SiteFooter() {
  const pathname = usePathname()

  if (pathname === '/') return null

  const isHome = pathname === '/home'

  return (
    <footer
      className={
        isHome
          ? 'relative z-20 border-t border-white/10 bg-black/30 text-sm text-white/90 backdrop-blur dark:bg-white/5'
          : 'relative border-t border-white/10 bg-black/30 text-sm text-white/90 backdrop-blur dark:bg-white/5 md:fixed md:bottom-0 md:left-0 md:right-0 md:z-40'
      }
    >
      <div className="flex h-14 items-center md:h-16">
        <div className="container mx-auto flex w-full items-center justify-center px-4">
          <a href="/home" className="hover:underline">
            <span>JonisCode.com © {new Date().getFullYear()}</span>
          </a>
        </div>
      </div>
    </footer>
  )
}
