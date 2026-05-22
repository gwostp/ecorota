# EcoRota Joinville

Sistema de coleta seletiva e reciclagem — Next.js + Supabase + WhatsApp Cloud API (Meta).

## Getting Started

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Variáveis de ambiente

Copie `.env.example` para `.env.local` (não commite segredos):

| Variável | Uso |
|----------|-----|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase (client) |
| `SUPABASE_SERVICE_ROLE_KEY` | Cron — lista `profiles` |
| `WHATSAPP_TOKEN` | Token permanente Meta |
| `WHATSAPP_PHONE_NUMBER_ID` | ID do número WhatsApp |
| `VERIFY_TOKEN` | Webhook — verificação Meta |
| `CRON_SECRET` | Proteção `/api/cron/coleta` |
| `WHATSAPP_ADMIN_EMAILS` | Opcional — botão teste no painel |

## Confirmação de e-mail (Supabase)

Em **Authentication → URL Configuration**:

- **Site URL:** `http://localhost:3000` (dev) ou sua URL de produção
- **Redirect URLs:** inclua `http://localhost:3000/auth/callback` e `https://SEU-DOMINIO/auth/callback`

Sem isso, o link do e-mail falha e cai em `/auth/error`.

## Supabase — tabela profiles

Execute `supabase/migrations/001_profiles.sql` no SQL Editor do Supabase.

Moradores com `phone` preenchido recebem WhatsApp no cron (quinta/sábado).

## WhatsApp Cloud API (Meta oficial)

### Envio manual

`POST /api/send-whatsapp` — body `{ "nome": "Maria", "telefone": "47999999999" }`  
Requer admin logado (`WHATSAPP_ADMIN_EMAILS`) ou `Authorization: Bearer CRON_SECRET`.

### Cron coleta

`GET /api/cron/coleta` — quinta e sábado, 8h Joinville (agendado na Vercel).  
Auth: `Authorization: Bearer CRON_SECRET` ou `?secret=CRON_SECRET`.

Teste local: `http://localhost:3000/api/cron/coleta?force=thursday&secret=SEU_CRON_SECRET`

### Webhook Meta

| Campo Meta | Valor |
|------------|--------|
| **Callback URL** | `https://SEU-DOMINIO.vercel.app/api/whatsapp/webhook` |
| **Verify Token** | mesmo que `VERIFY_TOKEN` no `.env` |

Arquivo: `app/api/whatsapp/webhook/route.ts` (GET verificação + POST eventos).

### Painel admin

`/painel` → **Testar envio WhatsApp** (nome + telefone).
