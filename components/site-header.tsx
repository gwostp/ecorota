'use client'

import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { EcoRotaLogo } from '@/components/ecorota-logo'
import { SITE } from '@/lib/ecorota/content'

type SiteHeaderProps = {
  userEmail?: string | null
  onLogout?: () => void
}

export function SiteHeader({ userEmail, onLogout }: SiteHeaderProps) {
  const [open, setOpen] = useState(false)

  const allLinks = [
    { href: '#sobre', label: 'Projeto' },
    { href: '#coleta', label: 'Coleta' },
    { href: '#cadastro', label: 'Cadastro', hideWhenLoggedIn: true },
  ]
  const links = allLinks.filter(l => !(l.hideWhenLoggedIn && userEmail))

  return (
    <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur-xl" style={{ borderColor: '#c2e0a2' }}>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 sm:px-8">
        <Link href="/" className="flex items-center group">
          <EcoRotaLogo size="sm" />
        </Link>

        {/* Nav desktop */}
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-green-50"
              style={{ color: '#2d6a2d' }}
            >
              {link.label}
            </a>
          ))}
          <div className="mx-3 h-5 w-px" style={{ background: '#c2e0a2' }} />
          {userEmail ? (
            <>
              <Link
                href="/painel"
                className="rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-green-50"
                style={{ color: '#3d8c3d' }}
              >
                Painel
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={onLogout}
                className="rounded-xl"
                style={{ borderColor: '#c2e0a2', color: '#2d6a2d' }}
              >
                Sair
              </Button>
            </>
          ) : (
            <Button
              asChild
              size="sm"
              className="rounded-xl px-4 text-white shadow-sm"
              style={{ background: '#2d6a2d' }}
            >
              <a href="#cadastro">Entrar</a>
            </Button>
          )}
        </nav>

        {/* Hambúrguer mobile */}
        <button
          type="button"
          className="inline-flex size-9 items-center justify-center rounded-xl border bg-white transition hover:bg-green-50 md:hidden"
          style={{ borderColor: '#c2e0a2', color: '#2d6a2d' }}
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? <X className="size-4" /> : <Menu className="size-4" />}
        </button>
      </div>

      {/* Menu mobile */}
      {open && (
        <nav className="animate-fade-in border-t bg-white px-5 pb-5 pt-4 md:hidden" style={{ borderColor: '#c2e0a2' }}>
          <ul className="flex flex-col gap-1">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="block rounded-xl px-4 py-3 text-sm font-medium transition hover:bg-green-50"
                  style={{ color: '#2d6a2d' }}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className="mt-2 border-t pt-3" style={{ borderColor: '#d4edca' }}>
              {userEmail ? (
                <div className="flex flex-col gap-2">
                  <Link href="/painel" className="rounded-xl px-4 py-3 text-sm font-medium text-center" style={{ background: '#eaf6e0', color: '#2d6a2d' }} onClick={() => setOpen(false)}>
                    Painel
                  </Link>
                  <Button variant="outline" size="sm" className="w-full" onClick={() => { onLogout?.(); setOpen(false) }}>Sair</Button>
                </div>
              ) : (
                <Button asChild className="w-full text-white" style={{ background: '#2d6a2d' }}>
                  <a href="#cadastro" onClick={() => setOpen(false)}>Entrar</a>
                </Button>
              )}
            </li>
          </ul>
        </nav>
      )}
    </header>
  )
}
