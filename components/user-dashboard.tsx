'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  CalendarDays,
  CheckCircle2,
  Home,
  LogOut,
  Recycle,
  Trash2,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { COLLECTION_SCHEDULE, WASTE_TYPES } from '@/lib/ecorota/content'

export type DashboardUser = {
  id: string
  email: string
  name?: string
}

export function UserDashboard({ user }: { user: DashboardUser }) {
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])
  const [checklist, setChecklist] = useState({
    paper: false,
    plastic: false,
    organic: false,
    glass: false,
  })

  const displayName = user.name || user.email.split('@')[0]

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const toggleCheck = (key: keyof typeof checklist) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const doneCount = Object.values(checklist).filter(Boolean).length

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-green-50">
      <header className="border-b border-emerald-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-lg bg-emerald-600 text-white">
              <Recycle className="size-4" />
            </span>
            <div>
              <p className="font-semibold text-emerald-950">Painel do morador</p>
              <p className="text-xs text-emerald-700">Joinville · EcoRota</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/">
                <Home className="size-4" />
                Início
              </Link>
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="size-4" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6 sm:py-10">
        <section className="rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-600 to-green-700 p-6 text-white shadow-lg sm:p-8">
          <p className="text-sm font-medium text-emerald-100">Olá,</p>
          <h1 className="mt-1 text-2xl font-bold sm:text-3xl">{displayName}</h1>
          <p className="mt-2 max-w-xl text-emerald-50/90">
            Acompanhe a coleta seletiva, organize seus resíduos e participe da
            reciclagem em Joinville.
          </p>
          <p className="mt-4 text-sm text-emerald-100">{user.email}</p>
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-emerald-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emerald-950">
                <CalendarDays className="size-5 text-emerald-600" />
                Próximas coletas
              </CardTitle>
              <CardDescription>
                {COLLECTION_SCHEDULE.subtitle}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {COLLECTION_SCHEDULE.days.map((day) => (
                <div
                  key={day.day}
                  className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-semibold text-emerald-950">{day.day}</h3>
                    <Badge className="bg-emerald-600 hover:bg-emerald-600">
                      {day.focus}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm font-medium text-emerald-800">
                    {day.time}
                  </p>
                  <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                    {day.items.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span className="text-emerald-600">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 text-xs text-emerald-800/80">{day.tip}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-emerald-100">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emerald-950">
                <Trash2 className="size-5 text-emerald-600" />
                Separação desta semana
              </CardTitle>
              <CardDescription>
                Marque o que você já separou para a coleta.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {(
                [
                  ['paper', 'Papel e papelão'],
                  ['plastic', 'Plásticos lavados'],
                  ['organic', 'Orgânicos (quinta)'],
                  ['glass', 'Vidros e metais (sábado)'],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggleCheck(key)}
                  className={`flex w-full items-center justify-between rounded-lg border px-4 py-3 text-left text-sm transition ${
                    checklist[key]
                      ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
                      : 'border-border bg-white hover:bg-emerald-50/40'
                  }`}
                >
                  <span>{label}</span>
                  {checklist[key] && (
                    <CheckCircle2 className="size-5 text-emerald-600" />
                  )}
                </button>
              ))}
              <p className="pt-2 text-sm text-muted-foreground">
                Progresso: {doneCount} de 4 categorias preparadas.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-emerald-100">
          <CardHeader>
            <CardTitle className="text-emerald-950">Tipos de resíduo</CardTitle>
            <CardDescription>
              Referência rápida para coleta seletiva em Joinville.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {WASTE_TYPES.map((type) => (
                <span
                  key={type.name}
                  className={`rounded-full px-3 py-1 text-sm font-medium ${type.color}`}
                >
                  {type.name}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
