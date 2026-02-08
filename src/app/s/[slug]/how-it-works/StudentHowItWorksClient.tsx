'use client'

import Link from 'next/link'

interface Props {
  studentName: string
}

const getSteps = (name: string) => [
  {
    number: '1',
    title: 'Tell Us About Your Property',
    description: `Fill in a few details about your property. ${name} will review them personally.`,
  },
  {
    number: '2',
    title: 'Receive a Cash Offer',
    description: `${name} will come back with a fair, no-obligation cash offer within 24–48 hours.`,
  },
  {
    number: '3',
    title: 'Complete on Your Timeline',
    description: `Accept and ${name} handles the process. You choose the completion date.`,
  },
]

export default function StudentHowItWorksClient({ studentName }: Props) {
  const steps = getSteps(studentName)

  return (
    <>
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h1 className="text-center font-heading text-4xl font-bold text-navy">
            How It Works
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-ink/70">
            Selling your house with {studentName} is simple. Here&apos;s the process:
          </p>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.number} className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green font-heading text-xl font-bold text-white">
                  {step.number}
                </div>
                <h3 className="mt-4 font-heading text-xl font-bold text-navy">
                  {step.title}
                </h3>
                <p className="mt-2 text-ink/70">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional detail */}
      <section className="border-t border-border-grey bg-white py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="font-heading text-2xl font-bold text-navy">
            Why Sell with {studentName}?
          </h2>
          <ul className="mt-6 space-y-4 text-ink/80">
            <li className="flex gap-3">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green text-sm font-bold text-white">
                &#10003;
              </span>
              <span><strong>No fees or commissions</strong> — we buy directly, so you keep more.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green text-sm font-bold text-white">
                &#10003;
              </span>
              <span><strong>No chain</strong> — we&apos;re cash buyers, so there&apos;s no chain to break.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green text-sm font-bold text-white">
                &#10003;
              </span>
              <span><strong>Any condition</strong> — we buy houses regardless of condition or situation.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green text-sm font-bold text-white">
                &#10003;
              </span>
              <span><strong>Your timeline</strong> — complete when it suits you, from 7 days to several months.</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Backed by A Very Fast Sale */}
      <section className="border-t border-border-grey bg-warm-white py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <p className="font-heading text-sm font-semibold uppercase tracking-wide text-ink/50">
            Backed By
          </p>
          <p className="mt-2 font-heading text-2xl font-bold text-navy">
            A Very <span className="text-green">Fast</span> Sale
          </p>
          <p className="mt-4 text-ink/70">
            {studentName} works with A Very Fast Sale, a UK-wide property buying service.
            We make fair cash offers with no fees, no chains, and no obligation.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-green py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="font-heading text-3xl font-bold text-white">
            Ready to Get Started?
          </h2>
          <p className="mt-3 text-lg text-white/80">
            Get your free, no-obligation cash offer from {studentName}.
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
