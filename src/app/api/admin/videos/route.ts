import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { guard } from '@/lib/admin-auth'

const videoSchema = z.object({
  title: z.string().min(1, 'Title is required').max(160),
  subtitle: z.string().max(400).nullable().optional(),
  videoUrl: z.string().min(1, 'Video URL is required').max(2048),
  posterUrl: z.string().max(2048).nullable().optional(),
  duration: z.string().max(16).nullable().optional(),
  badge: z.string().max(40).nullable().optional(),
  sortOrder: z.number().int().min(0).max(9999).default(0),
  active: z.boolean().default(true),
})

const str = (v: string | null | undefined, fallback: string | null = null) => {
  const t = v?.trim()
  return t ? t : fallback
}

export async function GET(req: NextRequest) {
  const denied = guard(req)
  if (denied) return denied

  try {
    const videos = await db.galleryVideo.findMany({ orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }] })
    return NextResponse.json({ ok: true, videos })
  } catch (err) {
    console.error('[admin/videos] GET error:', err)
    return NextResponse.json({ ok: false, error: 'Failed to load videos' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const denied = guard(req)
  if (denied) return denied

  try {
    const parsed = videoSchema.safeParse(await req.json())
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: parsed.error.issues[0]?.message ?? 'Invalid data' },
        { status: 400 }
      )
    }
    const d = parsed.data
    const video = await db.galleryVideo.create({
      data: {
        title: d.title.trim(),
        subtitle: str(d.subtitle),
        videoUrl: d.videoUrl.trim(),
        posterUrl: str(d.posterUrl),
        duration: str(d.duration),
        badge: str(d.badge),
        sortOrder: d.sortOrder,
        active: d.active,
      },
    })
    return NextResponse.json({ ok: true, video, message: 'Video added to the gallery.' }, { status: 201 })
  } catch (err) {
    console.error('[admin/videos] POST error:', err)
    return NextResponse.json({ ok: false, error: 'Failed to create video' }, { status: 500 })
  }
}
