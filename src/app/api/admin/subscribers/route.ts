import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { guard } from '@/lib/admin-auth'

export async function GET(req: NextRequest) {
  const denied = guard(req)
  if (denied) return denied

  try {
    const subscribers = await db.newsletterSubscriber.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ ok: true, subscribers })
  } catch (err) {
    console.error('[admin/subscribers] GET error:', err)
    return NextResponse.json({ ok: false, error: 'Failed to load subscribers' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const denied = guard(req)
  if (denied) return denied

  try {
    const id = req.nextUrl.searchParams.get('id')
    if (!id) {
      return NextResponse.json({ ok: false, error: 'Missing subscriber id' }, { status: 400 })
    }
    await db.newsletterSubscriber.delete({ where: { id } })
    return NextResponse.json({ ok: true, message: 'Subscriber removed.' })
  } catch (err) {
    console.error('[admin/subscribers] DELETE error:', err)
    return NextResponse.json({ ok: false, error: 'Failed to delete subscriber' }, { status: 500 })
  }
}
