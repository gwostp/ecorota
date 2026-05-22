import {
  getWhatsAppEnv,
  WHATSAPP_GRAPH_API_VERSION,
} from '@/lib/whatsapp/config'
import { checkWhatsAppConfig } from '@/lib/whatsapp/config-check'
import { formatMetaError, isMetaSendSuccess } from '@/lib/whatsapp/meta-errors'
import {
  validateBrazilWhatsAppPhone,
  normalizeWhatsAppPhone,
} from '@/lib/whatsapp/phone'

export type SendWhatsAppResult = {
  ok: boolean
  success: boolean
  status: number
  to: string
  apiVersion: string
  endpoint?: string
  data?: unknown
  error?: string
  metaError?: unknown
}

/**
 * Envia texto via WhatsApp Cloud API (Meta Graph API v25.0).
 * @see https://developers.facebook.com/docs/whatsapp/cloud-api/reference/messages
 */
export async function sendWhatsAppText(
  to: string,
  body: string,
  logPrefix = '[whatsapp/send]',
): Promise<SendWhatsAppResult> {
  const configCheck = checkWhatsAppConfig()
  const normalizedTo = normalizeWhatsAppPhone(to)
  const phoneCheck = validateBrazilWhatsAppPhone(to)

  console.log(`${logPrefix} config`, JSON.stringify(configCheck.debug, null, 2))

  if (!configCheck.ok) {
    const error = configCheck.errors.join('; ')
    console.error(`${logPrefix} config inválida:`, error)
    return {
      ok: false,
      success: false,
      status: 503,
      to: normalizedTo,
      apiVersion: WHATSAPP_GRAPH_API_VERSION,
      error,
    }
  }

  if (!phoneCheck.valid) {
    console.error(`${logPrefix} telefone inválido:`, phoneCheck.error)
    return {
      ok: false,
      success: false,
      status: 400,
      to: phoneCheck.normalized,
      apiVersion: WHATSAPP_GRAPH_API_VERSION,
      error: phoneCheck.error,
    }
  }

  const { token, phoneNumberId } = getWhatsAppEnv()
  const url = `https://graph.facebook.com/${WHATSAPP_GRAPH_API_VERSION}/${phoneNumberId}/messages`

  const payload = {
    messaging_product: 'whatsapp',
    recipient_type: 'individual',
    to: phoneCheck.normalized,
    type: 'text',
    text: { preview_url: false, body },
  }

  console.log(`${logPrefix} POST`, url)
  console.log(`${logPrefix} body (sem token):`, JSON.stringify(payload, null, 2))

  let response: Response
  let rawText = ''

  try {
    response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
    rawText = await response.text()
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Falha de rede ao chamar a Meta'
    console.error(`${logPrefix} fetch error:`, message)
    return {
      ok: false,
      success: false,
      status: 502,
      to: phoneCheck.normalized,
      apiVersion: WHATSAPP_GRAPH_API_VERSION,
      endpoint: url,
      error: message,
    }
  }

  let data: unknown = {}
  try {
    data = rawText ? JSON.parse(rawText) : {}
  } catch {
    data = { raw: rawText }
  }

  console.log(`${logPrefix} HTTP status:`, response.status)
  console.log(
    `${logPrefix} resposta Meta (completa):`,
    JSON.stringify(data, null, 2),
  )

  const metaSuccess = response.ok && isMetaSendSuccess(data)

  if (!metaSuccess) {
    const errorMessage = formatMetaError(data)
    console.error(`${logPrefix} falha Meta:`, errorMessage)

    return {
      ok: false,
      success: false,
      status: response.status >= 400 ? response.status : 502,
      to: phoneCheck.normalized,
      apiVersion: WHATSAPP_GRAPH_API_VERSION,
      endpoint: url,
      error: errorMessage,
      metaError: data,
      data,
    }
  }

  console.log(`${logPrefix} sucesso — message id:`, (data as { messages?: { id: string }[] }).messages?.[0]?.id)

  return {
    ok: true,
    success: true,
    status: response.status,
    to: phoneCheck.normalized,
    apiVersion: WHATSAPP_GRAPH_API_VERSION,
    endpoint: url,
    data,
  }
}
