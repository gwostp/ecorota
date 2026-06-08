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
    <header className="sticky top-0 z-50 border-b border-emerald-100/60 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 sm:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <span className="flex size-9 items-center justify-center rounded-xl bg-emerald-700 text-white shadow-md shadow-emerald-700/30 transition group-hover:bg-emerald-600">
            <Recycle className="size-4.5" />
          </span>
          <div>
            <p className="font-display text-[1.05rem] font-normal leading-none text-emerald-950 tracking-tight">
              {SITE.name}
            </p>
            <p className="text-[0.65rem] text-emerald-600 tracking-wide uppercase font-medium mt-0.5">
              Joinville · SC
            </p>
          </div>
        </Link>

        {/* Nav desktop */}
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-emerald-900/70 transition hover:bg-emerald-50 hover:text-emerald-800"
            >
              {link.label}
            </a>
          ))}
          <div className="mx-3 h-5 w-px bg-emerald-100" />
          {userEmail ? (
            <>
              <Link
                href="/painel"
                className="rounded-lg px-3 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-50"
              >
                Painel
              </Link>
              <Button
                variant="outline"
                size="sm"
                onClick={onLogout}
                className="border-emerald-200 text-emerald-800 hover:bg-emerald-50 hover:border-emerald-300"
              >
                Sair
              </Button>
            </>
          ) : (
            <Button
              asChild
              size="sm"
              className="bg-emerald-700 hover:bg-emerald-600 text-white shadow-sm shadow-emerald-700/20 rounded-xl px-4"
            >
              <a href="#cadastro">Entrar</a>
            </Button>
          )}
        </nav>

        {/* Hambúrguer mobile */}
        <button
          type="button"
          className="inline-flex size-9 items-center justify-center rounded-xl border border-emerald-100 bg-white text-emerald-800 transition hover:bg-emerald-50 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? <X className="size-4" /> : <Menu className="size-4" />}
        </button>
      </div>

      {/* Menu mobile */}
      {open && (
        <nav className="animate-fade-in border-t border-emerald-100 bg-white px-5 pb-5 pt-4 md:hidden">
          <ul className="flex flex-col gap-1">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="block rounded-xl px-4 py-3 text-sm font-medium text-emerald-900 transition hover:bg-emerald-50"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className="mt-2 border-t border-emerald-50 pt-3">
              {userEmail ? (
                <div className="flex flex-col gap-2">
                  <Link
                    href="/painel"
                    className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 text-center"
                    onClick={() => setOpen(false)}
                  >
                    Painel
                  </Link>
                  <Button variant="outline" size="sm" className="w-full" onClick={() => { onLogout?.(); setOpen(false) }}>
                    Sair
                  </Button>
                </div>
              ) : (
                <Button asChild className="w-full bg-emerald-700 hover:bg-emerald-600">
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
