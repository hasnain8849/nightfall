import { Navbar } from '@/components/nightfall/navbar'
import { Hero } from '@/components/nightfall/hero'
import { Highlights } from '@/components/nightfall/highlights'
import { Experience } from '@/components/nightfall/experience'
import { Tickets } from '@/components/nightfall/tickets'
import { Gallery } from '@/components/nightfall/gallery'
import { Testimonials } from '@/components/nightfall/testimonials'
import { Location } from '@/components/nightfall/location'
import { Faq } from '@/components/nightfall/faq'
import { Newsletter } from '@/components/nightfall/newsletter'
import { Footer } from '@/components/nightfall/footer'

export default function Home() {
  return (
    <div className="nightfall-root flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Highlights />
        <Experience />
        <Tickets />
        <Gallery />
        <Testimonials />
        <Location />
        <Faq />
        <Newsletter />
      </main>
      <Footer />
    </div>
  )
}
