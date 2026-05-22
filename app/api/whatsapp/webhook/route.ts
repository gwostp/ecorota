import { NextResponse } from 'next/server'
import { getWhatsAppEnv } from '@/lib/whatsapp/config'

/**
 * Webhook WhatsApp Cloud API (Meta)
 *
 * CONFIGURAÇÃO NO PAINEL META (developers.facebook.com → seu app → WhatsApp → Configuration):
 *
 * 1. Callback URL (produção):
 *    https://SEU-DOMINIO.vercel.app/api/whatsapp/webhook
 *
 * 2. Verify Token:
 *    O mesmo valor de VERIFY_TOKEN no .env / Vercel
 *
 * 3. Clique em "Verify and save" — a Meta envia GET com hub.challenge;
 *    esta rota responde com o challenge se o token coincidir.
 *
 * 4. Inscreva-se nos campos: messages (e opcional message_status).
 */

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const mode = searchParams.get('hub.mode')
  const token = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  const { verifyToken } = getWhatsAppEnv()

  if (!verifyToken) {
    console.error('[whatsapp/webhook] VERIFY_TOKEN não configurado')
    return new NextResponse('VERIFY_TOKEN missing', { status: 500 })
  }

  if (mode === 'subscribe' && token === verifyToken && challenge) {
    console.log('[whatsapp/webhook] verificação Meta OK')
    return new NextResponse(challenge, {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    })
  }

  console.warn('[whatsapp/webhook] verificação falhou', { mode, tokenMatch: token === verifyToken })
  return new NextResponse('Forbidden', { status: 403 })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()

    console.log('[whatsapp/webhook] evento recebido', JSON.stringify(body))

    const entry = body?.entry?.[0]
    const changes = entry?.changes?.[0]
    const value = changes?.value

    if (value?.messages) {
      for (const msg of value.messages) {
        console.log('[whatsapp/webhook] mensagem', {
          from: msg.from,
          type: msg.type,
          id: msg.id,
        })
      }
    }

    if (value?.statuses) {
      for (const status of value.statuses) {
        console.log('[whatsapp/webhook] status', {
          id: status.id,
          status: status.status,
          recipient: status.recipient_id,
        })
      }
    }
  } catch (err) {
    console.error('[whatsapp/webhook] erro ao processar POST', err)
  }

  // Meta exige 200 rápido para não reenviar o evento
  return NextResponse.json({ ok: true })
}
