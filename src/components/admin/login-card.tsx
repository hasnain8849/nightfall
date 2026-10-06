'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Ghost, LockKeyhole } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function LoginCard({ onSuccess }: { onSuccess: () => void }) {
  const [passcode, setPasscode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || data.ok === false) {
        setError(data.error || 'Login failed')
        return
      }
      onSuccess()
    } catch {
      setError('Network error. Try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-night-950 px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md rounded-2xl border border-spooky-purple/25 bg-night-900/80 p-8 shadow-[0_0_60px_-15px_rgba(155,77,237,0.4)] backdrop-blur sm:p-10"
      >
        <div className="flex flex-col items-center text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full border border-crimson-500/50 bg-crimson-600/20 text-crimson-400 shadow-[0_0_22px_-4px_rgba(230,30,56,0.6)]">
            <Ghost className="h-7 w-7" aria-hidden />
          </span>
          <h1 className="mt-5 font-cinzel-deco text-2xl font-bold tracking-[0.18em] text-white">
            NIGHT<span className="text-crimson-500">FALL</span>
          </h1>
          <p className="mt-1 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-gray-500">
            <LockKeyhole className="h-3.5 w-3.5" aria-hidden />
            Admin Console
          </p>
        </div>

        <form onSubmit={submit} className="mt-8 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="passcode" className="text-xs uppercase tracking-widest text-gray-400">
              Passcode
            </Label>
            <Input
              id="passcode"
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Enter the sacred phrase…"
              autoFocus
              className="border-spooky-purple/25 bg-night-950/80 text-white placeholder:text-gray-600 focus-visible:ring-crimson-500/50"
            />
          </div>

          {error && (
            <p className="rounded-lg border border-crimson-500/40 bg-crimson-600/10 px-4 py-2.5 text-xs text-crimson-300">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={busy || !passcode}
            className="w-full cursor-pointer rounded-full bg-crimson-600 py-3 text-xs font-bold uppercase tracking-[0.2em] text-white hover:bg-crimson-500 disabled:opacity-50"
          >
            {busy ? 'Unlocking…' : 'Enter The Crypt'}
          </Button>
        </form>

        <p className="mt-6 text-center text-[11px] leading-relaxed text-gray-600">
          Demo passcode: <span className="font-bold text-gray-400">nightfall</span>
          <br />
          (Set ADMIN_PASSCODE env var to change)
        </p>
      </motion.div>
    </div>
  )
}
