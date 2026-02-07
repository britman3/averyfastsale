'use client'

import { useState } from 'react'

interface FAQItem {
  question: string
  answer: string
}

const defaultFAQs: FAQItem[] = [
  {
    question: 'How quickly can you buy my house?',
    answer:
      'We can make an offer within 24–48 hours and complete in as little as 7 days, though most sales complete in 2–4 weeks.',
  },
  {
    question: 'Do I have to pay any fees?',
    answer:
      'No. There are no fees, no commissions, and no hidden charges.',
  },
  {
    question: 'What if my house needs work?',
    answer:
      'We buy houses in any condition. No repairs or cleaning needed.',
  },
  {
    question: 'Am I under any obligation?',
    answer:
      'Absolutely not. Our offer is free and there is no obligation to accept.',
  },
  {
    question: 'How do you calculate your offer?',
    answer:
      'We assess the property based on its location, condition, and current market value, then make a fair cash offer.',
  },
  {
    question: 'What types of property do you buy?',
    answer:
      'We buy houses, flats, bungalows, and land across England and Wales.',
  },
]

export default function FAQAccordion({ items }: { items?: FAQItem[] }) {
  const faqs = items || defaultFAQs
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="py-16">
      <div className="mx-auto max-w-3xl px-4">
        <h2 className="text-center font-heading text-3xl font-bold text-navy">
          Frequently Asked Questions
        </h2>
        <div className="mt-10 space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-xl border border-border-grey bg-white"
            >
              <button
                className="flex w-full items-center justify-between p-5 text-left"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <span className="font-heading text-base font-semibold text-navy">
                  {faq.question}
                </span>
                <svg
                  className={`h-5 w-5 shrink-0 text-navy transition-transform ${
                    openIndex === i ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openIndex === i && (
                <div className="border-t border-border-grey px-5 pb-5 pt-3 text-ink/70">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
