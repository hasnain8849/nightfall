'use client'

import { useEffect, useState } from 'react'
import {
  ArrowDown,
  ArrowUp,
  Eye,
  EyeOff,
  Loader2,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { api, type GalleryVideo } from './types'
import { cn } from '@/lib/utils'

interface VideoForm {
  title: string
  subtitle: string
  videoUrl: string
  posterUrl: string
  duration: string
  badge: string
  sortOrder: number
  active: boolean
}

const EMPTY: VideoForm = {
  title: '',
  subtitle: '',
  videoUrl: '',
  posterUrl: '',
  duration: '',
  badge: '',
  sortOrder: 0,
  active: true,
}

export function VideosTab() {
  const [videos, setVideos] = useState<GalleryVideo[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<GalleryVideo | null>(null)
  const [form, setForm] = useState<VideoForm>(EMPTY)
  const [saving, setSaving] = useState(false)
  const [pendingDelete, setPendingDelete] = useState<string | null>(null)

  const load = () =>
    api<{ videos: GalleryVideo[] }>('/api/admin/videos')
      .then(({ videos }) => setVideos(videos))
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false))

  useEffect(() => {
    load()
  }, [])

  const openAdd = () => {
    const maxOrder = videos.reduce((m, v) => Math.max(m, v.sortOrder), 0)
    setEditing(null)
    setForm({ ...EMPTY, sortOrder: maxOrder + 1 })
    setDialogOpen(true)
  }

  const openEdit = (v: GalleryVideo) => {
    setEditing(v)
    setForm({
      title: v.title,
      subtitle: v.subtitle ?? '',
      videoUrl: v.videoUrl,
      posterUrl: v.posterUrl ?? '',
      duration: v.duration ?? '',
      badge: v.badge ?? '',
      sortOrder: v.sortOrder,
      active: v.active,
    })
    setDialogOpen(true)
  }

  const save = async () => {
    if (!form.title.trim() || !form.videoUrl.trim()) {
      toast.error('Title and video URL are required')
      return
    }
    setSaving(true)
    try {
      const body = JSON.stringify({
        title: form.title.trim(),
        subtitle: form.subtitle.trim() || null,
        videoUrl: form.videoUrl.trim(),
        posterUrl: form.posterUrl.trim() || null,
        duration: form.duration.trim() || null,
        badge: form.badge.trim() || null,
        sortOrder: Number(form.sortOrder) || 0,
        active: form.active,
      })
      if (editing) {
        await api(`/api/admin/videos/${editing.id}`, { method: 'PUT', body })
        toast.success('Video updated.')
      } else {
        await api('/api/admin/videos', { method: 'POST', body })
        toast.success('Video added to the gallery.')
      }
      setDialogOpen(false)
      await load()
    } catch (e) {
      toast.error((e as Error).message)
    } finally {
      setSaving(false)
    }
  }

  const toggleActive = async (v: GalleryVideo) => {
    try {
      await api(`/api/admin/videos/${v.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          title: v.title,
          subtitle: v.subtitle,
          videoUrl: v.videoUrl,
          posterUrl: v.posterUrl,
          duration: v.duration,
          badge: v.badge,
          sortOrder: v.sortOrder,
          active: !v.active,
        }),
      })
      await load()
    } catch (e) {
      toast.error((e as Error).message)
    }
  }

  const remove = async (v: GalleryVideo) => {
    if (pendingDelete !== v.id) {
      setPendingDelete(v.id)
      setTimeout(() => setPendingDelete((p) => (p === v.id ? null : p)), 3000)
      return
    }
    setPendingDelete(null)
    try {
      await api(`/api/admin/videos/${v.id}`, { method: 'DELETE' })
      toast.success(`"${v.title}" removed.`)
      await load()
    } catch (e) {
      toast.error((e as Error).message)
    }
  }

  const move = async (index: number, dir: -1 | 1) => {
    const other = index + dir
    if (other < 0 || other >= videos.length) return
    const a = videos[index]
    const b = videos[other]
    try {
      const payload = (v: GalleryVideo, sortOrder: number) =>
        JSON.stringify({
          title: v.title,
          subtitle: v.subtitle,
          videoUrl: v.videoUrl,
          posterUrl: v.posterUrl,
          duration: v.duration,
          badge: v.badge,
          sortOrder,
          active: v.active,
        })
      await Promise.all([
        api(`/api/admin/videos/${a.id}`, { method: 'PUT', body: payload(a, b.sortOrder) }),
        api(`/api/admin/videos/${b.id}`, { method: 'PUT', body: payload(b, a.sortOrder) }),
      ])
      await load()
    } catch (e) {
      toast.error((e as Error).message)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-16 text-gray-500">
        <Loader2 className="h-5 w-5 animate-spin" /> Loading gallery videos…
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="font-cinzel text-lg font-bold text-white">Gallery Videos</h3>
          <p className="mt-1 text-sm text-gray-500">
            The landing gallery plays these videos as 16:9 slides — only active videos appear,
            sorted by order.
          </p>
        </div>
        <Button
          onClick={openAdd}
          className="cursor-pointer rounded-full bg-crimson-600 px-6 py-2.5 text-xs font-bold uppercase tracking-[0.2em] text-white hover:bg-crimson-500"
        >
          <Plus className="h-4 w-4" aria-hidden /> Add Video
        </Button>
      </div>

      {videos.length === 0 ? (
        <p className="rounded-xl border border-dashed border-spooky-purple/30 py-12 text-center text-sm text-gray-500">
          No videos yet. Add your first haunted reel.
        </p>
      ) : (
        <ul className="space-y-3">
          {videos.map((v, i) => (
            <li
              key={v.id}
              className={cn(
                'flex flex-wrap items-center gap-4 rounded-xl border p-3 sm:flex-nowrap',
                v.active
                  ? 'border-spooky-purple/25 bg-night-900/70'
                  : 'border-spooky-purple/10 bg-night-900/30 opacity-60'
              )}
            >
              {/* Thumb */}
              <div className="relative h-14 w-24 shrink-0 overflow-hidden rounded-lg border border-spooky-purple/20 bg-night-950">
                {v.posterUrl ? (
                  <img src={v.posterUrl} alt="" className="h-full w-full object-cover" />
                ) : (
                  <video src={v.videoUrl} muted className="h-full w-full object-cover" />
                )}
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-white">{v.title}</p>
                <p className="mt-0.5 truncate text-[11px] text-gray-500">
                  {v.badge ? `${v.badge} · ` : ''}
                  {v.duration ? `${v.duration} · ` : ''}
                  <span className="font-mono">{v.videoUrl}</span>
                </p>
              </div>

              {/* Order */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => move(i, -1)}
                  disabled={i === 0}
                  aria-label="Move up"
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-gray-500 transition hover:bg-white/5 hover:text-white disabled:opacity-30"
                >
                  <ArrowUp className="h-4 w-4" aria-hidden />
                </button>
                <span className="w-6 text-center font-mono text-xs text-gray-500">{v.sortOrder}</span>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={i === videos.length - 1}
                  aria-label="Move down"
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-gray-500 transition hover:bg-white/5 hover:text-white disabled:opacity-30"
                >
                  <ArrowDown className="h-4 w-4" aria-hidden />
                </button>
              </div>

              {/* Active switch */}
              <div className="flex items-center gap-2">
                <Switch
                  checked={v.active}
                  onCheckedChange={() => toggleActive(v)}
                  aria-label="Toggle visibility"
                />
                {v.active ? (
                  <Eye className="h-4 w-4 text-spooky-amber" aria-hidden />
                ) : (
                  <EyeOff className="h-4 w-4 text-gray-600" aria-hidden />
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => openEdit(v)}
                  aria-label="Edit video"
                  className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-gray-400 transition hover:bg-white/5 hover:text-spooky-amber"
                >
                  <Pencil className="h-4 w-4" aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={() => remove(v)}
                  aria-label={pendingDelete === v.id ? 'Click again to confirm delete' : 'Delete video'}
                  className={cn(
                    'flex h-9 cursor-pointer items-center gap-1.5 rounded-lg px-2 text-xs font-bold uppercase tracking-wider transition',
                    pendingDelete === v.id
                      ? 'bg-crimson-600 text-white'
                      : 'text-gray-400 hover:bg-crimson-600/10 hover:text-crimson-400'
                  )}
                >
                  <Trash2 className="h-4 w-4" aria-hidden />
                  {pendingDelete === v.id && 'Sure?'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Add / Edit dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto border-spooky-purple/25 bg-night-900 text-white sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-cinzel text-lg text-white">
              {editing ? 'Edit Video' : 'Add Gallery Video'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="v-title" className="text-xs uppercase tracking-widest text-gray-400">Title *</Label>
              <Input
                id="v-title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Official Aftermovie: Into The Shadows"
                className="border-spooky-purple/25 bg-night-950/80 text-white placeholder:text-gray-600"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="v-sub" className="text-xs uppercase tracking-widest text-gray-400">Subtitle</Label>
              <Textarea
                id="v-sub"
                rows={2}
                value={form.subtitle}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                placeholder="Short teaser line shown under the title"
                className="border-spooky-purple/25 bg-night-950/80 text-white placeholder:text-gray-600"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="v-url" className="text-xs uppercase tracking-widest text-gray-400">Video URL (MP4) *</Label>
              <Input
                id="v-url"
                value={form.videoUrl}
                onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
                placeholder="/assets/videos/g-laser-green.mp4"
                className="border-spooky-purple/25 bg-night-950/80 font-mono text-xs text-white placeholder:text-gray-600"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="v-poster" className="text-xs uppercase tracking-widest text-gray-400">Poster URL</Label>
                <Input
                  id="v-poster"
                  value={form.posterUrl}
                  onChange={(e) => setForm({ ...form, posterUrl: e.target.value })}
                  placeholder="/assets/videos/posters/g-laser-green.jpg"
                  className="border-spooky-purple/25 bg-night-950/80 font-mono text-xs text-white placeholder:text-gray-600"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="v-dur" className="text-xs uppercase tracking-widest text-gray-400">Duration label</Label>
                <Input
                  id="v-dur"
                  value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: e.target.value })}
                  placeholder="04:28"
                  className="border-spooky-purple/25 bg-night-950/80 font-mono text-xs text-white placeholder:text-gray-600"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="v-badge" className="text-xs uppercase tracking-widest text-gray-400">Badge</Label>
                <Input
                  id="v-badge"
                  value={form.badge}
                  onChange={(e) => setForm({ ...form, badge: e.target.value })}
                  placeholder="4K ULTRA HD"
                  className="border-spooky-purple/25 bg-night-950/80 text-xs uppercase text-white placeholder:text-gray-600"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="v-order" className="text-xs uppercase tracking-widest text-gray-400">Sort order</Label>
                <Input
                  id="v-order"
                  type="number"
                  min={0}
                  value={form.sortOrder}
                  onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
                  className="border-spooky-purple/25 bg-night-950/80 font-mono text-xs text-white"
                />
              </div>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-spooky-purple/20 bg-night-950/60 px-4 py-3">
              <Label htmlFor="v-active" className="cursor-pointer text-sm text-gray-300">
                Visible on landing page
              </Label>
              <Switch
                id="v-active"
                checked={form.active}
                onCheckedChange={(v) => setForm({ ...form, active: v })}
              />
            </div>
            {form.videoUrl.trim() && (
              <div className="overflow-hidden rounded-xl border border-spooky-purple/20">
                <video
                  key={form.videoUrl}
                  src={form.videoUrl}
                  poster={form.posterUrl || undefined}
                  muted
                  loop
                  autoPlay
                  playsInline
                  controls
                  className="aspect-video w-full object-cover"
                />
              </div>
            )}
            <div className="flex justify-end gap-3 pt-2">
              <Button
                variant="ghost"
                onClick={() => setDialogOpen(false)}
                className="cursor-pointer rounded-full text-gray-400 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                onClick={save}
                disabled={saving}
                className="cursor-pointer rounded-full bg-crimson-600 px-7 text-xs font-bold uppercase tracking-[0.2em] text-white hover:bg-crimson-500"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {editing ? 'Save Changes' : 'Add Video'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
