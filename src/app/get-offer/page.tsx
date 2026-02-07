import { Suspense } from 'react'
import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import TrustBar from '@/components/sections/TrustBar'
import LeadForm from '@/components/sections/LeadForm'

export const metadata: Metadata = {
  title: 'Get Your Free Cash Offer | A Very Fast Sale',
  description:
    'Fill in your property details and receive a fair cash offer within 24–48 hours. No fees, no obligation.',
}

export default function GetOfferPage() {
  return (
    <>
      <Navbar />
      <TrustBar />
      <main className="py-12">
        <div className="mx-auto max-w-2xl px-4">
          <h1 className="mb-2 text-center font-heading text-3xl font-extrabold text-navy md:text-4xl">
            Get Your Free Cash Offer
          </h1>
          <p className="mb-8 text-center text-ink/70">
            Tell us about your property and we&apos;ll come back with a fair, no-obligation cash offer within 24–48 hours.
          </p>
          <Suspense fallback={<div className="h-96 animate-pulse rounded-[20px] bg-light-grey" />}>
            <LeadForm />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  )
}
