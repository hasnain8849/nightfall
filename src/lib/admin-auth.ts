import { createHash } from 'crypto'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export const ADMIN_COOKIE = 'nf_admin'

/** Default passcode — override with ADMIN_PASSCODE env var */
export function adminPasscode(): string {
  return process.env.ADMIN_PASSCODE || 'nightfall'
}

function tokenFor(passcode: string): string {
  return createHash('sha256').update(`nightfall::${passcode}`).digest('hex')
}

export function expectedToken(): string {
  return tokenFor(adminPasscode())
}

export function isAdmin(req: NextRequest): boolean {
  const cookie = req.cookies.get(ADMIN_COOKIE)?.value
  return !!cookie && cookie === expectedToken()
}

/** Guard for admin API routes — returns a 401 response when unauthorized */
export function guard(req: NextRequest): NextResponse | null {
  if (isAdmin(req)) return null
  return NextResponse.json(
    { ok: false, error: 'Unauthorized. Please sign in to the admin console.' },
    { status: 401 }
  )
}
