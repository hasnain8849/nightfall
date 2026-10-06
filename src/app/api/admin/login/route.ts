import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { ADMIN_COOKIE, adminPasscode, expectedToken } from '@/lib/admin-auth'

const loginSchema = z.object({
  passcode: z.string().min(1, 'Passcode is required').max(128),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = loginSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: parsed.error.issues[0]?.message ?? 'Invalid request' },
        { status: 400 }
      )
    }

    if (parsed.data.passcode !== adminPasscode()) {
      return NextResponse.json(
        { ok: false, error: 'Incorrect passcode. The gates remain sealed.' },
        { status: 401 }
      )
    }

    const res = NextResponse.json({ ok: true, message: 'Welcome back to the crypt.' })
    res.cookies.set(ADMIN_COOKIE, expectedToken(), {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 8, // 8 hours
    })
    return res
  } catch (err) {
    console.error('[admin/login] error:', err)
    return NextResponse.json({ ok: false, error: 'Login failed. Try again.' }, { status: 500 })
  }
}
