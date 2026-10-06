import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { guard } from '@/lib/admin-auth'

const videoUpdateSchema = z.object({
  title: z.string().min(1, 'Title is required').max(160),
  subtitle: z.string().max(400).nullable().optional(),
  videoUrl: z.string().min(1, 'Video URL is required').max(2048),
  posterUrl: z.string().max(2048).nullable().optional(),
  duration: z.string().max(16).nullable().optional(),
  badge: z.string().max(40).nullable().optional(),
  sortOrder: z.number().int().min(0).max(9999),
  active: z.boolean(),
})

const str = (v: string | null | undefined, fallback: string | null = null) => {
  const t = v?.trim()
  return t ? t : fallback
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = guard(req)
  if (denied) return denied

  try {
    const { id } = await params
    const parsed = videoUpdateSchema.safeParse(await req.json())
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: parsed.error.issues[0]?.message ?? 'Invalid data' },
        { status: 400 }
      )
    }
    const d = parsed.data
    const video = await db.galleryVideo.update({
      where: { id },
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
    return NextResponse.json({ ok: true, video, message: 'Video updated.' })
  } catch (err) {
    console.error('[admin/videos/:id] PUT error:', err)
    return NextResponse.json({ ok: false, error: 'Failed to update video' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const denied = guard(req)
  if (denied) return denied

  try {
    const { id } = await params
    await db.galleryVideo.delete({ where: { id } })
    return NextResponse.json({ ok: true, message: 'Video removed from the gallery.' })
  } catch (err) {
    console.error('[admin/videos/:id] DELETE error:', err)
    return NextResponse.json({ ok: false, error: 'Failed to delete video' }, { status: 500 })
  }
}
