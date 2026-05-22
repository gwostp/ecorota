import { NextResponse } from 'next/server'
import { authorizeWhatsAppAdmin } from '@/lib/whatsapp/auth-request'
import { checkWhatsAppConfig } from '@/lib/whatsapp/config-check'
import { WHATSAPP_GRAPH_API_VERSION } from '@/lib/whatsapp/config'
import { buildColetaMessage } from '@/lib/whatsapp/messages'
import { validateBrazilWhatsAppPhone } from '@/lib/whatsapp/phone'
import { sendWhatsAppText } from '@/lib/whatsapp/send'

const LOG = '[api/send-whatsapp]'

type SendBody = {
  nome?: string
  telefone?: string
}

/**
 * POST /api/send-whatsapp
 * Body: { "nome": "Maria", "telefone": "5547992313578" }
 */
export async function POST(request: Request) {
  console.log(`${LOG} ─── nova requisição ───`)

  const auth = await authorizeWhatsAppAdmin(request)
  if (!auth.authorized) {
    console.warn(`${LOG} não autorizado:`, auth.reason)
    return NextResponse.json(
      { success: false, ok: false, error: auth.reason ?? 'Não autorizado' },
      { status: 401 },
    )
  }

  const configCheck = checkWhatsAppConfig()
  console.log(`${LOG} verificação env:`, JSON.stringify(configCheck, null, 2))

  if (!configCheck.ok) {
    const error = configCheck.errors.join('; ')
    return NextResponse.json(
      {
        success: false,
        ok: false,
        error,
        config: configCheck.debug,
        apiVersion: WHATSAPP_GRAPH_API_VERSION,
      },
      { status: 503 },
    )
  }

  let body: SendBody = {}
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      {
        success: false,
        ok: false,
        error: 'JSON inválido. Envie { "nome": "...", "telefone": "5547992313578" }',
      },
      { status: 400 },
    )
  }

  const nome = body.nome?.trim()
  const telefoneRaw = body.telefone?.trim()

  console.log(`${LOG} payload:`, { nome, telefone: telefoneRaw })

  if (!nome || !telefoneRaw) {
    return NextResponse.json(
      {
        success: false,
        ok: false,
        error: 'Campos obrigatórios: nome e telefone',
      },
      { status: 400 },
    )
  }

  const phoneValidation = validateBrazilWhatsAppPhone(telefoneRaw)
  console.log(`${LOG} validação telefone:`, phoneValidation)

  if (!phoneValidation.valid) {
    return NextResponse.json(
      {
        success: false,
        ok: false,
        error: phoneValidation.error,
        telefoneInformado: telefoneRaw,
        telefoneNormalizado: phoneValidation.normalized,
        exemplo: '5547992313578',
      },
      { status: 400 },
    )
  }

  const message = buildColetaMessage(nome)
  const result = await sendWhatsAppText(
    phoneValidation.normalized,
    message,
    LOG,
  )

  if (!result.success) {
    const httpStatus =
      result.status >= 400 && result.status < 600 ? result.status : 502

    console.error(`${LOG} falha final:`, result.error, 'HTTP', httpStatus)

    return NextResponse.json(
      {
        success: false,
        ok: false,
        error: result.error ?? 'Falha ao enviar via WhatsApp Cloud API',
        metaError: result.metaError,
        metaResponse: result.data,
        nome,
        telefone: result.to,
        apiVersion: result.apiVersion,
        endpoint: result.endpoint,
        httpStatus: result.status,
        dica:
          'No modo teste da Meta, o número deve estar em WhatsApp → API Setup → To (test recipients).',
      },
      { status: httpStatus },
    )
  }

  console.log(`${LOG} sucesso para`, result.to)

  return NextResponse.json(
    {
      success: true,
      ok: true,
      message: 'Mensagem aceita pela Meta (messages[].id retornado)',
      nome,
      telefone: result.to,
      textoEnviado: message,
      metaResponse: result.data,
      apiVersion: result.apiVersion,
      enviadoPor: auth.email,
    },
    { status: 200 },
  )
}
