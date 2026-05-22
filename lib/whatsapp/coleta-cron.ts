import {
  getCollectionDayKind,
  getJoinvilleWeekday,
  type CollectionDayKind,
} from '@/lib/whatsapp/config'
import { buildColetaMessage } from '@/lib/whatsapp/messages'
import { getWhatsAppRecipientsFromSupabase } from '@/lib/whatsapp/recipients'
import { sendWhatsAppText, type SendWhatsAppResult } from '@/lib/whatsapp/send'

export type ColetaCronSendLog = {
  userId: string
  nome: string
  telefone: string
  ok: boolean
  status: number
  error?: unknown
}

export type ColetaCronResult = {
  skipped: boolean
  reason?: string
  dayKind?: CollectionDayKind
  weekday: number
  totalRecipients: number
  sent: number
  failed: number
  logs: ColetaCronSendLog[]
  supabaseError?: string
}

export async function runColetaCron(options?: {
  forceDay?: CollectionDayKind
}): Promise<ColetaCronResult> {
  const weekday = getJoinvilleWeekday()
  const dayKind = options?.forceDay ?? getCollectionDayKind(weekday)

  if (!dayKind) {
    const result: ColetaCronResult = {
      skipped: true,
      reason: 'Hoje não é quinta nem sábado (fuso America/Sao_Paulo)',
      weekday,
      totalRecipients: 0,
      sent: 0,
      failed: 0,
      logs: [],
    }
    console.log('[cron/coleta]', JSON.stringify(result))
    return result
  }

  const { recipients, error: supabaseError } =
    await getWhatsAppRecipientsFromSupabase()

  if (recipients.length === 0) {
    const result: ColetaCronResult = {
      skipped: true,
      reason:
        supabaseError ??
        'Nenhum usuário com telefone em profiles. Execute a migration SQL no Supabase.',
      dayKind,
      weekday,
      totalRecipients: 0,
      sent: 0,
      failed: 0,
      logs: [],
      supabaseError,
    }
    console.log('[cron/coleta]', JSON.stringify(result))
    return result
  }

  const logs: ColetaCronSendLog[] = []

  for (const recipient of recipients) {
    const message = buildColetaMessage(recipient.nome)
    const sendResult: SendWhatsAppResult = await sendWhatsAppText(
      recipient.telefone,
      message,
    )

    const log: ColetaCronSendLog = {
      userId: recipient.id,
      nome: recipient.nome,
      telefone: sendResult.to,
      ok: sendResult.ok,
      status: sendResult.status,
      error: sendResult.error,
    }
    logs.push(log)

    console.log(
      '[cron/coleta] envio',
      JSON.stringify({
        userId: log.userId,
        telefone: log.telefone,
        ok: log.ok,
        status: log.status,
      }),
    )

    // Pequena pausa para evitar rate limit em lotes grandes
    await new Promise((r) => setTimeout(r, 300))
  }

  const sent = logs.filter((l) => l.ok).length
  const failed = logs.length - sent

  const result: ColetaCronResult = {
    skipped: false,
    dayKind,
    weekday,
    totalRecipients: recipients.length,
    sent,
    failed,
    logs,
    reason: failed > 0 ? `${failed} envio(s) falharam` : undefined,
    supabaseError,
  }

  console.log('[cron/coleta] resumo', JSON.stringify({
    dayKind: result.dayKind,
    total: result.totalRecipients,
    sent: result.sent,
    failed: result.failed,
  }))

  return result
}
