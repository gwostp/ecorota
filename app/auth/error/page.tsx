import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'

type PageProps = {
  searchParams: Promise<{ message?: string }>
}

export default async function AuthErrorPage({ searchParams }: PageProps) {
  const params = await searchParams
  const message = params.message
    ? decodeURIComponent(params.message)
    : null

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-emerald-50 to-white px-4">
      <Card className="w-full max-w-lg border-emerald-200">
        <CardHeader>
          <CardTitle>Erro na autenticação</CardTitle>
          <CardDescription>
            Não foi possível confirmar seu e-mail ou concluir o login. Isso
            geralmente é corrigido ajustando o Supabase ou tentando entrar de
            novo.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {message && (
            <Alert variant="destructive">
              <AlertDescription className="break-words text-sm">
                {message}
              </AlertDescription>
            </Alert>
          )}

          <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
            <li>
              No Supabase: Authentication → URL Configuration — adicione{' '}
              <code className="rounded bg-emerald-50 px-1 text-xs">
                http://localhost:3000/auth/callback
              </code>{' '}
              em Redirect URLs (e a URL de produção, se houver).
            </li>
            <li>
              Se o e-mail já foi confirmado, use{' '}
              <strong>Entrar</strong> na página inicial com e-mail e senha.
            </li>
            <li>
              Link expirado: cadastre-se novamente ou peça novo e-mail de
              confirmação no Supabase (Authentication → Users).
            </li>
          </ul>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button
              asChild
              className="flex-1 bg-emerald-600 hover:bg-emerald-700"
            >
              <Link href="/#cadastro">Ir para cadastro / login</Link>
            </Button>
            <Button asChild variant="outline" className="flex-1">
              <Link href="/">Página inicial</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
