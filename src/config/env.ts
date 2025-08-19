// src/config/env.ts
export const WHATSAPP_PHONE =
  process.env.NEXT_PUBLIC_WHATSAPP ?? '';

export const WHATSAPP_DEFAULT_MSG =
  process.env.NEXT_PUBLIC_WHATSAPP_MSG ??
  '¡Hola Jonathan! Te escribo desde tu portafolio.';