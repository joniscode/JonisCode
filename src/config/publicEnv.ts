// src/config/publicEnv.ts
const PUBLIC_ENV = {
  WHATSAPP_PHONE: process.env.NEXT_PUBLIC_WHATSAPP ?? '',
  WHATSAPP_DEFAULT_MSG:
    process.env.NEXT_PUBLIC_WHATSAPP_MSG ?? '¡Hola Jonathan! Te escribo desde tu portafolio.',
} as const;

export default PUBLIC_ENV;