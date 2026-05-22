import { createClient } from '@/lib/supabase/server'
import {
  getWhatsAppEnv,
  isWhatsAppAdmin,
  isWhatsAppConfigured,
} from '@/lib/whatsapp/config'

export async function authorizeWhatsAppAdmin(
  request: Request,
): Promise<{ authorized: boolean; email?: string; reason?: string }> {
  if (!isWhatsAppConfigured()) {
    return { authorized: false, reason: 'WhatsApp não configurado no servidor' }
  }

  const { cronSecret } = getWhatsAppEnv()
  const authHeader = request.headers.get('authorization')
  if (cronSecret && authHeader === `Bearer ${cronSecret}`) {
    return { authorized: true, email: 'cron-secret' }
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.email) {
    return { authorized: false, reason: 'Login necessário (admin)' }
  }

  if (!isWhatsAppAdmin(user.email)) {
    return {
      authorized: false,
      reason: 'E-mail sem permissão de admin (WHATSAPP_ADMIN_EMAILS)',
    }
  }

  return { authorized: true, email: user.email }
}

/** CRON_SECRET via header Authorization: Bearer ou query ?secret= */
export function authorizeCron(request: Request): boolean {
  const { cronSecret } = getWhatsAppEnv()
  if (!cronSecret) {
    return process.env.NODE_ENV === 'development'
  }

  const authHeader = request.headers.get('authorization')
  if (authHeader === `Bearer ${cronSecret}`) {
    return true
  }

  const url = new URL(request.url)
  const querySecret =
    url.searchParams.get('secret') ?? url.searchParams.get('cron_secret')

  return querySecret === cronSecret
}
