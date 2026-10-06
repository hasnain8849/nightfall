import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { guard } from '@/lib/admin-auth'

const heroSchema = z.object({
  mediaType: z.enum(['video', 'image']),
  mediaUrl: z.string().min(1, 'Media URL is required').max(2048),
  posterUrl: z.string().max(2048).nullable().optional(),
})

export async function GET(req: NextRequest) {
  const denied = guard(req)
  if (denied) return denied

  try {
    const hero = await db.heroSettings.findUnique({ where: { id: 'hero' } })
    return NextResponse.json({ ok: true, hero })
  } catch (err) {
    console.error('[admin/hero] GET error:', err)
    return NextResponse.json({ ok: false, error: 'Failed to load hero settings' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  const denied = guard(req)
  if (denied) return denied

  try {
    const parsed = heroSchema.safeParse(await req.json())
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: parsed.error.issues[0]?.message ?? 'Invalid data' },
        { status: 400 }
      )
    }

    const posterUrl = parsed.data.posterUrl?.trim() ? parsed.data.posterUrl.trim() : null

    const hero = await db.heroSettings.upsert({
      where: { id: 'hero' },
      update: {
        mediaType: parsed.data.mediaType,
        mediaUrl: parsed.data.mediaUrl.trim(),
        posterUrl,
      },
      create: {
        id: 'hero',
        mediaType: parsed.data.mediaType,
        mediaUrl: parsed.data.mediaUrl.trim(),
        posterUrl,
      },
    })

    return NextResponse.json({ ok: true, hero, message: 'Hero background updated.' })
  } catch (err) {
    console.error('[admin/hero] PUT error:', err)
    return NextResponse.json({ ok: false, error: 'Failed to save hero settings' }, { status: 500 })
  }
}
