'use client'
import { usePathname } from 'next/navigation'

const HIDDEN_ON = ['/']; // si tu portada está en /home, agrega '/home' aquí

export default function SiteFooter() {
  const pathname = usePathname()
  if (HIDDEN_ON.includes(pathname)) return null

  return (
    <footer className="relative md:fixed md:bottom-0 md:left-0 md:right-0 md:z-40
                        border-t border-white/10 bg-black/30 dark:bg-white/5 backdrop-blur
                        text-sm text-white/90">
      <div className="h-14 md:h-16 flex items-center">
        <div className="container mx-auto px-4 w-full flex items-center justify-center">
          <a href="/home" className="hover:underline"><span>JonisCode.com © {new Date().getFullYear()} </span></a>
        </div>
      </div>
    </footer>
  )
}
