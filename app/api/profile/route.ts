import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { normalizeWhatsAppPhone } from '@/lib/whatsapp/phone'

/**
 * Salva/atualiza telefone do morador em public.profiles (após cadastro).
 */
export async function POST(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ ok: false, error: 'Não autenticado' }, { status: 401 })
  }

  let body: { phone?: string; full_name?: string } = {}
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'JSON inválido' }, { status: 400 })
  }

  const phone = body.phone ? normalizeWhatsAppPhone(body.phone) : null
  const full_name =
    body.full_name?.trim() ||
    (typeof user.user_metadata?.full_name === 'string'
      ? user.user_metadata.full_name
      : null)

  const { error } = await supabase.from('profiles').upsert(
    {
      id: user.id,
      phone: phone || null,
      full_name,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'id' },
  )

  if (error) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 },
    )
  }

  return NextResponse.json({ ok: true, phone, full_name })
}
