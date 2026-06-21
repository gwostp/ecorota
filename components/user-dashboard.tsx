'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  CalendarDays, CheckCircle2, Home, LogOut,
  MessageCircle, Recycle, Trash2, User,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { COLLECTION_SCHEDULE, WASTE_TYPES } from '@/lib/ecorota/content'
import { UserProfileModal } from '@/components/user-profile-modal'
import dynamic from 'next/dynamic'

const EcorotaMap = dynamic(
  () => import('@/components/ecorota-map').then((m) => m.EcorotaMap),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-2xl border border-emerald-100 bg-emerald-50 h-[440px] flex items-center justify-center text-sm text-muted-foreground">
        Carregando mapa...
      </div>
    ),
  },
)

export type DashboardUser = {
  id: string
  email: string
  name?: string
  bairro?: string
  cep?: string
  coleta?: {
    days: string
    time: string
    note?: string
    truck?: {
      type: 'reciclavel' | 'organico' | 'misto'
      label: string
      color: string
      items: string[]
    }
  }
}

type UserDashboardProps = {
  user: DashboardUser
}

export function UserDashboard({ user }: UserDashboardProps) {
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])

  const [profileOpen, setProfileOpen] = useState(false)
  const [localUser, setLocalUser] = useState(user)

  const [checklist, setChecklist] = useState({
    paper: false, plastic: false, organic: false, glass: false,
  })

  const displayName = localUser.name || localUser.email.split('@')[0]
  const doneCount = Object.values(checklist).filter(Boolean).length

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const toggleCheck = (key: keyof typeof checklist) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-green-50">
      {/* Header */}
      <header className="border-b border-emerald-100 bg-white/90 backdrop-blur sticky top-0 z-40">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-lg bg-emerald-600 text-white">
              <Recycle className="size-4" />
            </span>
            <div>
              <p className="font-semibold text-emerald-950">Painel do morador</p>
              <p className="text-xs text-muted-foreground">
                {localUser.bairro ? localUser.bairro : 'Joinville · SC'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setProfileOpen(true)}
              className="gap-2 border-emerald-200 text-emerald-800 hover:bg-emerald-50 rounded-xl"
            >
              <User className="size-4" />
              Perfil
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="gap-2 border-emerald-200 text-emerald-800 hover:bg-emerald-50 rounded-xl"
            >
              <LogOut className="size-4" />
              <span className="hidden sm:inline">Sair</span>
            </Button>
            <Button asChild size="sm" variant="ghost" className="gap-2 text-emerald-700 hover:bg-emerald-50 rounded-xl">
              <Link href="/"><Home className="size-4" /><span className="hidden sm:inline">Início</span></Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Modal de perfil */}
      <UserProfileModal
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        currentName={localUser.name}
        currentCep={localUser.cep}
        currentBairro={localUser.bairro}
        onSaved={({ name, cep, bairro, coleta }) => {
          setLocalUser((prev) => ({
            ...prev,
            name: name || prev.name,
            cep: cep || prev.cep,
            bairro: bairro || prev.bairro,
            coleta: coleta ?? prev.coleta,
          }))
          router.refresh()
        }}
      />

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6">
        {/* Boas-vindas */}
        <section className="rounded-2xl bg-gradient-to-r from-emerald-700 to-emerald-900 px-6 py-7 text-white shadow-lg">
          <p className="text-sm text-emerald-300 mb-1">Bem-vindo de volta,</p>
          <h1 className="text-2xl font-semibold capitalize">{displayName}</h1>
          <p className="mt-2 text-sm text-emerald-100/75 max-w-lg">
            Acompanhe a coleta seletiva, organize seus resíduos e participe da
            reciclagem em Joinville.
          </p>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Próximas coletas */}
          <Card className="border-emerald-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emerald-950">
                <CalendarDays className="size-5 text-emerald-600" />
                Próximas coletas
              </CardTitle>
              <CardDescription>
                {localUser.bairro
                  ? <span>Bairro <strong className="text-emerald-700">{localUser.bairro}</strong>{localUser.cep ? ` · CEP ${localUser.cep.replace(/(\d{5})(\d{3})/, '$1-$2')}` : ''}</span>
                  : COLLECTION_SCHEDULE.subtitle}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                      {localUser.coleta ? (
                <div className="space-y-3">
                  {localUser.coleta.days.split(' e ').map((dia) => (
                    <div key={dia} className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CalendarDays className="size-4 text-emerald-600" />
                          <span className="font-semibold text-emerald-900 capitalize">{dia.trim()}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-100 rounded-full px-2.5 py-1">
                          🕐 {localUser.coleta!.time.replace('Manhã — ', '').replace('Tarde — ', '')}
                        </div>
                      </div>
                    </div>
                  ))}
                  {localUser.coleta.note && (
                    <p className="text-xs text-emerald-700/80 italic px-1">{localUser.coleta.note}</p>
                  )}
                  <div className="rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-3 space-y-1.5 mt-1">
                    <p className="text-xs font-semibold text-emerald-800">💡 Dicas para a coleta</p>
                    <ul className="space-y-1">
                      {[
                        'Coloque o lixo na calçada próximo ao horário de início',
                        'Separe recicláveis dos orgânicos em sacos diferentes',
                        'Lave embalagens antes de descartar',
                        'Não use sacos pretos para recicláveis',
                      ].map((dica) => (
                        <li key={dica} className="text-xs text-emerald-700 flex gap-1.5">
                          <span className="text-emerald-400 mt-0.5">•</span>{dica}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <>
                  {COLLECTION_SCHEDULE.days.map((day) => (
                    <div key={day.day} className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="font-semibold text-emerald-950">{day.day}</h3>
                        <Badge className="bg-emerald-600 hover:bg-emerald-600">{day.focus}</Badge>
                      </div>
                      <p className="mt-2 text-sm font-medium text-emerald-800">{day.time}</p>
                      <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                        {day.items.map((item) => (
                          <li key={item} className="flex gap-2">
                            <span className="text-emerald-600">•</span>{item}
                          </li>
                        ))}
                      </ul>
                      <p className="mt-3 text-xs text-emerald-800/80">{day.tip}</p>
                    </div>
                  ))}
                  <button
                    onClick={() => setProfileOpen(true)}
                    className="w-full text-left text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 hover:bg-amber-100 transition"
                  >
                    ⚠️ Horários gerais de Joinville. <span className="underline">Clique aqui para informar seu CEP</span> e ver os dias exatos do seu bairro.
                  </button>
                </>
              )}
            </CardContent>
          </Card>

          {/* Checklist */}
          <Card className="border-emerald-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emerald-950">
                <Trash2 className="size-5 text-emerald-600" />
                Separação desta semana
              </CardTitle>
              <CardDescription>Marque o que você já separou para a coleta.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { key: 'paper' as const,   label: 'Papel e papelão',        emoji: '📦' },
                { key: 'plastic' as const, label: 'Plásticos e embalagens', emoji: '♻️' },
                { key: 'organic' as const, label: 'Resíduos orgânicos',     emoji: '🌿' },
                { key: 'glass' as const,   label: 'Vidros e metais',        emoji: '🍶' },
              ].map(({ key, label, emoji }) => (
                <button
                  key={key}
                  onClick={() => toggleCheck(key)}
                  className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition ${
                    checklist[key]
                      ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
                      : 'border-gray-100 bg-white text-gray-700 hover:border-emerald-200'
                  }`}
                >
                  <span className="text-xl">{emoji}</span>
                  <span className="flex-1 text-sm font-medium">{label}</span>
                  {checklist[key] && <CheckCircle2 className="size-5 text-emerald-600" />}
                </button>
              ))}
              {doneCount > 0 && (
                <p className="text-center text-sm text-emerald-700 font-medium pt-1">
                  {doneCount === 4
                    ? '🎉 Tudo separado! Ótimo trabalho.'
                    : `${doneCount} de 4 itens separados`}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <EcorotaMap />

        {/* Card WhatsApp em breve */}
        <div className="rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50 p-5 flex items-start gap-4">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
            <MessageCircle className="size-5" />
          </span>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-semibold text-emerald-950">Lembretes por WhatsApp</p>
              <span className="rounded-full bg-emerald-600 px-2.5 py-0.5 text-xs font-medium text-white">Em breve</span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Em breve você poderá receber um aviso automático no WhatsApp na véspera de cada coleta —
              direto no seu celular, sem precisar abrir o site.
            </p>
          </div>
        </div>

        {/* Mapa */}
        {/* Tipos de resíduo */}
        <Card className="border-emerald-100 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-emerald-950">Tipos de resíduo</CardTitle>
            <CardDescription>Referência rápida para coleta seletiva em Joinville.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {WASTE_TYPES.map((type) => (
                <div key={type.name} className={`rounded-xl border p-4 ${type.color}`}>
                  <p className="font-semibold text-sm">{type.name}</p>
                  <p className="text-xs mt-1 opacity-80">{type.examples}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
