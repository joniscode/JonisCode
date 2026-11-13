// src/config/publicEnv.ts
const PUBLIC_ENV = {
  WHATSAPP_PHONE: process.env.NEXT_PUBLIC_WHATSAPP ?? '+57 322 885 0811',
  WHATSAPP_DEFAULT_MSG:
    process.env.NEXT_PUBLIC_WHATSAPP_MSG ?? '¡Hola Jonathan! Te escribo desde tu portafolio.',
  // Correo público de contacto. Si queda vacío, el botón de correo no se muestra.
  CONTACT_EMAIL: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? '',
} as const

export default PUBLIC_ENV
