import { cn } from '@/lib/utils'

type LogoProps = {
  className?: string
  iconOnly?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export function EcoRotaLogo({ className, iconOnly = false, size = 'md' }: LogoProps) {
  const scales = { sm: 0.6, md: 1, lg: 1.4 }
  const s = scales[size]

  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      {/* Caminhão SVG */}
      <svg
        width={Math.round(52 * s)}
        height={Math.round(36 * s)}
        viewBox="0 0 52 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Corpo do caminhão */}
        <rect x="1" y="6" width="34" height="22" rx="3" fill="#2d6a2d" stroke="#1a4a1a" strokeWidth="1.2"/>
        {/* Cabine */}
        <rect x="35" y="12" width="15" height="16" rx="2.5" fill="#2d6a2d" stroke="#1a4a1a" strokeWidth="1.2"/>
        {/* Janela cabine */}
        <rect x="37" y="14" width="10" height="7" rx="1.5" fill="#a8d8a8" opacity="0.8"/>
        {/* Para-choque */}
        <rect x="48" y="22" width="3" height="4" rx="1" fill="#1a4a1a"/>
        {/* Roda traseira */}
        <circle cx="11" cy="30" r="5" fill="#1a4a1a"/>
        <circle cx="11" cy="30" r="2.5" fill="#4a9a4a"/>
        {/* Roda dianteira */}
        <circle cx="40" cy="30" r="5" fill="#1a4a1a"/>
        <circle cx="40" cy="30" r="2.5" fill="#4a9a4a"/>
        {/* Símbolo reciclagem no corpo */}
        <text x="18" y="21" textAnchor="middle" fontSize="13" fill="#a8d8a8">♻</text>
      </svg>

      {/* Nome EcoRota */}
      {!iconOnly && (
        <div className="flex items-baseline leading-none">
          <span
            style={{
              fontFamily: '"DM Serif Display", Georgia, serif',
              fontSize: `${Math.round(22 * s)}px`,
              color: '#6aaa3a',
              letterSpacing: '-0.02em',
              lineHeight: 1,
            }}
          >
            Eco
          </span>
          <span
            style={{
              fontFamily: '"DM Serif Display", Georgia, serif',
              fontSize: `${Math.round(22 * s)}px`,
              color: '#1a4a1a',
              letterSpacing: '-0.02em',
              lineHeight: 1,
            }}
          >
            Rota
          </span>
        </div>
      )}
    </div>
  )
}
