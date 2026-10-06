'use client'

import { useEffect, useState } from 'react'
import {
  CalendarClock,
  Film,
  ImageIcon,
  Loader2,
  Mail,
  MapPin,
  MonitorPlay,
} from 'lucide-react'
import { api, type EventLocation, type GalleryVideo, type HeroSettings, type Subscriber } from './types'

interface Stats {
  hero: HeroSettings | null
  videos: GalleryVideo[]
  locations: EventLocation[]
  subscribers: Subscriber[]
}

export function OverviewTab({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api<{ hero: HeroSettings | null }>('/api/admin/hero'),
      api<{ videos: GalleryVideo[] }>('/api/admin/videos'),
      api<{ locations: EventLocation[] }>('/api/admin/locations'),
      api<{ subscribers: Subscriber[] }>('/api/admin/subscribers'),
    ])
      .then(([h, v, l, s]) => setStats({ hero: h.hero, videos: v.videos, locations: l.locations, subscribers: s.subscribers }))
      .catch((e) => console.error('[admin/overview]', e))
      .finally(() => setLoading(false))
  }, [])

  if (loading || !stats) {
    return (
      <div className="flex items-center gap-2 py-16 text-gray-500">
        <Loader2 className="h-5 w-5 animate-spin" /> Summoning statistics…
      </div>
    )
  }

  const activeVideos = stats.videos.filter((v) => v.active).length
  const activeLocations = stats.locations.filter((l) => l.active).length

  const cards = [
    {
      label: 'Newsletter Subscribers',
      value: stats.subscribers.length,
      icon: Mail,
      accent: 'text-spooky-amber',
      hint: 'Latest: ' + (stats.subscribers[0]?.email ?? '—'),
      tab: 'subscribers',
    },
    {
      label: 'Gallery Videos',
      value: `${activeVideos}/${stats.videos.length}`,
      icon: Film,
      accent: 'text-crimson-400',
      hint: 'Active / total reels',
      tab: 'videos',
    },
    {
      label: 'Event Locations',
      value: `${activeLocations}/${stats.locations.length}`,
      icon: MapPin,
      accent: 'text-spooky-purple',
      hint: 'Active / total venues',
      tab: 'locations',
    },
    {
      label: 'Hero Background',
      value: stats.hero ? (stats.hero.mediaType === 'video' ? 'Video' : 'Image') : 'Default',
      icon: stats.hero?.mediaType === 'image' ? ImageIcon : MonitorPlay,
      accent: 'text-emerald-400',
      hint: stats.hero?.mediaUrl ?? 'Using built-in fallback',
      tab: 'hero',
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-cinzel text-lg font-bold text-white">Overview</h3>
        <p className="mt-1 text-sm text-gray-500">
          Everything on the landing page you can manage from this console.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <button
            key={c.label}
            type="button"
            onClick={() => onNavigate(c.tab)}
            className="group cursor-pointer rounded-2xl border border-spooky-purple/25 bg-night-900/70 p-5 text-left transition-all hover:-translate-y-0.5 hover:border-crimson-500/40 hover:shadow-[0_0_30px_-10px_rgba(230,30,56,0.4)]"
          >
            <div className="flex items-center justify-between">
              <c.icon className={`h-6 w-6 ${c.accent}`} aria-hidden />
              <span className="font-cinzel text-3xl font-bold tabular-nums text-white">
                {c.value}
              </span>
            </div>
            <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">
              {c.label}
            </p>
            <p className="mt-1 truncate text-[11px] text-gray-600">{c.hint}</p>
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-spooky-purple/25 bg-night-900/70 p-6">
        <div className="flex items-center gap-2.5">
          <CalendarClock className="h-5 w-5 text-crimson-400" aria-hidden />
          <h4 className="font-cinzel text-base font-bold text-white">Nightfall — Haunted Night 2026</h4>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-gray-500">
          The landing page reads hero media, gallery videos and locations from this dashboard in
          real time — changes go live the moment you hit save (just refresh the landing page).
          Landing sections without database content fall back to the built-in defaults, so the site
          never breaks.
        </p>
      </div>
    </div>
  )
}
