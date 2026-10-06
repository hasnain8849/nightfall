/**
 * Nightfall — idempotent seed for admin-managed site content.
 * Run: bun /home/z/my-project/scripts/seed-nightfall.ts
 */
import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

const HERO = {
  id: 'hero',
  mediaType: 'video',
  mediaUrl: '/assets/videos/hero-moon.mp4',
  posterUrl: '/assets/img_00.jpg',
}

const VIDEOS = [
  {
    title: 'Official Aftermovie: Into The Shadows',
    subtitle:
      "Heart-racing lasers, sinister maze screams and pyrotechnic ecstasy from last year's sold-out Nightfall.",
    videoUrl: '/assets/videos/g-laser-green.mp4',
    posterUrl: '/assets/videos/posters/g-laser-green.jpg',
    duration: '04:28',
    badge: '4K ULTRA HD',
    sortOrder: 1,
  },
  {
    title: 'Main Stage Rave Sets',
    subtitle: 'Laser storms, live drops and 10,000 hands in the air — the full rave chaos, uncut.',
    videoUrl: '/assets/videos/g-laser-blue.mp4',
    posterUrl: '/assets/videos/posters/g-laser-blue.jpg',
    duration: '03:15',
    badge: 'MAIN STAGE',
    sortOrder: 2,
  },
  {
    title: 'Cursed Forest Rave',
    subtitle:
      'Deep in the woods the beat never stops. Lanterns, fog and a crowd that lost track of midnight.',
    videoUrl: '/assets/videos/g-forest-rave.mp4',
    posterUrl: '/assets/videos/posters/g-forest-rave.jpg',
    duration: '02:40',
    badge: 'FOREST ZONE',
    sortOrder: 3,
  },
  {
    title: 'Storm Over The Arena',
    subtitle: 'The night the sky joined us — lightning rolling over the arena as the crowd roared back.',
    videoUrl: '/assets/videos/g-storm.mp4',
    posterUrl: '/assets/videos/posters/g-storm.jpg',
    duration: '01:55',
    badge: 'NIGHT SKY',
    sortOrder: 4,
  },
  {
    title: 'Hellfire Finale',
    subtitle: 'Sparks raining over the grounds — the closing bonfire ritual that ended the night in embers.',
    videoUrl: '/assets/videos/g-hellfire.mp4',
    posterUrl: '/assets/videos/posters/g-hellfire.jpg',
    duration: '02:18',
    badge: 'FINALE',
    sortOrder: 5,
  },
  {
    title: 'The Crypt Lounge',
    subtitle: 'VIP potions and dark techno pours — resident alchemists spinning till 2 AM.',
    videoUrl: '/assets/videos/g-crypt.mp4',
    posterUrl: '/assets/videos/posters/g-crypt.jpg',
    duration: '02:05',
    badge: 'VIP LOUNGE',
    sortOrder: 6,
  },
]

const LOCATIONS = [
  {
    name: 'The Grand Arena',
    address: 'Expo Centre, Ferozepur Road',
    city: 'Lahore, Pakistan',
    gatesOpen: '8:00 PM',
    eventTime: '8:00 PM – 2:00 AM',
    parking: 'Available On-site',
    directionsUrl:
      'https://www.google.com/maps/search/?api=1&query=Expo+Centre+Ferozepur+Road+Lahore+Pakistan',
    sortOrder: 1,
  },
  {
    name: 'The Crypt Warehouse',
    address: 'Plot 17, Korangi Creek Industrial Zone',
    city: 'Karachi, Pakistan',
    gatesOpen: '8:30 PM',
    eventTime: '8:30 PM – 2:30 AM',
    parking: 'Valet + On-site',
    directionsUrl:
      'https://www.google.com/maps/search/?api=1&query=Korangi+Creek+Industrial+Zone+Karachi+Pakistan',
    sortOrder: 2,
  },
  {
    name: "Witches' Hollow Grounds",
    address: 'Shahdara Valley, Ring Road Exit 3',
    city: 'Islamabad, Pakistan',
    gatesOpen: '8:00 PM',
    eventTime: '8:00 PM – 2:00 AM',
    parking: 'Shuttle + On-site',
    directionsUrl:
      'https://www.google.com/maps/search/?api=1&query=Shahdara+Valley+Islamabad+Pakistan',
    sortOrder: 3,
  },
]

async function main() {
  // Hero singleton
  const heroCount = await db.heroSettings.count({ where: { id: 'hero' } })
  if (heroCount === 0) {
    await db.heroSettings.create({ data: HERO })
    console.log('✓ seeded HeroSettings')
  } else {
    console.log('• HeroSettings already present, skipped')
  }

  // Videos — upsert by unique videoUrl
  for (const v of VIDEOS) {
    const existing = await db.galleryVideo.findFirst({ where: { videoUrl: v.videoUrl } })
    if (!existing) {
      await db.galleryVideo.create({ data: v })
      console.log(`✓ seeded video "${v.title}"`)
    } else {
      console.log(`• video "${v.title}" already present, skipped`)
    }
  }

  // Locations — upsert by name+city
  for (const l of LOCATIONS) {
    const existing = await db.eventLocation.findFirst({
      where: { name: l.name, city: l.city },
    })
    if (!existing) {
      await db.eventLocation.create({ data: l })
      console.log(`✓ seeded location "${l.name}"`)
    } else {
      console.log(`• location "${l.name}" already present, skipped`)
    }
  }

  const counts = {
    hero: await db.heroSettings.count(),
    videos: await db.galleryVideo.count(),
    locations: await db.eventLocation.count(),
  }
  console.log('Done:', JSON.stringify(counts))
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => db.$disconnect())
