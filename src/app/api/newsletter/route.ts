import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'

const subscribeSchema = z.object({
  email: z.string().email('Please enter a valid email address').max(254),
  source: z.string().max(64).optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = subscribeSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error:
            parsed.error.issues[0]?.message ??
            'Invalid request. Please check your input.',
        },
        { status: 400 }
      )
    }

    const email = parsed.data.email.toLowerCase().trim()

    const existing = await db.newsletterSubscriber.findUnique({
      where: { email },
    })

    if (existing) {
      return NextResponse.json(
        { ok: true, alreadySubscribed: true, message: 'You are already on the list. See you in the shadows!' },
        { status: 200 }
      )
    }

    await db.newsletterSubscriber.create({
      data: {
        email,
        source: parsed.data.source ?? 'landing-page',
      },
    })

    return NextResponse.json(
      { ok: true, message: 'Subscription confirmed. Brace yourself for the nightmares!' },
      { status: 201 }
    )
  } catch (err) {
    console.error('[newsletter] POST error:', err)
    return NextResponse.json(
      { ok: false, error: 'Something went wrong on our side. Please try again.' },
      { status: 500 }
    )
  }
}
