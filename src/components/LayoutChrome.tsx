'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import PUBLIC_ENV from '@/config/publicEnv'

const ROOT_PATH = '/'
const HOME_PATH = '/home'
const WA_ICON = '/icons/whatsapp.png'

export default function LayoutChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? ROOT_PATH
  const isLanding = pathname === ROOT_PATH
  const isHome = pathname === HOME_PATH
  const phone = PUBLIC_ENV.WHATSAPP_PHONE?.replace(/\D/g, '')
  const whatsappHref = phone
    ? `https://wa.me/${phone}?text=${encodeURIComponent(PUBLIC_ENV.WHATSAPP_DEFAULT_MSG)}`
    : null

  return (
    <>
      {!isLanding && whatsappHref ? (
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Escribeme por WhatsApp"
          title="Escribeme por WhatsApp"
          className="fixed bottom-4 right-4 z-[9999] rounded-full bg-green-500 p-3 text-white shadow-lg shadow-green-500/30 transition hover:scale-105 active:scale-95 md:p-4"
        >
          <Image src={WA_ICON} alt="WhatsApp" width={28} height={28} priority={false} />
        </a>
      ) : null}

      <div className={isLanding ? 'min-h-[100svh]' : 'min-h-[100svh] md:pb-16'}>{children}</div>

      {!isLanding ? (
        <footer
          className={
            isHome
              ? 'relative z-20 border-t border-slate-200/80 bg-white/70 text-sm text-slate-700 backdrop-blur dark:border-white/10 dark:bg-slate-950/35 dark:text-white/90'
              : 'relative border-t border-slate-200/80 bg-white/70 text-sm text-slate-700 backdrop-blur dark:border-white/10 dark:bg-slate-950/35 dark:text-white/90 md:fixed md:bottom-0 md:left-0 md:right-0 md:z-40'
          }
        >
          <div className="flex h-14 items-center md:h-16">
            <div className="container mx-auto flex w-full items-center justify-center px-4">
              <Link href={HOME_PATH} className="hover:underline">
                <span>JonisCode.com © {new Date().getFullYear()}</span>
              </Link>
            </div>
          </div>
        </footer>
      ) : null}
    </>
  )
}
