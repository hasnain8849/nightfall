'use client'

import { useEffect, useState } from 'react'
import { Image as ImageIcon, Loader2, MonitorPlay, Save } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { api, type HeroSettings } from './types'
import { cn } from '@/lib/utils'

export function HeroTab() {
  const [hero, setHero] = useState<HeroSettings | null>(null)
  const [mediaType, setMediaType] = useState<'video' | 'image'>('video')
  const [mediaUrl, setMediaUrl] = useState('')
  const [posterUrl, setPosterUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    api<{ hero: HeroSettings }>('/api/admin/hero')
      .then(({ hero }) => {
        if (hero) {
          setHero(hero)
          setMediaType(hero.mediaType === 'image' ? 'image' : 'video')
          setMediaUrl(hero.mediaUrl)
          setPosterUrl(hero.posterUrl ?? '')
        }
      })
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false))
  }, [])

  const save = async () => {
    if (!mediaUrl.trim()) {
      toast.error('Media URL is required')
      return
    }
    setSaving(true)
    try {
      const { hero } = await api<{ hero: HeroSettings }>('/api/admin/hero', {
        method: 'PUT',
        body: JSON.stringify({
          mediaType,
          mediaUrl: mediaUrl.trim(),
          posterUrl: posterUrl.trim() || null,
        }),
      })
      setHero(hero)
      toast.success('Hero background saved — refresh the landing page to see it live.')
    } catch (e) {
      toast.error((e as Error).message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-16 text-gray-500">
        <Loader2 className="h-5 w-5 animate-spin" /> Loading hero settings…
      </div>
    )
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Form */}
      <div className="space-y-6">
        <div>
          <h3 className="font-cinzel text-lg font-bold text-white">Hero Background</h3>
          <p className="mt-1 text-sm text-gray-500">
            Control the full-screen media behind the landing hero. Choose an atmospheric video or a
            still image, paste its URL, and save.
          </p>
        </div>

        {/* Media type toggle */}
        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-widest text-gray-400">Media type</Label>
          <div className="grid grid-cols-2 gap-3">
            {(
              [
                { key: 'video', label: 'Video', icon: MonitorPlay },
                { key: 'image', label: 'Image', icon: ImageIcon },
              ] as const
            ).map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => setMediaType(key)}
                aria-pressed={mediaType === key}
                className={cn(
                  'flex cursor-pointer items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-bold uppercase tracking-wider transition-all',
                  mediaType === key
                    ? 'border-crimson-500/60 bg-crimson-600/15 text-crimson-300 shadow-[0_0_20px_-6px_rgba(230,30,56,0.5)]'
                    : 'border-spooky-purple/20 bg-night-850/60 text-gray-400 hover:border-crimson-500/30 hover:text-gray-200'
                )}
              >
                <Icon className="h-4 w-4" aria-hidden />
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="mediaUrl" className="text-xs uppercase tracking-widest text-gray-400">
            {mediaType === 'video' ? 'Video URL (MP4)' : 'Image URL'}
          </Label>
          <Input
            id="mediaUrl"
            value={mediaUrl}
            onChange={(e) => setMediaUrl(e.target.value)}
            placeholder={mediaType === 'video' ? '/assets/videos/hero-moon.mp4' : '/assets/img_00.jpg'}
            className="border-spooky-purple/25 bg-night-950/80 font-mono text-xs text-white placeholder:text-gray-600"
          />
          <p className="text-[11px] text-gray-600">
            Local path under <span className="font-mono">/public</span> or a full https:// URL.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="posterUrl" className="text-xs uppercase tracking-widest text-gray-400">
            Poster URL <span className="normal-case text-gray-600">(optional, video preview frame)</span>
          </Label>
          <Input
            id="posterUrl"
            value={posterUrl}
            onChange={(e) => setPosterUrl(e.target.value)}
            placeholder="/assets/img_00.jpg"
            className="border-spooky-purple/25 bg-night-950/80 font-mono text-xs text-white placeholder:text-gray-600"
          />
        </div>

        <Button
          onClick={save}
          disabled={saving}
          className="cursor-pointer rounded-full bg-crimson-600 px-8 py-3 text-xs font-bold uppercase tracking-[0.2em] text-white hover:bg-crimson-500"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" aria-hidden />}
          {saving ? 'Saving…' : 'Save Changes'}
        </Button>
      </div>

      {/* Live preview */}
      <div className="space-y-3">
        <Label className="text-xs uppercase tracking-widest text-gray-400">Live preview</Label>
        <div className="relative aspect-video overflow-hidden rounded-2xl border border-spooky-purple/25 bg-night-950">
          {mediaUrl.trim() ? (
            mediaType === 'video' ? (
              <video
                key={mediaUrl}
                src={mediaUrl}
                poster={posterUrl || undefined}
                autoPlay
                loop
                muted
                playsInline
                controls
                className="h-full w-full object-cover"
              />
            ) : (
              <img src={mediaUrl} alt="Hero preview" className="h-full w-full object-cover" />
            )
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-gray-600">
              Enter a URL to preview
            </div>
          )}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between p-4">
            <span className="rounded-full bg-night-950/80 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-300">
              {mediaType === 'video' ? 'Background video' : 'Background image'}
            </span>
            {hero && (
              <span className="rounded-full bg-night-950/80 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-spooky-amber">
                Last saved: {new Date(hero.updatedAt).toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
