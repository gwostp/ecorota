type MetaErrorBody = {
  error?: {
    message?: string
    type?: string
    code?: number
    error_subcode?: number
    error_user_title?: string
    error_user_msg?: string
    fbtrace_id?: string
  }
}

/** Extrai mensagem legível do JSON de erro da Graph API (Meta). */
export function formatMetaError(data: unknown): string {
  if (!data || typeof data !== 'object') {
    return typeof data === 'string' ? data : 'Erro desconhecido da Meta'
  }

  const body = data as MetaErrorBody
  const err = body.error

  if (!err) {
    return JSON.stringify(data)
  }

  const parts: string[] = []

  if (err.error_user_msg) {
    parts.push(err.error_user_msg)
  } else if (err.message) {
    parts.push(err.message)
  }

  if (err.code != null) {
    parts.push(`código ${err.code}`)
  }
  if (err.error_subcode != null) {
    parts.push(`subcódigo ${err.error_subcode}`)
  }
  if (err.type) {
    parts.push(`tipo: ${err.type}`)
  }
  if (err.fbtrace_id) {
    parts.push(`fbtrace_id: ${err.fbtrace_id}`)
  }

  return parts.length > 0 ? parts.join(' · ') : JSON.stringify(err)
}

type MetaSuccessBody = {
  messages?: Array<{ id?: string }>
  contacts?: Array<{ wa_id?: string; input?: string }>
}

/** Meta considera sucesso quando retorna messages[].id (ex.: wamid.xxx). */
export function isMetaSendSuccess(data: unknown): boolean {
  if (!data || typeof data !== 'object') return false
  const body = data as MetaSuccessBody
  const messageId = body.messages?.[0]?.id
  return typeof messageId === 'string' && messageId.length > 0
}
