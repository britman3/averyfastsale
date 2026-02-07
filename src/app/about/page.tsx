import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CTAPanel from '@/components/sections/CTAPanel'

export const metadata: Metadata = {
  title: 'About Us | A Very Fast Sale',
  description:
    'Learn about A Very Fast Sale — our mission, values, and commitment to helping homeowners sell their properties quickly and fairly.',
}

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="bg-navy py-16">
          <div className="mx-auto max-w-3xl px-4 text-center">
            <h1 className="font-heading text-4xl font-extrabold text-white">
              About A Very Fast Sale
            </h1>
            <p className="mt-4 text-lg text-white/80">
              We help homeowners across England and Wales sell their properties quickly, fairly, and without the usual stress.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-3xl space-y-8 px-4">
            <div>
              <h2 className="font-heading text-2xl font-bold text-navy">Our Mission</h2>
              <p className="mt-3 text-ink/70">
                We believe selling a house shouldn&apos;t take months of uncertainty, endless viewings, and unexpected costs. Our mission is to provide a genuine alternative — a fast, fair cash offer with no fees, no chains, and no obligation.
              </p>
            </div>
            <div>
              <h2 className="font-heading text-2xl font-bold text-navy">How We&apos;re Different</h2>
              <p className="mt-3 text-ink/70">
                Unlike traditional estate agents, we buy properties directly for cash. This means no waiting for mortgage approvals, no chains that can collapse, and no commission fees. We handle the solicitors, the paperwork, and the timeline — you just choose when you want to complete.
              </p>
            </div>
            <div>
              <h2 className="font-heading text-2xl font-bold text-navy">Our Values</h2>
              <ul className="mt-3 space-y-2 text-ink/70">
                <li><strong>Transparency:</strong> No hidden fees, no pressure tactics, no small print.</li>
                <li><strong>Speed:</strong> We make offers within 24–48 hours and can complete in as little as 7 days.</li>
                <li><strong>Fairness:</strong> Our offers are based on genuine market research and property valuation.</li>
                <li><strong>Respect:</strong> We understand every seller&apos;s situation is unique and treat each case with care.</li>
              </ul>
            </div>
          </div>
        </section>

        <CTAPanel />
      </main>
      <Footer />
    </>
  )
}
