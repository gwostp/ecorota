import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { UserDashboard, type DashboardUser } from '@/components/user-dashboard'
import { isWhatsAppAdmin } from '@/lib/whatsapp/config'

export default async function PainelPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/#cadastro')
  }

  const dashboardUser: DashboardUser = {
    id: user.id,
    email: user.email ?? '',
    name:
      typeof user.user_metadata?.full_name === 'string'
        ? user.user_metadata.full_name
        : undefined,
  }

  return (
    <UserDashboard
      user={dashboardUser}
      isWhatsAppAdmin={isWhatsAppAdmin(user.email)}
    />
  )
}
