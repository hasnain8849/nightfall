'use client'

import { useEffect, useState } from 'react'
import {
  ArrowDown,
  ArrowUp,
  Eye,
  EyeOff,
  Loader2,
  MapPin,
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
import { api, type EventLocation } from './types'
import { cn } from '@/lib/utils'

interface LocationForm {
  name: string
  address: string
  city: string
  gatesOpen: string
  eventTime: string
  parking: string
  directionsUrl: string
  sortOrder: number
  active: boolean
}

const EMPTY: LocationForm = {
  name: '',
  address: '',
  city: '',
  gatesOpen: '8:00 PM',
  eventTime: '8:00 PM – 2:00 AM',
  parking: 'Available On-site',
  directionsUrl: '',
  sortOrder: 0,
  active: true,
}

export function LocationsTab() {
  const [locations, setLocations] = useState<EventLocation[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<EventLocation | null>(null)
  const [form, setForm] = useState<LocationForm>(EMPTY)
  const [saving, setSaving] = useState(false)
  const [pendingDelete, setPendingDelete] = useState<string | null>(null)

  const load = () =>
    api<{ locations: EventLocation[] }>('/api/admin/locations')
      .then(({ locations }) => setLocations(locations))
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false))

  useEffect(() => {
    load()
  }, [])

  const openAdd = () => {
    const maxOrder = locations.reduce((m, l) => Math.max(m, l.sortOrder), 0)
    setEditing(null)
    setForm({ ...EMPTY, sortOrder: maxOrder + 1 })
    setDialogOpen(true)
  }

  const openEdit = (l: EventLocation) => {
    setEditing(l)
    setForm({
      name: l.name,
      address: l.address ?? '',
      city: l.city,
      gatesOpen: l.gatesOpen ?? '',
      eventTime: l.eventTime ?? '',
      parking: l.parking ?? '',
      directionsUrl: l.directionsUrl ?? '',
      sortOrder: l.sortOrder,
      active: l.active,
    })
    setDialogOpen(true)
  }

  const save = async () => {
    if (!form.name.trim() || !form.city.trim()) {
      toast.error('Venue name and city are required')
      return
    }
    setSaving(true)
    try {
      const body = JSON.stringify({
        name: form.name.trim(),
        address: form.address.trim() || null,
        city: form.city.trim(),
        gatesOpen: form.gatesOpen.trim() || null,
        eventTime: form.eventTime.trim() || null,
        parking: form.parking.trim() || null,
        directionsUrl: form.directionsUrl.trim() || null,
        sortOrder: Number(form.sortOrder) || 0,
        active: form.active,
      })
      if (editing) {
        await api(`/api/admin/locations/${editing.id}`, { method: 'PUT', body })
        toast.success('Venue updated.')
      } else {
        await api('/api/admin/locations', { method: 'POST', body })
        toast.success('Venue added.')
      }
      setDialogOpen(false)
      await load()
    } catch (e) {
      toast.error((e as Error).message)
    } finally {
      setSaving(false)
    }
  }

  const toggleActive = async (l: EventLocation) => {
    try {
      await api(`/api/admin/locations/${l.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          name: l.name,
          address: l.address,
          city: l.city,
          gatesOpen: l.gatesOpen,
          eventTime: l.eventTime,
          parking: l.parking,
          directionsUrl: l.directionsUrl,
          sortOrder: l.sortOrder,
          active: !l.active,
        }),
      })
      await load()
    } catch (e) {
      toast.error((e as Error).message)
    }
  }

  const remove = async (l: EventLocation) => {
    if (pendingDelete !== l.id) {
      setPendingDelete(l.id)
      setTimeout(() => setPendingDelete((p) => (p === l.id ? null : p)), 3000)
      return
    }
    setPendingDelete(null)
    try {
      await api(`/api/admin/locations/${l.id}`, { method: 'DELETE' })
      toast.success(`"${l.name}" removed.`)
      await load()
    } catch (e) {
      toast.error((e as Error).message)
    }
  }

  const move = async (index: number, dir: -1 | 1) => {
    const other = index + dir
    if (other < 0 || other >= locations.length) return
    const a = locations[index]
    const b = locations[other]
    const payload = (l: EventLocation, sortOrder: number) =>
      JSON.stringify({
        name: l.name,
        address: l.address,
        city: l.city,
        gatesOpen: l.gatesOpen,
        eventTime: l.eventTime,
        parking: l.parking,
        directionsUrl: l.directionsUrl,
        sortOrder,
        active: l.active,
      })
    try {
      await Promise.all([
        api(`/api/admin/locations/${a.id}`, { method: 'PUT', body: payload(a, b.sortOrder) }),
        api(`/api/admin/locations/${b.id}`, { method: 'PUT', body: payload(b, a.sortOrder) }),
      ])
      await load()
    } catch (e) {
      toast.error((e as Error).message)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-16 text-gray-500">
        <Loader2 className="h-5 w-5 animate-spin" /> Loading venues…
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="font-cinzel text-lg font-bold text-white">Event Locations</h3>
          <p className="mt-1 text-sm text-gray-500">
            Multiple venues shown in the landing page location selector — active ones only, sorted
            by order.
          </p>
        </div>
        <Button
          onClick={openAdd}
          className="cursor-pointer rounded-full bg-crimson-600 px-6 py-2.5 text-xs font-bold uppercase tracking-[0.2em] text-white hover:bg-crimson-500"
        >
          <Plus className="h-4 w-4" aria-hidden /> Add Venue
        </Button>
      </div>

      {locations.length === 0 ? (
        <p className="rounded-xl border border-dashed border-spooky-purple/30 py-12 text-center text-sm text-gray-500">
          No venues yet. Add the first hunting ground.
        </p>
      ) : (
        <ul className="space-y-3">
          {locations.map((l, i) => (
            <li
              key={l.id}
              className={cn(
                'flex flex-wrap items-center gap-4 rounded-xl border p-4 sm:flex-nowrap',
                l.active
                  ? 'border-spooky-purple/25 bg-night-900/70'
                  : 'border-spooky-purple/10 bg-night-900/30 opacity-60'
              )}
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-spooky-purple/25 bg-night-950 text-spooky-purple">
                <MapPin className="h-5 w-5" aria-hidden />
              </span>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-white">
                  {l.name}
                  <span className="ml-2 text-[11px] font-semibold uppercase tracking-wider text-crimson-400">
                    {l.city}
                  </span>
                </p>
                <p className="mt-0.5 truncate text-[11px] text-gray-500">
                  {[l.address, l.gatesOpen && `Gates ${l.gatesOpen}`, l.parking]
                    .filter(Boolean)
                    .join(' · ')}
                </p>
              </div>

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
                <span className="w-6 text-center font-mono text-xs text-gray-500">{l.sortOrder}</span>
                <button
                  type="button"
                  onClick={() => move(i, 1)}
                  disabled={i === locations.length - 1}
                  aria-label="Move down"
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-gray-500 transition hover:bg-white/5 hover:text-white disabled:opacity-30"
                >
                  <ArrowDown className="h-4 w-4" aria-hidden />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={l.active}
                  onCheckedChange={() => toggleActive(l)}
                  aria-label="Toggle visibility"
                />
                {l.active ? (
                  <Eye className="h-4 w-4 text-spooky-amber" aria-hidden />
                ) : (
                  <EyeOff className="h-4 w-4 text-gray-600" aria-hidden />
                )}
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => openEdit(l)}
                  aria-label="Edit venue"
                  className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-gray-400 transition hover:bg-white/5 hover:text-spooky-amber"
                >
                  <Pencil className="h-4 w-4" aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={() => remove(l)}
                  aria-label={pendingDelete === l.id ? 'Click again to confirm delete' : 'Delete venue'}
                  className={cn(
                    'flex h-9 cursor-pointer items-center gap-1.5 rounded-lg px-2 text-xs font-bold uppercase tracking-wider transition',
                    pendingDelete === l.id
                      ? 'bg-crimson-600 text-white'
                      : 'text-gray-400 hover:bg-crimson-600/10 hover:text-crimson-400'
                  )}
                >
                  <Trash2 className="h-4 w-4" aria-hidden />
                  {pendingDelete === l.id && 'Sure?'}
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
              {editing ? 'Edit Venue' : 'Add Venue'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="l-name" className="text-xs uppercase tracking-widest text-gray-400">Venue name *</Label>
                <Input
                  id="l-name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="The Grand Arena"
                  className="border-spooky-purple/25 bg-night-950/80 text-white placeholder:text-gray-600"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="l-city" className="text-xs uppercase tracking-widest text-gray-400">City *</Label>
                <Input
                  id="l-city"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  placeholder="Lahore, Pakistan"
                  className="border-spooky-purple/25 bg-night-950/80 text-white placeholder:text-gray-600"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="l-address" className="text-xs uppercase tracking-widest text-gray-400">Address</Label>
              <Input
                id="l-address"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="Expo Centre, Ferozepur Road"
                className="border-spooky-purple/25 bg-night-950/80 text-white placeholder:text-gray-600"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label htmlFor="l-gates" className="text-xs uppercase tracking-widest text-gray-400">Gates open</Label>
                <Input
                  id="l-gates"
                  value={form.gatesOpen}
                  onChange={(e) => setForm({ ...form, gatesOpen: e.target.value })}
                  placeholder="8:00 PM"
                  className="border-spooky-purple/25 bg-night-950/80 text-xs text-white placeholder:text-gray-600"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="l-time" className="text-xs uppercase tracking-widest text-gray-400">Event time</Label>
                <Input
                  id="l-time"
                  value={form.eventTime}
                  onChange={(e) => setForm({ ...form, eventTime: e.target.value })}
                  placeholder="8:00 PM – 2:00 AM"
                  className="border-spooky-purple/25 bg-night-950/80 text-xs text-white placeholder:text-gray-600"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="l-parking" className="text-xs uppercase tracking-widest text-gray-400">Parking</Label>
                <Input
                  id="l-parking"
                  value={form.parking}
                  onChange={(e) => setForm({ ...form, parking: e.target.value })}
                  placeholder="Available On-site"
                  className="border-spooky-purple/25 bg-night-950/80 text-xs text-white placeholder:text-gray-600"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="l-directions" className="text-xs uppercase tracking-widest text-gray-400">
                Google Maps URL
              </Label>
              <Input
                id="l-directions"
                value={form.directionsUrl}
                onChange={(e) => setForm({ ...form, directionsUrl: e.target.value })}
                placeholder="https://www.google.com/maps/search/?api=1&query=…"
                className="border-spooky-purple/25 bg-night-950/80 font-mono text-xs text-white placeholder:text-gray-600"
              />
              <p className="text-[11px] text-gray-600">
                Leave empty to auto-generate a maps search link from venue + city.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="l-order" className="text-xs uppercase tracking-widest text-gray-400">Sort order</Label>
                <Input
                  id="l-order"
                  type="number"
                  min={0}
                  value={form.sortOrder}
                  onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
                  className="border-spooky-purple/25 bg-night-950/80 font-mono text-xs text-white"
                />
              </div>
              <div className="flex items-end">
                <div className="flex w-full items-center justify-between rounded-xl border border-spooky-purple/20 bg-night-950/60 px-4 py-2.5">
                  <Label htmlFor="l-active" className="cursor-pointer text-sm text-gray-300">
                    Visible
                  </Label>
                  <Switch
                    id="l-active"
                    checked={form.active}
                    onCheckedChange={(v) => setForm({ ...form, active: v })}
                  />
                </div>
              </div>
            </div>
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
                {editing ? 'Save Changes' : 'Add Venue'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
