import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CTAPanel from '@/components/sections/CTAPanel'

export const metadata: Metadata = {
  title: 'Reviews | A Very Fast Sale',
  description:
    'Read reviews from homeowners who have sold their properties with A Very Fast Sale.',
}

const reviews = [
  { name: 'J. Thompson', location: 'Birmingham', stars: 5, quote: 'We were in a difficult situation with our inherited property. A Very Fast Sale made the whole process painless. We had a cash offer in 24 hours and completed in 2 weeks.' },
  { name: 'S. Williams', location: 'Manchester', stars: 5, quote: 'Going through a divorce and needed to sell quickly. They were professional, fast, and offered a fair price. No estate agent fees was a huge bonus.' },
  { name: 'M. Patel', location: 'Leicester', stars: 5, quote: 'I was behind on my mortgage and panicking. A Very Fast Sale stepped in, made a quick offer, and took all the stress away. Completed in just 10 days.' },
  { name: 'R. Hughes', location: 'Bristol', stars: 5, quote: 'Needed to relocate for work at short notice. They made the whole process seamless. Cash in the bank within 3 weeks.' },
  { name: 'A. Khan', location: 'Leeds', stars: 5, quote: 'Had a tenant who trashed the place. They bought it as-is without any fuss. Fair offer and quick completion.' },
  { name: 'D. O\'Brien', location: 'Liverpool', stars: 5, quote: 'Mum passed and we needed to sell her house. They were respectful, patient, and made it easy. Would recommend to anyone in the same situation.' },
  { name: 'C. Evans', location: 'Cardiff', stars: 5, quote: 'Downsizing after the kids moved out. No viewings, no chains, no stress. Exactly what we needed.' },
  { name: 'L. Bennett', location: 'Nottingham', stars: 5, quote: 'We explored multiple options and A Very Fast Sale offered the best combination of speed and price. Completed in under 2 weeks.' },
]

export default function ReviewsPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="bg-navy py-16">
          <div className="mx-auto max-w-3xl px-4 text-center">
            <h1 className="font-heading text-4xl font-extrabold text-white">
              Reviews
            </h1>
            <p className="mt-4 text-lg text-white/80">
              Don&apos;t just take our word for it — hear from homeowners who&apos;ve sold with us.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-5xl px-4">
            <div className="grid gap-6 md:grid-cols-2">
              {reviews.map((r) => (
                <div key={r.name} className="rounded-2xl border border-border-grey bg-white p-6 shadow-sm">
                  <div className="mb-3 flex gap-1 text-amber">
                    {Array.from({ length: r.stars }).map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                  <p className="text-ink/80">&ldquo;{r.quote}&rdquo;</p>
                  <p className="mt-4 font-heading text-sm font-semibold text-navy">
                    {r.name}, {r.location}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <CTAPanel />
      </main>
      <Footer />
    </>
  )
}
