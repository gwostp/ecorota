import { NextResponse } from 'next/server'
import { getColectaByBairro } from '@/lib/ecorota/content'

/**
 * GET /api/cep?cep=89201000
 * Consulta ViaCEP e retorna bairro + horário de coleta.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const cep = searchParams.get('cep')?.replace(/\D/g, '')

  if (!cep || cep.length !== 8) {
    return NextResponse.json({ ok: false, error: 'CEP inválido' }, { status: 400 })
  }

  try {
    const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`, {
      next: { revalidate: 86400 }, // cache 24h
    })

    if (!res.ok) {
      return NextResponse.json({ ok: false, error: 'Erro ao consultar CEP' }, { status: 502 })
    }

    const data = await res.json()

    if (data.erro) {
      return NextResponse.json({ ok: false, error: 'CEP não encontrado' }, { status: 404 })
    }

    const bairro: string = data.bairro || ''
    const logradouro: string = data.logradouro || ''
    const cidade: string = data.localidade || ''
    const coleta = getColectaByBairro(bairro)

    return NextResponse.json({
      ok: true,
      bairro,
      logradouro,
      cidade,
      coleta,
    })
  } catch {
    return NextResponse.json({ ok: false, error: 'Erro interno' }, { status: 500 })
  }
}
