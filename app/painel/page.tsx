import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { UserDashboard, type DashboardUser } from '@/components/user-dashboard'
import { getColectaByBairro } from '@/lib/ecorota/content'

export default async function PainelPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/#cadastro')

  // Busca perfil com bairro salvo
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, bairro, cep')
    .eq('id', user.id)
    .single()

  const bairro = profile?.bairro || user.user_metadata?.bairro || ''
  const coleta = bairro ? getColectaByBairro(bairro) : null

  const dashboardUser: DashboardUser = {
    id: user.id,
    email: user.email ?? '',
    name: profile?.full_name || user.user_metadata?.full_name || undefined,
    bairro: bairro || undefined,
    cep: profile?.cep || user.user_metadata?.cep || undefined,
    coleta: coleta ?? undefined,
  }

  return <UserDashboard user={dashboardUser} />
}
