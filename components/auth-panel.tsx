'use client'

import { useMemo, useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { MapPin, Clock, CalendarDays, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'

type ColectaInfo = {
  days: string
  time: string
  note?: string
}

type CepResult = {
  bairro: string
  logradouro: string
  cidade: string
  coleta: ColectaInfo
}

type AuthPanelProps = {
  defaultTab?: 'login' | 'signup'
  onAuthSuccess?: () => void
}

export function AuthPanel({ defaultTab = 'login', onAuthSuccess }: AuthPanelProps) {
  const router = useRouter()
  const supabase = useMemo(() => createClient(), [])

  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')

  const [signupName, setSignupName] = useState('')
  const [signupEmail, setSignupEmail] = useState('')
  const [signupPassword, setSignupPassword] = useState('')
  const [signupCep, setSignupCep] = useState('')

  const [cepLoading, setCepLoading] = useState(false)
  const [cepResult, setCepResult] = useState<CepResult | null>(null)
  const [cepError, setCepError] = useState<string | null>(null)
  const cepTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearFeedback = () => { setMessage(null); setError(null) }

  // Busca CEP automaticamente ao digitar
  useEffect(() => {
    const digits = signupCep.replace(/\D/g, '')
    if (digits.length < 8) {
      setCepResult(null)
      setCepError(null)
      return
    }

    if (cepTimeout.current) clearTimeout(cepTimeout.current)
    cepTimeout.current = setTimeout(async () => {
      setCepLoading(true)
      setCepError(null)
      setCepResult(null)
      try {
        const res = await fetch(`/api/cep?cep=${digits}`)
        const data = await res.json()
        if (data.ok) {
          setCepResult(data)
        } else {
          setCepError(data.error ?? 'CEP não encontrado')
        }
      } catch {
        setCepError('Erro ao buscar CEP')
      } finally {
        setCepLoading(false)
      }
    }, 500)

    return () => { if (cepTimeout.current) clearTimeout(cepTimeout.current) }
  }, [signupCep])

  const formatCep = (v: string) => {
    const d = v.replace(/\D/g, '').slice(0, 8)
    return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    clearFeedback()
    setSubmitting(true)
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: loginEmail.trim(),
      password: loginPassword,
    })
    setSubmitting(false)
    if (authError) { setError(authError.message); return }
    onAuthSuccess?.()
    router.push('/painel')
    router.refresh()
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    clearFeedback()
    setSubmitting(true)

    const { error: authError } = await supabase.auth.signUp({
      email: signupEmail.trim(),
      password: signupPassword,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/painel`,
        data: {
          full_name: signupName.trim() || undefined,
          cep: signupCep.replace(/\D/g, '') || undefined,
          bairro: cepResult?.bairro || undefined,
          city: 'Joinville',
        },
      },
    })

    setSubmitting(false)
    if (authError) { setError(authError.message); return }
    setMessage('Cadastro realizado! Confira seu e-mail para confirmar a conta e depois acesse o painel.')
    onAuthSuccess?.()
  }

  return (
    <Card id="cadastro" className="scroll-mt-24 border-emerald-200/60 shadow-2xl shadow-emerald-900/8 rounded-2xl overflow-hidden">
      <CardHeader className="bg-gradient-to-br from-emerald-700 to-emerald-900 px-6 py-6 text-white">
        <CardTitle className="font-display text-2xl font-normal">Cadastro e login</CardTitle>
        <CardDescription className="text-emerald-200/90 text-sm mt-1">
          Crie sua conta gratuita ou acesse o painel do morador.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {error && (
          <Alert variant="destructive" className="rounded-xl">
            <AlertCircle className="size-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {message && (
          <Alert className="rounded-xl border-emerald-200 bg-emerald-50">
            <CheckCircle2 className="size-4 text-emerald-600" />
            <AlertDescription className="text-emerald-800">{message}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue={defaultTab} className="w-full" onValueChange={clearFeedback}>
          <TabsList className="grid h-11 w-full grid-cols-2 rounded-xl bg-emerald-50 p-1">
            <TabsTrigger value="login" className="rounded-lg text-sm data-[state=active]:bg-white data-[state=active]:text-emerald-900 data-[state=active]:shadow-sm">
              Entrar
            </TabsTrigger>
            <TabsTrigger value="signup" className="rounded-lg text-sm data-[state=active]:bg-white data-[state=active]:text-emerald-900 data-[state=active]:shadow-sm">
              Cadastrar
            </TabsTrigger>
          </TabsList>

          {/* Login */}
          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4 pt-3">
              <div className="space-y-1.5">
                <Label htmlFor="login-email" className="text-sm font-medium text-emerald-950">E-mail</Label>
                <Input id="login-email" type="email" autoComplete="email" required value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)} placeholder="voce@email.com"
                  className="rounded-xl border-emerald-200 focus-visible:ring-emerald-500 h-11" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="login-password" className="text-sm font-medium text-emerald-950">Senha</Label>
                <Input id="login-password" type="password" autoComplete="current-password" required minLength={6}
                  value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="••••••••"
                  className="rounded-xl border-emerald-200 focus-visible:ring-emerald-500 h-11" />
              </div>
              <Button type="submit" className="w-full h-11 bg-emerald-700 hover:bg-emerald-600 rounded-xl font-medium shadow-sm" disabled={submitting}>
                {submitting ? <><Loader2 className="size-4 animate-spin mr-2" />Entrando...</> : 'Entrar no EcoRota'}
              </Button>
            </form>
          </TabsContent>

          {/* Cadastro */}
          <TabsContent value="signup">
            <form onSubmit={handleSignup} className="space-y-4 pt-3">
              <div className="space-y-1.5">
                <Label htmlFor="signup-name" className="text-sm font-medium text-emerald-950">Nome completo</Label>
                <Input id="signup-name" type="text" autoComplete="name" value={signupName}
                  onChange={(e) => setSignupName(e.target.value)} placeholder="Seu nome"
                  className="rounded-xl border-emerald-200 focus-visible:ring-emerald-500 h-11" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="signup-email" className="text-sm font-medium text-emerald-950">E-mail</Label>
                <Input id="signup-email" type="email" autoComplete="email" required value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)} placeholder="voce@email.com"
                  className="rounded-xl border-emerald-200 focus-visible:ring-emerald-500 h-11" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="signup-password" className="text-sm font-medium text-emerald-950">Senha</Label>
                <Input id="signup-password" type="password" autoComplete="new-password" required minLength={6}
                  value={signupPassword} onChange={(e) => setSignupPassword(e.target.value)} placeholder="Mínimo 6 caracteres"
                  className="rounded-xl border-emerald-200 focus-visible:ring-emerald-500 h-11" />
              </div>

              {/* CEP */}
              <div className="space-y-1.5">
                <Label htmlFor="signup-cep" className="text-sm font-medium text-emerald-950">
                  CEP <span className="text-muted-foreground font-normal">(opcional)</span>
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-emerald-500" />
                  <Input
                    id="signup-cep"
                    type="text"
                    inputMode="numeric"
                    value={signupCep}
                    onChange={(e) => setSignupCep(formatCep(e.target.value))}
                    placeholder="00000-000"
                    maxLength={9}
                    className="rounded-xl border-emerald-200 focus-visible:ring-emerald-500 h-11 pl-9"
                  />
                  {cepLoading && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-emerald-500 animate-spin" />
                  )}
                </div>

                {/* Resultado do CEP */}
                {cepResult && (
                  <div className="animate-fade-up rounded-xl border border-emerald-200 bg-emerald-50 p-4 space-y-3">
                    <div className="flex items-start gap-2.5">
                      <MapPin className="size-4 text-emerald-600 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-emerald-900">{cepResult.bairro || 'Bairro não informado'}</p>
                        {cepResult.logradouro && (
                          <p className="text-xs text-emerald-700 mt-0.5">{cepResult.logradouro}, {cepResult.cidade}</p>
                        )}
                      </div>
                    </div>
                    <div className="border-t border-emerald-200/60 pt-3 space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Coleta no seu bairro</p>
                      <div className="flex items-center gap-2">
                        <CalendarDays className="size-3.5 text-emerald-600 shrink-0" />
                        <span className="text-sm text-emerald-900 font-medium">{cepResult.coleta.days}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="size-3.5 text-emerald-600 shrink-0" />
                        <span className="text-sm text-emerald-900">{cepResult.coleta.time}</span>
                      </div>
                      {cepResult.coleta.note && (
                        <p className="text-xs text-emerald-700/80 italic">{cepResult.coleta.note}</p>
                      )}
                    </div>
                  </div>
                )}

                {cepError && (
                  <p className="flex items-center gap-1.5 text-xs text-red-600 mt-1">
                    <AlertCircle className="size-3.5" />{cepError}
                  </p>
                )}
              </div>

              <Button type="submit" className="w-full h-11 bg-emerald-700 hover:bg-emerald-600 rounded-xl font-medium shadow-sm" disabled={submitting}>
                {submitting ? <><Loader2 className="size-4 animate-spin mr-2" />Cadastrando...</> : 'Criar conta gratuita'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
