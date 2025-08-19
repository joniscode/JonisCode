'use client'
import { usePathname } from 'next/navigation'

const NO_FOOTER_ROUTES = ['/']; // agrega '/home' si tu portada está allí

export default function AppFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const noFooter = NO_FOOTER_ROUTES.includes(pathname)
  return (
    <div className={noFooter ? 'min-h-[100svh]' : 'min-h-[100svh] md:pb-16'}>
      {children}
    </div>
  )
}
