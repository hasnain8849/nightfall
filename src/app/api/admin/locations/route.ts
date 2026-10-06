import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { guard } from '@/lib/admin-auth'

const locationSchema = z.object({
  name: z.string().min(1, 'Venue name is required').max(120),
  address: z.string().max(200).nullable().optional(),
  city: z.string().min(1, 'City is required').max(120),
  gatesOpen: z.string().max(80).nullable().optional(),
  eventTime: z.string().max(80).nullable().optional(),
  parking: z.string().max(80).nullable().optional(),
  directionsUrl: z.string().max(2048).nullable().optional(),
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
    const locations = await db.eventLocation.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    })
    return NextResponse.json({ ok: true, locations })
  } catch (err) {
    console.error('[admin/locations] GET error:', err)
    return NextResponse.json({ ok: false, error: 'Failed to load locations' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const denied = guard(req)
  if (denied) return denied

  try {
    const parsed = locationSchema.safeParse(await req.json())
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: parsed.error.issues[0]?.message ?? 'Invalid data' },
        { status: 400 }
      )
    }
    const d = parsed.data
    const location = await db.eventLocation.create({
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
    return NextResponse.json({ ok: true, location, message: 'Venue added.' }, { status: 201 })
  } catch (err) {
    console.error('[admin/locations] POST error:', err)
    return NextResponse.json({ ok: false, error: 'Failed to create location' }, { status: 500 })
  }
}
