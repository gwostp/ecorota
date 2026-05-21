'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import {
  ArrowRight,
  Calendar,
  Leaf,
  MapPin,
  Recycle,
  Sparkles,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { SiteHeader } from '@/components/site-header'
import { AuthPanel } from '@/components/auth-panel'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  COLLECTION_SCHEDULE,
  PROJECT,
  SITE,
  STEPS,
  WASTE_TYPES,
} from '@/lib/ecorota/content'

export function EcorotaLanding() {
  const supabase = useMemo(() => createClient(), [])
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadSession = async () => {
      const { data } = await supabase.auth.getUser()
      setUser(data.user)
      setLoading(false)
    }

    loadSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-100/80 via-white to-green-50">
      <SiteHeader userEmail={user?.email} onLogout={handleLogout} />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-emerald-100/60">
        <div className="pointer-events-none absolute -right-20 -top-20 size-72 rounded-full bg-emerald-300/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 size-64 rounded-full bg-green-400/20 blur-3xl" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-2 lg:items-center lg:py-20">
          <div className="space-y-6">
            <Badge className="bg-emerald-600 hover:bg-emerald-600">
              <MapPin className="mr-1 size-3" />
              {SITE.city}
            </Badge>
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-emerald-950 sm:text-5xl lg:text-[2.75rem]">
              Coleta seletiva e reciclagem com o{' '}
              <span className="text-emerald-600">EcoRota</span>
            </h1>
            <p className="text-lg text-emerald-900/75">
              Sistema ambiental para moradores de Joinville: cadastro, login,
              painel do usuário e informações sobre coleta às{' '}
              <strong>quintas</strong> e <strong>sábados</strong>.
            </p>
            <div className="flex flex-wrap gap-3">
              {user ? (
                <Button
                  asChild
                  size="lg"
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  <Link href="/painel">
                    Abrir painel
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
              ) : (
                <Button
                  asChild
                  size="lg"
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  <a href="#cadastro">
                    Cadastrar agora
                    <ArrowRight className="size-4" />
                  </a>
                </Button>
              )}
              <Button asChild variant="outline" size="lg">
                <a href="#coleta">Ver dias de coleta</a>
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-3 pt-2 sm:max-w-md">
              {[
                { value: '2x', label: 'Coleta / semana' },
                { value: '6', label: 'Tipos de resíduo' },
                { value: '100%', label: 'Digital' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-emerald-100 bg-white/80 p-3 text-center shadow-sm"
                >
                  <p className="text-lg font-bold text-emerald-700">
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="rounded-2xl border border-emerald-200/80 bg-white/90 p-6 shadow-2xl shadow-emerald-900/10 backdrop-blur sm:p-8">
              <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-700 text-white">
                <Recycle className="size-7" />
              </div>
              <h2 className="text-xl font-semibold text-emerald-950">
                Coleta seletiva em Joinville
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Separe corretamente, reduza o lixo no aterro e fortaleça a
                reciclagem local com orientação clara e painel personalizado.
              </p>
              <ul className="mt-5 space-y-3">
                {WASTE_TYPES.slice(0, 4).map((type) => (
                  <li
                    key={type.name}
                    className={`inline-flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium ${type.color}`}
                  >
                    <Leaf className="mr-2 size-4 shrink-0 opacity-70" />
                    {type.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Sobre */}
      <section id="sobre" className="scroll-mt-24 border-b border-emerald-50 py-14 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
              {PROJECT.title}
            </p>
            <h2 className="mt-2 text-3xl font-bold text-emerald-950 sm:text-4xl">
              Reciclagem com participação da comunidade
            </h2>
          </div>
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {PROJECT.goals.map((goal) => (
              <Card
                key={goal.title}
                className="border-emerald-100 bg-white/90 transition hover:border-emerald-200 hover:shadow-md"
              >
                <CardHeader>
                  <Sparkles className="mb-1 size-5 text-emerald-600" />
                  <CardTitle className="text-lg text-emerald-950">
                    {goal.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {goal.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mx-auto mt-10 max-w-3xl space-y-4 text-center text-muted-foreground">
            {PROJECT.paragraphs.map((p) => (
              <p key={p.slice(0, 24)} className="text-sm leading-relaxed sm:text-base">
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* Coleta quinta e sábado */}
      <section
        id="coleta"
        className="scroll-mt-24 bg-gradient-to-b from-emerald-50/80 to-white py-14 sm:py-16"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">
                Calendário
              </p>
              <h2 className="mt-2 text-3xl font-bold text-emerald-950">
                {COLLECTION_SCHEDULE.title}
              </h2>
              <p className="mt-2 max-w-xl text-muted-foreground">
                {COLLECTION_SCHEDULE.subtitle}
              </p>
            </div>
            <Badge variant="outline" className="w-fit border-emerald-300 text-emerald-800">
              <Calendar className="mr-1 size-3" />
              Quinta e sábado
            </Badge>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {COLLECTION_SCHEDULE.days.map((day) => (
              <Card
                key={day.day}
                className="overflow-hidden border-emerald-200 shadow-lg"
              >
                <div className="bg-gradient-to-r from-emerald-600 to-green-700 px-6 py-4 text-white">
                  <h3 className="text-xl font-bold">{day.day}</h3>
                  <p className="text-sm text-emerald-100">{day.focus}</p>
                </div>
                <CardContent className="space-y-4 pt-6">
                  <p className="font-medium text-emerald-800">{day.time}</p>
                  <ul className="space-y-2">
                    {day.items.map((item) => (
                      <li
                        key={item}
                        className="flex gap-2 text-sm text-muted-foreground"
                      >
                        <span className="font-bold text-emerald-600">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p className="rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-900">
                    {day.tip}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section className="border-b border-emerald-50 py-14 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-center text-3xl font-bold text-emerald-950">
            Como funciona
          </h2>
          <ol className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-2">
            {STEPS.map((step, index) => (
              <li
                key={step}
                className="flex gap-4 rounded-xl border border-emerald-100 bg-white p-4 shadow-sm"
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">
                  {index + 1}
                </span>
                <p className="text-sm text-emerald-950/90">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Cadastro / Login */}
      <section className="py-14 sm:py-16">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-start">
          <div className="space-y-4 lg:sticky lg:top-24">
            <h2 className="text-3xl font-bold text-emerald-950">
              {user ? 'Sua conta está ativa' : 'Participe do programa'}
            </h2>
            <p className="text-muted-foreground">
              {user
                ? 'Acesse o painel para ver coletas, checklist de separação e dados da sua conta.'
                : 'Cadastre-se gratuitamente ou faça login. Autenticação integrada com Supabase.'}
            </p>
            {user && (
              <Button
                asChild
                size="lg"
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <Link href="/painel">Ir para o painel</Link>
              </Button>
            )}
          </div>

          {loading ? (
            <Card className="border-emerald-100">
              <CardContent className="py-16 text-center text-muted-foreground">
                Carregando...
              </CardContent>
            </Card>
          ) : user ? (
            <Card className="border-emerald-200 shadow-lg">
              <CardHeader>
                <CardTitle>Logado como</CardTitle>
                <CardDescription>{user.email}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                  Use o painel para acompanhar quinta e sábado, marcar sua
                  separação semanal e consultar tipos de resíduo.
                </p>
                <Button
                  asChild
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                >
                  <Link href="/painel">Abrir painel do usuário</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <AuthPanel />
          )}
        </div>
      </section>

      <footer className="border-t border-emerald-100 bg-emerald-950 px-4 py-10 text-emerald-50 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Recycle className="size-5" />
            <span className="font-semibold">{SITE.name}</span>
            <span className="text-emerald-300">·</span>
            <span className="text-sm text-emerald-200">{SITE.city}</span>
          </div>
          <p className="text-sm text-emerald-300/90">
            Coleta seletiva · Reciclagem · Painel do morador
          </p>
        </div>
      </footer>
    </div>
  )
}
