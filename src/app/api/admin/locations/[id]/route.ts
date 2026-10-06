import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { guard } from '@/lib/admin-auth'

const locationUpdateSchema = z.object({
  name: z.string().min(1, 'Venue name is required').max(120),
  address: z.string().max(200).nullable().optional(),
  city: z.string().min(1, 'City is required').max(120),
  gatesOpen: z.string().max(80).nullable().optional(),
  eventTime: z.string().max(80).nullable().optional(),
  parking: z.string().max(80).nullable().optional(),
  directionsUrl: z.string().max(2048).nullable().optional(),
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
    const parsed = locationUpdateSchema.safeParse(await req.json())
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: parsed.error.issues[0]?.message ?? 'Invalid data' },
        { status: 400 }
      )
    }
    const d = parsed.data
    const location = await db.eventLocation.update({
      where: { id },
      data: {
        name: d.name.trim(),
        address: str(d.address),
        city: d.city.trim(),
        gatesOpen: str(d.gatesOpen),
        eventTime: str(d.eventTime),
        parking: str(d.parking),
        directionsUrl: str(d.directionsUrl),
        sortOrder: d.sortOrder,
        active: d.active,
      },
    })
    return NextResponse.json({ ok: true, location, message: 'Venue updated.' })
  } catch (err) {
    console.error('[admin/locations/:id] PUT error:', err)
    return NextResponse.json({ ok: false, error: 'Failed to update location' }, { status: 500 })
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
    await db.eventLocation.delete({ where: { id } })
    return NextResponse.json({ ok: true, message: 'Venue removed.' })
  } catch (err) {
    console.error('[admin/locations/:id] DELETE error:', err)
    return NextResponse.json({ ok: false, error: 'Failed to delete location' }, { status: 500 })
  }
}
