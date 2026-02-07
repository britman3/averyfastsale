import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import HowItWorks from '@/components/sections/HowItWorks'
import CTAPanel from '@/components/sections/CTAPanel'

export const metadata: Metadata = {
  title: 'How It Works | A Very Fast Sale',
  description:
    'Learn how to sell your house fast in 3 simple steps. Get a cash offer within 48 hours with no fees or obligation.',
}

export default function HowItWorksPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="bg-navy py-16">
          <div className="mx-auto max-w-3xl px-4 text-center">
            <h1 className="font-heading text-4xl font-extrabold text-white">
              How It Works
            </h1>
            <p className="mt-4 text-lg text-white/80">
              Selling your house doesn&apos;t have to be stressful. Our process is simple, fast, and transparent.
            </p>
          </div>
        </section>

        <HowItWorks />

        <section className="bg-light-grey py-16">
          <div className="mx-auto max-w-3xl space-y-8 px-4">
            <div>
              <h2 className="font-heading text-2xl font-bold text-navy">Step 1: Tell Us About Your Property</h2>
              <p className="mt-3 text-ink/70">
                Fill in our simple form with a few details about your property — it takes less than a minute. You can also call us directly if you prefer. We just need the basics: your address, an idea of the property value, and your contact details.
              </p>
            </div>
            <div>
              <h2 className="font-heading text-2xl font-bold text-navy">Step 2: Receive a Cash Offer</h2>
              <p className="mt-3 text-ink/70">
                Our team reviews your property details and researches the local market. Within 24–48 hours, we&apos;ll come back with a fair, no-obligation cash offer. There are no hidden fees and no pressure to accept.
              </p>
            </div>
            <div>
              <h2 className="font-heading text-2xl font-bold text-navy">Step 3: Complete on Your Timeline</h2>
              <p className="mt-3 text-ink/70">
                If you&apos;re happy with the offer, we handle everything — from solicitors to paperwork. You choose the completion date that works for you. We can complete in as little as 7 days, or take longer if that suits your situation.
              </p>
            </div>
          </div>
        </section>

        <CTAPanel />
      </main>
      <Footer />
    </>
  )
}
