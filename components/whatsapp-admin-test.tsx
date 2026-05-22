'use client'

import { useState } from 'react'
import { MessageCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

function formatApiError(data: Record<string, unknown>): string {
  if (typeof data.error === 'string' && data.error) {
    return data.error
  }
  if (data.metaError) {
    return typeof data.metaError === 'string'
      ? data.metaError
      : JSON.stringify(data.metaError, null, 2)
  }
  if (data.metaResponse) {
    return JSON.stringify(data.metaResponse, null, 2)
  }
  return JSON.stringify(data, null, 2)
}

export function WhatsAppAdminTest() {
  const [nome, setNome] = useState('Morador teste')
  const [telefone, setTelefone] = useState('')
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  const handleSendTest = async () => {
    setLoading(true)
    setFeedback(null)

    if (!nome.trim() || !telefone.trim()) {
      setFeedback({
        type: 'error',
        text: 'Preencha nome e telefone para o teste.',
      })
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/send-whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          nome: nome.trim(),
          telefone: telefone.trim(),
        }),
      })

      const data = (await res.json()) as Record<string, unknown>

      // Sucesso apenas se a Meta confirmou (success === true)
      if (res.ok && data.success === true) {
        const waId =
          (data.metaResponse as { messages?: { id: string }[] })?.messages?.[0]
            ?.id ?? ''
        setFeedback({
          type: 'success',
          text: `Enviado para ${String(data.telefone)}.${waId ? ` ID Meta: ${waId}` : ''}`,
        })
        return
      }

      const statusPart = res.status ? `HTTP ${res.status}. ` : ''
      setFeedback({
        type: 'error',
        text: `${statusPart}${formatApiError(data)}`,
      })
    } catch (err) {
      setFeedback({
        type: 'error',
        text: err instanceof Error ? err.message : 'Falha na requisição',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border-emerald-200 bg-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-emerald-950">
          <MessageCircle className="size-5 text-emerald-600" />
          Testar envio WhatsApp
        </CardTitle>
        <CardDescription>
          API Meta v25.0 — número de teste cadastrado em WhatsApp → API Setup →
          To. Formato: 5547992313578
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="wa-nome">Nome</Label>
            <Input
              id="wa-nome"
              placeholder="Maria"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="wa-telefone">Telefone</Label>
            <Input
              id="wa-telefone"
              placeholder="5547992313578"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
            />
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Use o mesmo número adicionado como test recipient na Meta (com 55 +
          DDD).
        </p>

        {feedback && (
          <Alert variant={feedback.type === 'error' ? 'destructive' : 'default'}>
            <AlertDescription className="break-words whitespace-pre-wrap text-sm">
              {feedback.text}
            </AlertDescription>
          </Alert>
        )}

        <Button
          type="button"
          className="w-full bg-emerald-600 hover:bg-emerald-700"
          disabled={loading}
          onClick={handleSendTest}
        >
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <MessageCircle className="size-4" />
              Testar envio WhatsApp
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
