import { Suspense } from 'react'
import LeadForm from './LeadForm'

export default function Hero() {
  return (
    <section className="bg-navy">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 md:grid-cols-2 md:items-center md:py-24">
        {/* Left - copy */}
        <div>
          <h1 className="font-heading text-4xl font-extrabold leading-tight text-white md:text-[44px]">
            Sell Your House in as Little as 48 Hours
          </h1>
          <p className="mt-4 text-lg text-white/80">
            Fair cash offer. No estate agents. No fees. No chains. We handle everything so you can move on with your life.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <span className="rounded-full bg-green/20 px-4 py-1.5 text-sm font-medium text-green">
              No Fees
            </span>
            <span className="rounded-full bg-green/20 px-4 py-1.5 text-sm font-medium text-green">
              No Viewings
            </span>
            <span className="rounded-full bg-green/20 px-4 py-1.5 text-sm font-medium text-green">
              No Chains
            </span>
          </div>
        </div>

        {/* Right - compact form */}
        <div>
          <Suspense fallback={<div className="h-80 animate-pulse rounded-[20px] bg-light-grey" />}>
            <LeadForm compact />
          </Suspense>
        </div>
      </div>
    </section>
  )
}
