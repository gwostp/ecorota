import { NextResponse } from 'next/server'
import { authorizeCron } from '@/lib/whatsapp/auth-request'
import type { CollectionDayKind } from '@/lib/whatsapp/config'
import { isWhatsAppConfigured } from '@/lib/whatsapp/config'
import { runColetaCron } from '@/lib/whatsapp/coleta-cron'

function parseForceDay(value: string | null): CollectionDayKind | undefined {
  if (value === 'thursday' || value === 'qui' || value === '4') {
    return 'thursday'
  }
  if (value === 'saturday' || value === 'sab' || value === '6') {
    return 'saturday'
  }
  return undefined
}

/**
 * GET /api/cron/coleta
 * Autenticação: header Authorization: Bearer CRON_SECRET
 * ou query ?secret=CRON_SECRET
 *
 * Envia WhatsApp para todos os profiles com telefone (quinta/sábado).
 * Teste: ?force=thursday
 */
export async function GET(request: Request) {
  if (!authorizeCron(request)) {
    console.warn('[cron/coleta] tentativa não autorizada')
    return NextResponse.json(
      { ok: false, error: 'CRON_SECRET inválido ou ausente' },
      { status: 401 },
    )
  }

  if (!isWhatsAppConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        error:
          'Configure WHATSAPP_TOKEN e WHATSAPP_PHONE_NUMBER_ID no servidor.',
      },
      { status: 503 },
    )
  }

  const { searchParams } = new URL(request.url)
  const forceDay = parseForceDay(searchParams.get('force'))

  const outcome = await runColetaCron({ forceDay })

  return NextResponse.json({
    ok: !outcome.skipped && outcome.failed === 0,
    ...outcome,
  })
}

export async function POST(request: Request) {
  return GET(request)
}
