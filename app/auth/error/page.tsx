import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function AuthErrorPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-emerald-50 to-white px-4">
      <Card className="w-full max-w-md border-emerald-200">
        <CardHeader>
          <CardTitle>Erro na autenticação</CardTitle>
          <CardDescription>
            Não foi possível concluir o login no EcoRota Joinville. Tente
            novamente pelo cadastro na página inicial.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-700">
            <Link href="/#cadastro">Voltar ao EcoRota</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
