'use client'

import { useCallback, useEffect, useState } from 'react'
import { ExternalLink, Ghost, LogOut } from 'lucide-react'
import { HeroTab } from '@/components/admin/hero-tab'
import { LocationsTab } from '@/components/admin/locations-tab'
import { LoginCard } from '@/components/admin/login-card'
import { OverviewTab } from '@/components/admin/overview-tab'
import { SubscribersTab } from '@/components/admin/subscribers-tab'
import { VideosTab } from '@/components/admin/videos-tab'
import { cn } from '@/lib/utils'

const TABS = [
  { key: 'overview', label: 'Overview' },
  { key: 'hero', label: 'Hero Media' },
  { key: 'videos', label: 'Gallery Videos' },
  { key: 'locations', label: 'Locations' },
  { key: 'subscribers', label: 'Subscribers' },
] as const

export default function AdminPage() {
  const [authed, setAuthed] = useState<boolean | null>(null)
  const [tab, setTab] = useState<string>('overview')

  const checkSession = useCallback(() => {
    fetch('/api/admin/session', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => setAuthed(!!d.authed))
      .catch(() => setAuthed(false))
  }, [])

  useEffect(() => {
    checkSession()
  }, [checkSession])

  const logout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' }).catch(() => {})
    setAuthed(false)
  }

  if (authed === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-night-950 text-gray-500">
        <Ghost className="mr-3 h-6 w-6 animate-pulse" aria-hidden />
        Opening the crypt…
      </div>
    )
  }

  if (!authed) {
    return <LoginCard onSuccess={checkSession} />
  }

  return (
    <div className="min-h-screen bg-night-950 text-white">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-spooky-purple/25 bg-night-950/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-crimson-500/50 bg-crimson-600/20 text-crimson-400">
              <Ghost className="h-4.5 w-4.5" aria-hidden />
            </span>
            <div className="leading-tight">
              <p className="font-cinzel-deco text-base font-bold tracking-[0.18em]">
                NIGHT<span className="text-crimson-500">FALL</span>
              </p>
              <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-gray-500">
                Admin Console
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-spooky-purple/30 px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-gray-300 transition hover:border-crimson-500/50 hover:text-white"
            >
              <ExternalLink className="h-3.5 w-3.5" aria-hidden />
              View Site
            </a>
            <button
              type="button"
              onClick={logout}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-crimson-500/30 px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-crimson-400 transition hover:bg-crimson-600/15 hover:text-crimson-300"
            >
              <LogOut className="h-3.5 w-3.5" aria-hidden />
              Sign Out
            </button>
          </div>
        </div>

        {/* Tabs */}
        <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 pb-2 sm:px-6" aria-label="Admin sections">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              aria-current={tab === t.key ? 'page' : undefined}
              className={cn(
                'shrink-0 cursor-pointer rounded-full px-4 py-2 text-[11px] font-bold uppercase tracking-widest transition-all',
                tab === t.key
                  ? 'bg-crimson-600 text-white shadow-[0_0_18px_-4px_rgba(230,30,56,0.6)]'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              )}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {tab === 'overview' && <OverviewTab onNavigate={setTab} />}
        {tab === 'hero' && <HeroTab />}
        {tab === 'videos' && <VideosTab />}
        {tab === 'locations' && <LocationsTab />}
        {tab === 'subscribers' && <SubscribersTab />}
      </main>
    </div>
  )
}
