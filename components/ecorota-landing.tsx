'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import {
  ArrowRight, Calendar, CheckCircle2, Clock, Leaf,
  MapPin, Recycle, Sparkles, Truck,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { SiteHeader } from '@/components/site-header'
import { AuthPanel } from '@/components/auth-panel'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { COLLECTION_SCHEDULE, PROJECT, SITE, STEPS, WASTE_TYPES } from '@/lib/ecorota/content'

const WASTE_ICONS: Record<string, string> = {
  'Papel / papelão': '📦',
  'Plástico': '♻️',
  'Metal': '🥫',
  'Vidro': '🍶',
  'Orgânico': '🌿',
  'Rejeito': '🗑️',
}

export function EcorotaLanding() {
  const supabase = useMemo(() => createClient(), [])
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <div className="min-h-screen bg-[#faf9f6]">
      <SiteHeader userEmail={user?.email} onLogout={handleLogout} />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden border-b border-emerald-100">
        {/* Fundo texturizado */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-950" />
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div className="pointer-events-none absolute -right-32 -top-32 size-[500px] rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-0 size-[400px] rounded-full bg-green-400/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-6xl gap-12 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-2 lg:items-center lg:py-28">
          <div className="space-y-7 animate-fade-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-800/50 px-3 py-1.5 text-xs font-medium text-emerald-300">
              <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse-dot" />
              {SITE.city} · Coleta seletiva
            </div>

            <h1 className="font-display text-4xl font-normal leading-[1.15] text-white sm:text-5xl lg:text-[3.25rem]">
              Reciclagem inteligente{' '}
              <span className="italic text-emerald-300">para Joinville</span>
            </h1>

            <p className="text-base leading-relaxed text-emerald-100/75 max-w-lg">
              Saiba exatamente quando o caminhão passa na sua rua, separe corretamente
              e acompanhe sua participação na coleta seletiva da cidade.
            </p>

            <div className="flex flex-wrap gap-3">
              {user ? (
                <Button asChild size="lg" className="h-12 rounded-xl bg-white text-emerald-900 hover:bg-emerald-50 font-medium shadow-lg shadow-black/20 px-6">
                  <Link href="/painel">Abrir painel <ArrowRight className="size-4 ml-1" /></Link>
                </Button>
              ) : (
                <Button asChild size="lg" className="h-12 rounded-xl bg-white text-emerald-900 hover:bg-emerald-50 font-medium shadow-lg shadow-black/20 px-6">
                  <a href="#cadastro">Cadastrar agora <ArrowRight className="size-4 ml-1" /></a>
                </Button>
              )}
              <Button asChild variant="outline" size="lg" className="h-12 rounded-xl border-emerald-400/40 bg-transparent text-emerald-100 hover:bg-emerald-800/50 hover:text-white px-6">
                <a href="#coleta">Ver dias de coleta</a>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 pt-1 sm:max-w-sm">
              {[
                { value: '2×', label: 'por semana' },
                { value: '6', label: 'tipos de resíduo' },
                { value: '100%', label: 'gratuito' },
              ].map((s) => (
                <div key={s.label} className="rounded-xl border border-emerald-400/20 bg-emerald-800/40 p-3 text-center backdrop-blur">
                  <p className="text-lg font-bold text-white">{s.value}</p>
                  <p className="text-[0.65rem] text-emerald-300/80 uppercase tracking-wide">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Card flutuante */}
          <div className="animate-fade-up delay-200">
            <div className="rounded-2xl border border-emerald-400/20 bg-white/10 p-6 backdrop-blur-md shadow-2xl">
              <div className="mb-5 flex items-center gap-3">
                <span className="flex size-11 items-center justify-center rounded-xl bg-emerald-400/20 text-emerald-300">
                  <Recycle className="size-5" />
                </span>
                <div>
                  <p className="font-semibold text-white">Coleta seletiva</p>
                  <p className="text-xs text-emerald-300">Joinville · SC</p>
                </div>
              </div>
              <div className="space-y-2.5">
                {WASTE_TYPES.map((type, i) => (
                  <div key={type.name}
                    className="flex items-center gap-3 rounded-xl bg-white/8 px-4 py-2.5 backdrop-blur animate-fade-up"
                    style={{ animationDelay: `${(i + 3) * 80}ms` }}
                  >
                    <span className="text-base">{WASTE_ICONS[type.name] ?? '♻️'}</span>
                    <span className="text-sm font-medium text-emerald-100">{type.name}</span>
                    <CheckCircle2 className="ml-auto size-4 text-emerald-400" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SOBRE ── */}
      <section id="sobre" className="scroll-mt-20 py-16 sm:py-24 border-b border-emerald-50">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="mx-auto max-w-xl text-center space-y-3 mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">
              {PROJECT.title}
            </p>
            <h2 className="font-display text-3xl font-normal text-emerald-950 sm:text-4xl">
              Reciclagem com <span className="italic">participação</span> da comunidade
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-3 mb-14">
            {PROJECT.goals.map((goal, i) => (
              <div key={goal.title}
                className="group rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm transition hover:border-emerald-200 hover:shadow-md animate-fade-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 transition group-hover:bg-emerald-100">
                  <Sparkles className="size-5" />
                </div>
                <h3 className="font-semibold text-emerald-950 mb-2">{goal.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{goal.description}</p>
              </div>
            ))}
          </div>

          <div className="mx-auto max-w-2xl space-y-4 text-center">
            {PROJECT.paragraphs.map((p) => (
              <p key={p.slice(0, 20)} className="text-sm leading-relaxed text-muted-foreground sm:text-[0.95rem]">{p}</p>
            ))}
          </div>
        </div>
      </section>

      {/* ── COLETA ── */}
      <section id="coleta" className="scroll-mt-20 py-16 sm:py-24 bg-emerald-950">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-12">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-emerald-400">Calendário</p>
              <h2 className="font-display text-3xl font-normal text-white sm:text-4xl">
                {COLLECTION_SCHEDULE.title}
              </h2>
              <p className="text-emerald-300/70 text-sm max-w-md">{COLLECTION_SCHEDULE.subtitle}</p>
              {!user && (
                <a
                  href="#cadastro"
                  className="inline-flex items-center gap-2 rounded-full bg-emerald-700/60 border border-emerald-500/30 px-4 py-2 text-xs font-medium text-emerald-200 transition hover:bg-emerald-700 hover:text-white w-fit mt-1"
                >
                  <MapPin className="size-3.5" />
                  Verificar dia no meu bairro
                </a>
              )}
            </div>
            <div className="flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-800/50 px-3 py-1.5 text-xs text-emerald-300 w-fit">
              <Calendar className="size-3.5" />
              Coleta semanal
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {COLLECTION_SCHEDULE.days.map((day, i) => (
              <div key={day.day}
                className="group rounded-2xl border border-emerald-700/40 bg-emerald-900/60 overflow-hidden transition hover:border-emerald-500/40 animate-fade-up"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <div className="flex items-center justify-between border-b border-emerald-700/30 px-6 py-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{day.day}</h3>
                    <p className="text-xs text-emerald-400 mt-0.5">{day.focus}</p>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-full bg-emerald-800 px-3 py-1 text-xs text-emerald-300">
                    <Clock className="size-3" />{day.time.split('—')[1]?.trim() ?? day.time}
                  </div>
                </div>
                <div className="px-6 py-5 space-y-3">
                  <ul className="space-y-2">
                    {day.items.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-sm text-emerald-200/80">
                        <CheckCircle2 className="size-4 shrink-0 text-emerald-500 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="rounded-xl bg-emerald-800/50 px-4 py-3 text-xs text-emerald-300/80 italic border border-emerald-700/30">
                    {day.tip}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMO FUNCIONA ── */}
      <section className="py-16 sm:py-24 border-b border-emerald-50">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <h2 className="font-display text-3xl font-normal text-center text-emerald-950 sm:text-4xl mb-12">
            Como <span className="italic">funciona</span>
          </h2>
          <ol className="mx-auto grid max-w-3xl gap-4 sm:grid-cols-2">
            {STEPS.map((step, i) => (
              <li key={step} className="flex gap-4 rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-sm font-bold text-white">
                  {i + 1}
                </span>
                <p className="text-sm leading-relaxed text-emerald-900/80 pt-0.5">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── RASTREAMENTO EM BREVE ── */}
      <section className="py-14 sm:py-20 bg-gradient-to-br from-emerald-50 to-[#faf9f6] border-b border-emerald-100">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <div className="rounded-2xl border border-emerald-200 bg-white p-6 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center gap-6 shadow-sm">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
              <Truck className="size-7" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <h3 className="font-semibold text-emerald-950 text-lg">Rastreamento em tempo real</h3>
                <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">Em breve</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
                Estamos desenvolvendo um sistema de rastreamento GPS dos caminhões de coleta.
                Em breve você poderá acompanhar em tempo real quando o caminhão está chegando na sua rua.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground border border-dashed border-emerald-200 rounded-xl px-4 py-2.5 whitespace-nowrap">
              <MapPin className="size-3.5 text-emerald-500" />
              Joinville · SC
            </div>
          </div>
        </div>
      </section>

      {/* ── CADASTRO ── */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:items-start">
          <div className="space-y-6 lg:sticky lg:top-24">
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">
              {user ? 'Sua conta' : 'Participe'}
            </p>
            <h2 className="font-display text-3xl font-normal text-emerald-950 sm:text-4xl">
              {user ? 'Você está conectado' : <>Cadastre-se e <span className="italic">descubra</span> sua coleta</>}
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {user
                ? 'Acesse o painel para ver suas coletas, checklist de separação e o mapa ilustrativo.'
                : 'Informe seu CEP e veja na hora quais são os dias e horários de coleta seletiva no seu bairro — antes mesmo de criar a conta.'}
            </p>

            {/* Mini legenda de tipos */}
            {!user && (
              <div className="flex flex-wrap gap-2 pt-2">
                {WASTE_TYPES.map((type) => (
                  <span key={type.name} className={`rounded-full px-3 py-1 text-xs font-medium ${type.color}`}>
                    {WASTE_ICONS[type.name]} {type.name}
                  </span>
                ))}
              </div>
            )}

            {user && (
              <Button asChild size="lg" className="h-12 rounded-xl bg-emerald-700 hover:bg-emerald-600 font-medium">
                <Link href="/painel">Ir para o painel <ArrowRight className="size-4 ml-1" /></Link>
              </Button>
            )}
          </div>

          {loading ? (
            <div className="rounded-2xl border border-emerald-100 bg-white p-16 text-center text-muted-foreground text-sm animate-pulse">
              Carregando...
            </div>
          ) : user ? (
            <div className="rounded-2xl border border-emerald-200 bg-white p-6 shadow-lg space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                  <Leaf className="size-5" />
                </div>
                <div>
                  <p className="font-medium text-emerald-950">Logado como</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                Use o painel para acompanhar quinta e sábado, marcar sua separação semanal e ver o mapa.
              </p>
              <Button asChild className="w-full h-11 bg-emerald-700 hover:bg-emerald-600 rounded-xl">
                <Link href="/painel">Abrir painel do usuário</Link>
              </Button>
            </div>
          ) : (
            <AuthPanel />
          )}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-emerald-100 bg-emerald-950 px-5 py-10 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex size-8 items-center justify-center rounded-lg bg-emerald-800 text-emerald-300">
              <Recycle className="size-4" />
            </span>
            <div>
              <p className="font-display text-sm font-normal text-white">{SITE.name}</p>
              <p className="text-xs text-emerald-400">{SITE.city}</p>
            </div>
          </div>
          <p className="text-xs text-emerald-500">
            Coleta seletiva · Reciclagem · Painel do morador · {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  )
}
