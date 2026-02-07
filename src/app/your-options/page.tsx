import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import CTAPanel from '@/components/sections/CTAPanel'

export const metadata: Metadata = {
  title: 'Your Options for Selling | A Very Fast Sale',
  description:
    'Compare your options for selling your house: cash sale, assisted sale, or auction. Find the best route for your situation.',
}

const options = [
  {
    title: 'Cash Sale',
    description: 'We buy direct. Fastest route. No fees.',
    details: 'We buy your property directly for cash. No estate agents, no viewings, no chains. You choose the completion date and we handle everything.',
    speed: '7–28 days',
    fees: 'None',
    certainty: 'Very High',
    control: 'High',
  },
  {
    title: 'Assisted Sale',
    description: 'We help you sell on the open market with support.',
    details: 'If you want to test the open market, we can help you list and sell your property with our network of trusted estate agents. You may achieve a higher price but it takes longer.',
    speed: '2–6 months',
    fees: 'Estate agent fees apply',
    certainty: 'Medium',
    control: 'Medium',
  },
  {
    title: 'Auction',
    description: 'We can help you sell at auction if that suits your situation.',
    details: 'Auction can be a good option for unusual properties or those needing significant work. We can guide you through the auction process and help you set a realistic reserve.',
    speed: '4–8 weeks',
    fees: 'Auction fees apply',
    certainty: 'Medium-High',
    control: 'Low',
  },
]

export default function YourOptionsPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="bg-navy py-16">
          <div className="mx-auto max-w-3xl px-4 text-center">
            <h1 className="font-heading text-4xl font-extrabold text-white">
              Your Options for Selling
            </h1>
            <p className="mt-4 text-lg text-white/80">
              Every situation is different. Here are the main routes available to you.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-5xl px-4">
            <div className="grid gap-6 md:grid-cols-3">
              {options.map((opt) => (
                <div key={opt.title} className="rounded-2xl border border-border-grey bg-white p-6 shadow-sm">
                  <h3 className="font-heading text-xl font-bold text-navy">{opt.title}</h3>
                  <p className="mt-1 text-sm font-medium text-green">{opt.description}</p>
                  <p className="mt-4 text-sm text-ink/70">{opt.details}</p>
                </div>
              ))}
            </div>

            {/* Comparison table */}
            <div className="mt-12 overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-border-grey">
                    <th className="p-4 text-left font-heading text-sm font-semibold text-navy"></th>
                    {options.map((opt) => (
                      <th key={opt.title} className="p-4 text-left font-heading text-sm font-semibold text-navy">
                        {opt.title}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: 'Speed', key: 'speed' as const },
                    { label: 'Fees', key: 'fees' as const },
                    { label: 'Certainty', key: 'certainty' as const },
                    { label: 'Control', key: 'control' as const },
                  ].map((row) => (
                    <tr key={row.key} className="border-b border-border-grey">
                      <td className="p-4 font-heading text-sm font-semibold text-navy">{row.label}</td>
                      {options.map((opt) => (
                        <td key={opt.title} className="p-4 text-sm text-ink/70">
                          {opt[row.key]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-8 text-center">
              <Link
                href="/get-offer"
                className="inline-block rounded-[12px] bg-green px-8 py-3.5 font-heading text-base font-bold text-white hover:bg-green-hover"
              >
                Get My Free Cash Offer
              </Link>
            </div>
          </div>
        </section>

        <CTAPanel />
      </main>
      <Footer />
    </>
  )
}
