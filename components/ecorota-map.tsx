'use client'

import { useEffect, useRef, useState } from 'react'
import { Truck } from 'lucide-react'

const TRUCK_ROUTES = [
  {
    id: 1,
    color: '#059669',
    label: 'Zona Norte',
    path: [[-26.295,-48.845],[-26.292,-48.840],[-26.288,-48.837],[-26.285,-48.842],[-26.289,-48.848],[-26.295,-48.845]],
  },
  {
    id: 2,
    color: '#0891b2',
    label: 'Centro',
    path: [[-26.304,-48.850],[-26.300,-48.844],[-26.306,-48.840],[-26.310,-48.846],[-26.307,-48.852],[-26.304,-48.850]],
  },
  {
    id: 3,
    color: '#7c3aed',
    label: 'Zona Sul',
    path: [[-26.318,-48.855],[-26.314,-48.849],[-26.320,-48.843],[-26.325,-48.848],[-26.321,-48.857],[-26.318,-48.855]],
  },
]

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

export function EcorotaMap() {
  const containerRef = useRef<HTMLDivElement>(null)
  const initializedRef = useRef(false)
  const cleanupRef = useRef<(() => void) | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // Evita dupla inicialização (React StrictMode)
    if (initializedRef.current) return
    if (!containerRef.current) return
    initializedRef.current = true

    let map: any = null
    let animFrame = 0
    const progress = TRUCK_ROUTES.map(() => Math.random())

    import('leaflet').then((L) => {
      if (!containerRef.current || !initializedRef.current) return

      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })

      map = L.map(containerRef.current, {
        center: [-26.305, -48.848],
        zoom: 14,
        zoomControl: true,
        scrollWheelZoom: true,
      })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map)

      TRUCK_ROUTES.forEach((route) => {
        L.polyline(route.path as [number, number][], {
          color: route.color, weight: 3, opacity: 0.5, dashArray: '6, 8',
        }).addTo(map)
      })

      const createIcon = (color: string) =>
        L.divIcon({
          className: '',
          html: `<div style="background:${color};border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.25);border:2px solid white;">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M10 17H2V5h12v12h-4z"/><path d="M14 9h4l2 4v4h-6V9z"/>
              <circle cx="6.5" cy="17.5" r="1.5"/><circle cx="18.5" cy="17.5" r="1.5"/>
            </svg>
          </div>`,
          iconSize: [36, 36],
          iconAnchor: [18, 18],
        })

      const markers = TRUCK_ROUTES.map((route) => {
        const [lat, lng] = route.path[0] as [number, number]
        return L.marker([lat, lng], { icon: createIcon(route.color) }).addTo(map)
      })

      setReady(true)

      let lastTime = performance.now()
      const SPEED = 0.04

      function animate(now: number) {
        const dt = (now - lastTime) / 1000
        lastTime = now

        TRUCK_ROUTES.forEach((route, i) => {
          progress[i] = (progress[i] + dt * SPEED) % 1
          const steps = route.path.length - 1
          const seg = Math.floor(progress[i] * steps)
          const t = (progress[i] * steps) % 1
          const [lat1, lng1] = route.path[Math.min(seg, steps - 1)] as [number, number]
          const [lat2, lng2] = route.path[Math.min(seg + 1, steps)] as [number, number]
          markers[i].setLatLng([lerp(lat1, lat2, t), lerp(lng1, lng2, t)])
        })

        animFrame = requestAnimationFrame(animate)
      }

      animFrame = requestAnimationFrame(animate)

      cleanupRef.current = () => {
        cancelAnimationFrame(animFrame)
        map?.remove()
        map = null
      }
    })

    return () => {
      initializedRef.current = false
      cleanupRef.current?.()
      cleanupRef.current = null
    }
  }, [])

  return (
    <div className="rounded-2xl border border-emerald-100 overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-5 py-4 bg-white border-b border-emerald-100">
        <div className="flex items-center gap-2">
          <Truck className="size-5 text-emerald-600" />
          <div>
            <p className="font-semibold text-emerald-950 text-sm">Rastreamento de coleta</p>
            <p className="text-xs text-muted-foreground">Joinville · Visualização ilustrativa</p>
          </div>
        </div>
        <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800">Em breve</span>
      </div>

      <div className="relative">
        <div ref={containerRef} style={{ height: 380 }} className="w-full bg-emerald-50" />

        {ready && (
          <div className="absolute bottom-3 left-3 z-[1000] rounded-xl bg-white/90 backdrop-blur px-3 py-2 shadow text-xs space-y-1">
            {TRUCK_ROUTES.map((r) => (
              <div key={r.id} className="flex items-center gap-2">
                <span className="inline-block size-3 rounded-full" style={{ background: r.color }} />
                <span className="text-muted-foreground">{r.label}</span>
              </div>
            ))}
          </div>
        )}

        {ready && (
          <div className="absolute top-3 right-3 z-[1000] rounded-xl bg-white/90 backdrop-blur px-3 py-2 shadow text-xs text-muted-foreground max-w-[180px] text-center leading-snug">
            🚛 Rotas ilustrativas — em breve com rastreamento real
          </div>
        )}
      </div>
    </div>
  )
}
