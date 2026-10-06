import { Navbar } from '@/components/nightfall/navbar'
import { Hero } from '@/components/nightfall/hero'
import { Highlights } from '@/components/nightfall/highlights'
import { Tickets } from '@/components/nightfall/tickets'
import { Gallery } from '@/components/nightfall/gallery'
import { Testimonials } from '@/components/nightfall/testimonials'
import { Location } from '@/components/nightfall/location'
import { Faq } from '@/components/nightfall/faq'
import { Newsletter } from '@/components/nightfall/newsletter'
import { Footer } from '@/components/nightfall/footer'
import { db } from '@/lib/db'
import {
  DEFAULT_HERO,
  type HeroMedia,
  type LocationItem,
  type VideoSlide,
} from '@/lib/event-data'

export const dynamic = 'force-dynamic'

async function getSiteContent() {
  try {
    const [heroRow, videos, locations] = await Promise.all([
      db.heroSettings.findUnique({ where: { id: 'hero' } }),
      db.galleryVideo.findMany({ where: { active: true }, orderBy: { sortOrder: 'asc' } }),
      db.eventLocation.findMany({ where: { active: true }, orderBy: { sortOrder: 'asc' } }),
    ])
    const hero: HeroMedia = heroRow
      ? {
          mediaType: heroRow.mediaType === 'image' ? 'image' : 'video',
          mediaUrl: heroRow.mediaUrl,
          posterUrl: heroRow.posterUrl,
        }
      : DEFAULT_HERO
    const slides: VideoSlide[] = videos.map((v) => ({
      id: v.id,
      title: v.title,
      subtitle: v.subtitle,
      videoUrl: v.videoUrl,
      posterUrl: v.posterUrl,
      duration: v.duration,
      badge: v.badge,
    }))
    const spots: LocationItem[] = locations.map((l) => ({
      id: l.id,
      name: l.name,
      address: l.address,
      city: l.city,
      gatesOpen: l.gatesOpen,
      eventTime: l.eventTime,
      parking: l.parking,
      directionsUrl: l.directionsUrl,
    }))
    return { hero, slides, spots }
  } catch (err) {
    console.error('[page] failed to load site content, using defaults:', err)
    return { hero: DEFAULT_HERO, slides: undefined, spots: undefined }
  }
}

export default async function Home() {
  const { hero, slides, spots } = await getSiteContent()

  return (
    <div className="nightfall-root flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero media={hero} />
        <Highlights />
        <Tickets />
        <Gallery videos={slides} />
        <Testimonials />
        <Location locations={spots} />
        <Faq />
        <Newsletter />
      </main>
      <Footer />
    </div>
  )
}
