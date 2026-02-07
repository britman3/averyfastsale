'use client'

import { Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import LeadForm from '@/components/sections/LeadForm'
import TrustBar from '@/components/sections/TrustBar'
import HowItWorks from '@/components/sections/HowItWorks'

interface StudentHomepageProps {
  student: {
    id: string
    slug: string
    displayName: string
    phone: string
    headshotUrl: string | null
    primaryArea: string
  }
}

export default function StudentHomepageClient({ student }: StudentHomepageProps) {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-navy">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 md:grid-cols-2 md:items-center md:py-24">
          {/* Left - copy + student photo */}
          <div>
            <h1 className="font-heading text-4xl font-extrabold leading-tight text-white md:text-[44px]">
              Sell Your House Fast in {student.primaryArea}
            </h1>
            <p className="mt-4 text-lg text-white/80">
              {student.displayName} — your local property specialist
            </p>

            {student.headshotUrl && (
              <div className="mt-6">
                <Image
                  src={student.headshotUrl}
                  alt={student.displayName}
                  width={120}
                  height={120}
                  className="rounded-full border-4 border-green object-cover"
                />
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              <span className="rounded-full bg-green/20 px-4 py-1.5 text-sm font-medium text-green">
                No Fees
              </span>
              <span className="rounded-full bg-green/20 px-4 py-1.5 text-sm font-medium text-green">
                No Chains
              </span>
              <span className="rounded-full bg-green/20 px-4 py-1.5 text-sm font-medium text-green">
                No Obligation
              </span>
            </div>
          </div>

          {/* Right - lead form */}
          <div>
            <Suspense fallback={<div className="h-80 animate-pulse rounded-[20px] bg-light-grey" />}>
              <LeadForm
                captureMode="STUDENT_DIRECT"
                studentId={student.id}
                studentName={student.displayName}
                sourceSubdomainSlug={student.slug}
              />
            </Suspense>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <TrustBar />

      {/* How It Works */}
      <HowItWorks />

      {/* Backed by A Very Fast Sale */}
      <section className="border-t border-border-grey bg-white py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <p className="font-heading text-sm font-semibold uppercase tracking-wide text-ink/50">
            Backed By
          </p>
          <p className="mt-2 font-heading text-2xl font-bold text-navy">
            A Very <span className="text-green">Fast</span> Sale
          </p>
          <p className="mt-4 text-ink/70">
            I work with A Very Fast Sale, a UK-wide property buying service.
            We make fair cash offers with no fees, no chains, and no obligation.
          </p>
        </div>
      </section>

      {/* CTA Panel */}
      <section className="bg-green py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="font-heading text-3xl font-bold text-white">
            Ready to Get Your Free Cash Offer?
          </h2>
          <p className="mt-3 text-lg text-white/80">
            No obligation. No fees. Just a fair offer from {student.displayName}.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-block rounded-[12px] bg-white px-10 py-4 font-heading text-base font-bold text-green transition-colors hover:bg-warm-white"
          >
            Get My Offer
          </Link>
        </div>
      </section>
    </>
  )
}
