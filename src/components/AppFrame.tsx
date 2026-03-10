'use client'

import { usePathname } from 'next/navigation'

const NO_FIXED_FOOTER_ROUTES = ['/']

export default function AppFrame({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const noFixedFooter = NO_FIXED_FOOTER_ROUTES.includes(pathname)

  return <div className={noFixedFooter ? 'min-h-[100svh]' : 'min-h-[100svh] md:pb-16'}>{children}</div>
}
