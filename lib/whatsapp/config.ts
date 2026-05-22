import { parsePhoneList } from '@/lib/whatsapp/phone'

export { normalizeWhatsAppPhone, parsePhoneList } from '@/lib/whatsapp/phone'

/** Graph API — WhatsApp Cloud (Meta) */
export const WHATSAPP_GRAPH_API_VERSION = 'v25.0'

export function getWhatsAppEnv() {
  return {
    token: process.env.WHATSAPP_TOKEN,
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID,
    verifyToken: process.env.VERIFY_TOKEN,
    cronSecret: process.env.CRON_SECRET,
    adminEmails: (process.env.WHATSAPP_ADMIN_EMAILS ?? '')
      .split(',')
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean),
    testPhones: parsePhoneList(process.env.WHATSAPP_TEST_PHONE_NUMBER),
  }
}

export function isWhatsAppConfigured(): boolean {
  const { token, phoneNumberId } = getWhatsAppEnv()
  return Boolean(token && phoneNumberId)
}

export function isWhatsAppAdmin(email?: string | null): boolean {
  if (!email) return false
  const { adminEmails } = getWhatsAppEnv()
  if (adminEmails.length === 0) {
    return process.env.NODE_ENV === 'development'
  }
  return adminEmails.includes(email.toLowerCase())
}

export function getJoinvilleWeekday(): number {
  const weekday = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Sao_Paulo',
    weekday: 'short',
  }).format(new Date())

  const map: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  }
  return map[weekday] ?? -1
}

export type CollectionDayKind = 'thursday' | 'saturday'

export function getCollectionDayKind(
  weekday: number,
): CollectionDayKind | null {
  if (weekday === 4) return 'thursday'
  if (weekday === 6) return 'saturday'
  return null
}
