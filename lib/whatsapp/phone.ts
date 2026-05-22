/**
 * Normaliza telefone para WhatsApp Cloud API (E.164 sem "+").
 * Exemplo: (47) 99231-3578 → 5547992313578
 */
export function normalizeWhatsAppPhone(phone: string): string {
  let digits = phone.replace(/\D/g, '')
  if (!digits) return ''

  if (digits.startsWith('00')) {
    digits = digits.slice(2)
  }

  if (digits.startsWith('55') && digits.length >= 12) {
    return digits
  }

  if (digits.startsWith('0')) {
    digits = digits.slice(1)
  }

  return `55${digits}`
}

/** Brasil: 55 + DDD (2) + número (8–9) → 12 ou 13 dígitos. Ex.: 5547992313578 */
const BR_WHATSAPP_PHONE_REGEX = /^55[1-9]\d{9,10}$/

export function validateBrazilWhatsAppPhone(phone: string): {
  valid: boolean
  normalized: string
  error?: string
} {
  const normalized = normalizeWhatsAppPhone(phone)

  if (!normalized) {
    return {
      valid: false,
      normalized: '',
      error: 'Telefone vazio. Informe no formato 5547992313578',
    }
  }

  if (normalized.length < 12 || normalized.length > 13) {
    return {
      valid: false,
      normalized,
      error: `Telefone deve ter 12 ou 13 dígitos após normalização (recebido: ${normalized.length} — ${normalized})`,
    }
  }

  if (!BR_WHATSAPP_PHONE_REGEX.test(normalized)) {
    return {
      valid: false,
      normalized,
      error: `Formato inválido. Use 55 + DDD + número, ex.: 5547992313578 (normalizado: ${normalized})`,
    }
  }

  return { valid: true, normalized }
}

export function parsePhoneList(raw?: string): string[] {
  if (!raw) return []
  return raw
    .split(/[,;\s]+/)
    .map((p) => normalizeWhatsAppPhone(p))
    .filter((p) => {
      const v = validateBrazilWhatsAppPhone(p)
      return v.valid
    })
}
