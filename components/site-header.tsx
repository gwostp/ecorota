'use client'

import Link from 'next/link'
import { Menu, Recycle, X } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { SITE } from '@/lib/ecorota/content'

type SiteHeaderProps = {
  userEmail?: string | null
  onLogout?: () => void
}

export function SiteHeader({ userEmail, onLogout }: SiteHeaderProps) {
  const [open, setOpen] = useState(false)

  const links = [
    { href: '#sobre', label: 'Projeto' },
    { href: '#coleta', label: 'Coleta' },
    { href: '#cadastro', label: 'Cadastro' },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-emerald-100/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-700 text-white shadow-md shadow-emerald-500/25">
            <Recycle className="size-5" />
          </span>
          <div>
            <p className="text-lg font-bold tracking-tight text-emerald-950">
              {SITE.name}
            </p>
            <p className="text-xs text-emerald-700">{SITE.tagline}</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-emerald-900/80 transition hover:text-emerald-700"
            >
              {link.label}
            </a>
          ))}
          {userEmail ? (
            <>
              <Link
                href="/painel"
                className="text-sm font-medium text-emerald-700 hover:underline"
              >
                Painel
              </Link>
              <Button variant="outline" size="sm" onClick={onLogout}>
                Sair
              </Button>
            </>
          ) : (
            <Button
              asChild
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <a href="#cadastro">Entrar</a>
            </Button>
          )}
        </nav>

        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-lg border border-emerald-100 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-emerald-100 px-4 py-4 md:hidden">
          <ul className="flex flex-col gap-3">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="block text-sm font-medium text-emerald-900"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
            {userEmail ? (
              <>
                <li>
                  <Link
                    href="/painel"
                    className="text-sm font-medium text-emerald-700"
                    onClick={() => setOpen(false)}
                  >
                    Painel
                  </Link>
                </li>
                <li>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      onLogout?.()
                      setOpen(false)
                    }}
                  >
                    Sair
                  </Button>
                </li>
              </>
            ) : (
              <li>
                <Button
                  asChild
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                >
                  <a href="#cadastro" onClick={() => setOpen(false)}>
                    Entrar
                  </a>
                </Button>
              </li>
            )}
          </ul>
        </nav>
      )}
    </header>
  )
}
