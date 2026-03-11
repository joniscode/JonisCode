'use client'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import PUBLIC_ENV from '@/config/publicEnv'

const HIDE_ON = ['/']
const WA_ICON = '/icons/whatsapp.png'

export default function WhatsAppFab() {
  const pathname = usePathname() ?? '/'
  if (HIDE_ON.includes(pathname)) return null

  const phone = PUBLIC_ENV.WHATSAPP_PHONE?.replace(/\D/g, '')
  if (!phone) return null

  const href = `https://wa.me/${phone}?text=${encodeURIComponent(
    PUBLIC_ENV.WHATSAPP_DEFAULT_MSG
  )}`

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbeme por WhatsApp"
      title="Escríbeme por WhatsApp"
      className="fixed right-4 bottom-4 z-[9999] rounded-full p-3 md:p-4
                 bg-green-500 text-white shadow-lg shadow-green-500/30
                 hover:scale-105 active:scale-95 transition"
    >
      <Image src={WA_ICON} alt="WhatsApp" width={28} height={28} />
    </a>
  )
}
