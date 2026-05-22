import { createAdminClient } from '@/lib/supabase/admin'
import { normalizeWhatsAppPhone } from '@/lib/whatsapp/phone'

export type WhatsAppRecipient = {
  id: string
  nome: string
  telefone: string
}

/**
 * Busca moradores com telefone na tabela public.profiles (Supabase).
 */
export async function getWhatsAppRecipientsFromSupabase(): Promise<{
  recipients: WhatsAppRecipient[]
  error?: string
}> {
  try {
    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, phone')
      .not('phone', 'is', null)

    if (error) {
      console.error('[whatsapp/recipients] Supabase error:', error.message)
      return {
        recipients: [],
        error: error.message,
      }
    }

    const recipients: WhatsAppRecipient[] = []

    for (const row of data ?? []) {
      if (!row.phone) continue
      const telefone = normalizeWhatsAppPhone(String(row.phone))
      if (telefone.length < 12) continue

      recipients.push({
        id: row.id,
        nome: row.full_name?.trim() || 'morador',
        telefone,
      })
    }

    return { recipients }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao conectar Supabase'
    console.error('[whatsapp/recipients]', message)
    return { recipients: [], error: message }
  }
}
