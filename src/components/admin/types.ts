export interface HeroSettings {
  id: string
  mediaType: 'video' | 'image'
  mediaUrl: string
  posterUrl: string | null
  updatedAt: string
}

export interface GalleryVideo {
  id: string
  title: string
  subtitle: string | null
  videoUrl: string
  posterUrl: string | null
  duration: string | null
  badge: string | null
  sortOrder: number
  active: boolean
}

export interface EventLocation {
  id: string
  name: string
  address: string | null
  city: string
  gatesOpen: string | null
  eventTime: string | null
  parking: string | null
  directionsUrl: string | null
  sortOrder: number
  active: boolean
}

export interface Subscriber {
  id: string
  email: string
  source: string
  createdAt: string
}

export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

export async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
    ...init,
  })
  const data = await res.json().catch(() => ({}))
  if (res.status === 401) {
    throw new ApiError(data.error || 'Unauthorized', 401)
  }
  if (!res.ok || data.ok === false) {
    throw new ApiError(data.error || 'Request failed', res.status)
  }
  return data as T
}
