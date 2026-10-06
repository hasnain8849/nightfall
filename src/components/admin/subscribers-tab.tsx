'use client'

import { useEffect, useState } from 'react'
import { Download, Loader2, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { api, type Subscriber } from './types'
import { cn } from '@/lib/utils'

export function SubscribersTab() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [pendingDelete, setPendingDelete] = useState<string | null>(null)

  const load = () =>
    api<{ subscribers: Subscriber[] }>('/api/admin/subscribers')
      .then(({ subscribers }) => setSubscribers(subscribers))
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false))

  useEffect(() => {
    load()
  }, [])

  const remove = async (s: Subscriber) => {
    if (pendingDelete !== s.id) {
      setPendingDelete(s.id)
      setTimeout(() => setPendingDelete((p) => (p === s.id ? null : p)), 3000)
      return
    }
    setPendingDelete(null)
    try {
      await api(`/api/admin/subscribers?id=${encodeURIComponent(s.id)}`, { method: 'DELETE' })
      toast.success(`${s.email} removed.`)
      await load()
    } catch (e) {
      toast.error((e as Error).message)
    }
  }

  const exportCsv = () => {
    const rows = [
      ['email', 'source', 'subscribed_at'],
      ...subscribers.map((s) => [s.email, s.source, new Date(s.createdAt).toISOString()]),
    ]
    const csv = rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `nightfall-subscribers-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('CSV exported.')
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-16 text-gray-500">
        <Loader2 className="h-5 w-5 animate-spin" /> Loading subscribers…
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="font-cinzel text-lg font-bold text-white">Newsletter Subscribers</h3>
          <p className="mt-1 text-sm text-gray-500">
            Everyone who signed up from the landing page and footer forms.
          </p>
        </div>
        <Button
          onClick={exportCsv}
          disabled={subscribers.length === 0}
          className="cursor-pointer rounded-full bg-spooky-purple px-6 py-2.5 text-xs font-bold uppercase tracking-[0.2em] text-white hover:bg-spooky-violet disabled:opacity-40"
        >
          <Download className="h-4 w-4" aria-hidden /> Export CSV
        </Button>
      </div>

      {subscribers.length === 0 ? (
        <p className="rounded-xl border border-dashed border-spooky-purple/30 py-12 text-center text-sm text-gray-500">
          No subscribers yet. The newsletter form on the landing page feeds this list.
        </p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-spooky-purple/25">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-spooky-purple/25 bg-night-950/80 text-[10px] uppercase tracking-[0.2em] text-gray-500">
                <th className="px-4 py-3 font-bold">#</th>
                <th className="px-4 py-3 font-bold">Email</th>
                <th className="px-4 py-3 font-bold">Source</th>
                <th className="px-4 py-3 font-bold">Subscribed</th>
                <th className="px-4 py-3 text-right font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((s, i) => (
                <tr
                  key={s.id}
                  className="border-b border-spooky-purple/10 bg-night-900/60 last:border-0 hover:bg-night-850/60"
                >
                  <td className="px-4 py-3 font-mono text-xs text-gray-600">{i + 1}</td>
                  <td className="px-4 py-3 font-medium text-white">{s.email}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full border border-spooky-purple/30 bg-night-950 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-spooky-purple">
                      {s.source}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400">
                    {new Date(s.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => remove(s)}
                      aria-label={pendingDelete === s.id ? 'Click again to confirm delete' : 'Delete subscriber'}
                      className={cn(
                        'inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg px-2 text-xs font-bold uppercase tracking-wider transition',
                        pendingDelete === s.id
                          ? 'bg-crimson-600 text-white'
                          : 'text-gray-400 hover:bg-crimson-600/10 hover:text-crimson-400'
                      )}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden />
                      {pendingDelete === s.id && 'Sure?'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
