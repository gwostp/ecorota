import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { EmailOtpType } from '@supabase/supabase-js'

function safeNextPath(next: string | null): string {
  if (!next || !next.startsWith('/') || next.startsWith('//')) {
    return '/painel'
  }
  return next
}

function getRedirectOrigin(request: NextRequest): string {
  const forwardedHost = request.headers.get('x-forwarded-host')
  const forwardedProto = request.headers.get('x-forwarded-proto') ?? 'https'
  if (forwardedHost) {
    return `${forwardedProto}://${forwardedHost}`
  }
  return request.nextUrl.origin
}

/**
 * Callback OAuth / confirmação de e-mail (Supabase Auth).
 * Cookies da sessão devem ser gravados na resposta de redirect (Route Handler).
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const code = searchParams.get('code')
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = safeNextPath(searchParams.get('next'))
  const origin = getRedirectOrigin(request)

  const oauthError = searchParams.get('error')
  const oauthDescription = searchParams.get('error_description')
  if (oauthError) {
    const msg = oauthDescription ?? oauthError
    return NextResponse.redirect(
      `${origin}/auth/error?message=${encodeURIComponent(msg)}`,
    )
  }

  const redirectTo = `${origin}${next}`
  let response = NextResponse.redirect(redirectTo)

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.redirect(
      `${origin}/auth/error?message=${encodeURIComponent('Supabase não configurado no servidor (variáveis de ambiente).')}`,
    )
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options)
        })
      },
    },
  })

  try {
    if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      if (error) {
        console.error('[auth/callback] exchangeCodeForSession:', error.message)
        return NextResponse.redirect(
          `${origin}/auth/error?message=${encodeURIComponent(error.message)}`,
        )
      }
      return response
    }

    if (token_hash && type) {
      const { error } = await supabase.auth.verifyOtp({
        type,
        token_hash,
      })
      if (error) {
        console.error('[auth/callback] verifyOtp:', error.message)
        return NextResponse.redirect(
          `${origin}/auth/error?message=${encodeURIComponent(error.message)}`,
        )
      }
      return response
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Erro desconhecido'
    console.error('[auth/callback]', msg)
    return NextResponse.redirect(
      `${origin}/auth/error?message=${encodeURIComponent(msg)}`,
    )
  }

  return NextResponse.redirect(
    `${origin}/auth/error?message=${encodeURIComponent(
      'Link inválido ou expirado. Faça login ou cadastre-se novamente.',
    )}`,
  )
}
