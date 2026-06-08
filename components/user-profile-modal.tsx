'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog'
import { MapPin, Clock, CalendarDays, Loader2, CheckCircle2, AlertCircle, User } from 'lucide-react'

type ColectaInfo = { days: string; time: string; note?: string }
type CepResult = { bairro: string; logradouro: string; cidade: string; coleta: ColectaInfo }

type Props = {
  open: boolean
  onClose: () => void
  currentName?: string
  currentCep?: string
  currentBairro?: string
  onSaved: (data: { name: string; cep: string; bairro: string; coleta: ColectaInfo | null }) => void
}

export function UserProfileModal({ open, onClose, currentName, currentCep, currentBairro, onSaved }: Props) {
  const supabase = createClient()
  const [name, setName] = useState(currentName ?? '')
  const [cep, setCep] = useState(currentCep ? currentCep.replace(/(\d{5})(\d{3})/, '$1-$2') : '')
  const [cepLoading, setCepLoading] = useState(false)
  const [cepResult, setCepResult] = useState<CepResult | null>(null)
  const [cepError, setCepError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const cepTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Pré-carrega dados se já tiver bairro
  useEffect(() => {
    if (currentBairro && currentCep) {
      setCepResult({
        bairro: currentBairro,
        logradouro: '',
        cidade: 'Joinville',
        coleta: { days: '', time: '' },
      })
      // Busca os dias atuais
      const digits = currentCep.replace(/\D/g, '')
      if (digits.length === 8) {
        fetch(`/api/cep?cep=${digits}`)
          .then(r => r.json())
          .then(d => { if (d.ok) setCepResult(d) })
      }
    }
  }, [currentBairro, currentCep])

  const formatCep = (v: string) => {
    const d = v.replace(/\D/g, '').slice(0, 8)
    return d.length > 5 ? `${d.slice(0, 5)}-${d.slice(5)}` : d
  }

  useEffect(() => {
    const digits = cep.replace(/\D/g, '')
    if (digits.length < 8) {
      if (!currentBairro) { setCepResult(null); setCepError(null) }
      return
    }
    if (cepTimeout.current) clearTimeout(cepTimeout.current)
    cepTimeout.current = setTimeout(async () => {
      setCepLoading(true)
      setCepError(null)
      try {
        const res = await fetch(`/api/cep?cep=${digits}`)
        const data = await res.json()
        if (data.ok) { setCepResult(data); setCepError(null) }
        else setCepError(data.error ?? 'CEP não encontrado')
      } catch {
        setCepError('Erro ao buscar CEP')
      } finally {
        setCepLoading(false)
      }
    }, 500)
    return () => { if (cepTimeout.current) clearTimeout(cepTimeout.current) }
  }, [cep])

  const handleSave = async () => {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setSaving(false); return }

    const digits = cep.replace(/\D/g, '')
    const bairro = cepResult?.bairro ?? currentBairro ?? ''

    await supabase.from('profiles').upsert({
      id: user.id,
      full_name: name.trim(),
      cep: digits || null,
      bairro: bairro || null,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'id' })

    await supabase.auth.updateUser({
      data: { full_name: name.trim(), cep: digits, bairro },
    })

    setSaving(false)
    setSaved(true)
    setTimeout(() => {
      setSaved(false)
      onSaved({ name: name.trim(), cep: digits, bairro, coleta: cepResult?.coleta ?? null })
      onClose()
    }, 1000)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="rounded-2xl border-emerald-100 max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-emerald-950">
            <User className="size-5 text-emerald-600" /> Meu perfil
          </DialogTitle>
          <DialogDescription>Atualize suas informações e CEP para ver a coleta do seu bairro.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Nome */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-emerald-950">Nome</Label>
            <Input value={name} onChange={e => setName(e.target.value)}
              placeholder="Seu nome" className="rounded-xl border-emerald-200 h-11" />
          </div>

          {/* CEP */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium text-emerald-950">CEP</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-emerald-500" />
              <Input
                value={cep}
                onChange={e => setCep(formatCep(e.target.value))}
                placeholder="00000-000"
                maxLength={9}
                inputMode="numeric"
                className="rounded-xl border-emerald-200 h-11 pl-9"
              />
              {cepLoading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-emerald-500 animate-spin" />}
            </div>

            {cepResult && cepResult.coleta?.days && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 space-y-2 animate-fade-up">
                <div className="flex items-center gap-2">
                  <MapPin className="size-3.5 text-emerald-600" />
                  <span className="text-sm font-semibold text-emerald-900">{cepResult.bairro}</span>
                </div>
                <div className="border-t border-emerald-200/60 pt-2 space-y-1.5">
                  <div className="flex items-center gap-2 text-sm text-emerald-800">
                    <CalendarDays className="size-3.5 text-emerald-600" />
                    <span className="font-medium">{cepResult.coleta.days}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-emerald-700">
                    <Clock className="size-3.5 text-emerald-600" />
                    {cepResult.coleta.time}
                  </div>
                </div>
              </div>
            )}

            {cepError && (
              <p className="flex items-center gap-1.5 text-xs text-red-600">
                <AlertCircle className="size-3.5" />{cepError}
              </p>
            )}
          </div>

          <Button
            onClick={handleSave}
            disabled={saving || saved}
            className="w-full h-11 bg-emerald-700 hover:bg-emerald-600 rounded-xl font-medium"
          >
            {saved
              ? <><CheckCircle2 className="size-4 mr-2" />Salvo!</>
              : saving
              ? <><Loader2 className="size-4 mr-2 animate-spin" />Salvando...</>
              : 'Salvar alterações'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
