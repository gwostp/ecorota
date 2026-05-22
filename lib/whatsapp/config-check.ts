import { getWhatsAppEnv, WHATSAPP_GRAPH_API_VERSION } from '@/lib/whatsapp/config'

export type WhatsAppConfigCheck = {
  ok: boolean
  errors: string[]
  debug: {
    apiVersion: string
    tokenPresent: boolean
    tokenLength: number
    phoneNumberIdPresent: boolean
    phoneNumberId: string | null
    endpoint: string | null
  }
}

export function checkWhatsAppConfig(): WhatsAppConfigCheck {
  const { token, phoneNumberId } = getWhatsAppEnv()
  const errors: string[] = []

  const tokenTrimmed = token?.trim() ?? ''
  const phoneIdTrimmed = phoneNumberId?.trim() ?? ''

  if (!tokenTrimmed) {
    errors.push('WHATSAPP_TOKEN não definido no .env.local')
  } else if (tokenTrimmed.length < 20) {
    errors.push(
      `WHATSAPP_TOKEN parece inválido (tamanho ${tokenTrimmed.length}; verifique se copiou o token completo da Meta)`,
    )
  }

  if (!phoneIdTrimmed) {
    errors.push('WHATSAPP_PHONE_NUMBER_ID não definido no .env.local')
  } else if (!/^\d+$/.test(phoneIdTrimmed)) {
    errors.push(
      `WHATSAPP_PHONE_NUMBER_ID deve ser numérico (recebido: "${phoneIdTrimmed}")`,
    )
  }

  const endpoint = phoneIdTrimmed
    ? `https://graph.facebook.com/${WHATSAPP_GRAPH_API_VERSION}/${phoneIdTrimmed}/messages`
    : null

  return {
    ok: errors.length === 0,
    errors,
    debug: {
      apiVersion: WHATSAPP_GRAPH_API_VERSION,
      tokenPresent: Boolean(tokenTrimmed),
      tokenLength: tokenTrimmed.length,
      phoneNumberIdPresent: Boolean(phoneIdTrimmed),
      phoneNumberId: phoneIdTrimmed || null,
      endpoint,
    },
  }
}
