import { Suspense } from 'react'
import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import LeadForm from '@/components/sections/LeadForm'

export const metadata: Metadata = {
  title: 'Contact Us | A Very Fast Sale',
  description:
    'Get in touch with A Very Fast Sale. Call, email, or fill in our form to get a free cash offer for your property.',
}

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="py-12">
        <div className="mx-auto max-w-4xl px-4">
          <h1 className="mb-2 text-center font-heading text-3xl font-extrabold text-navy md:text-4xl">
            Contact Us
          </h1>
          <p className="mb-8 text-center text-ink/70">
            Ready to sell? Have a question? Get in touch and we&apos;ll get back to you as soon as possible.
          </p>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-6">
              <div className="rounded-2xl border border-border-grey bg-white p-6">
                <h3 className="font-heading text-lg font-bold text-navy">Phone</h3>
                <p className="mt-1 text-ink/70">0800 XXX XXXX</p>
                <p className="text-sm text-ink/50">Mon–Fri, 9am–6pm</p>
              </div>
              <div className="rounded-2xl border border-border-grey bg-white p-6">
                <h3 className="font-heading text-lg font-bold text-navy">Email</h3>
                <p className="mt-1 text-ink/70">info@averyfastsale.com</p>
              </div>
              <div className="rounded-2xl border border-border-grey bg-white p-6">
                <h3 className="font-heading text-lg font-bold text-navy">Response Time</h3>
                <p className="mt-1 text-ink/70">
                  We aim to respond to all enquiries within 2 hours during business hours.
                </p>
              </div>
            </div>

            <Suspense fallback={<div className="h-96 animate-pulse rounded-[20px] bg-light-grey" />}>
              <LeadForm />
            </Suspense>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
