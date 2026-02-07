import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import FAQAccordion from '@/components/sections/FAQAccordion'
import CTAPanel from '@/components/sections/CTAPanel'

export const metadata: Metadata = {
  title: 'FAQ | A Very Fast Sale',
  description:
    'Frequently asked questions about selling your house fast for cash with A Very Fast Sale.',
}

const fullFAQs = [
  { question: 'How quickly can you buy my house?', answer: 'We can make an offer within 24–48 hours and complete in as little as 7 days, though most sales complete in 2–4 weeks.' },
  { question: 'Do I have to pay any fees?', answer: 'No. There are no fees, no commissions, and no hidden charges.' },
  { question: 'What if my house needs work?', answer: 'We buy houses in any condition. No repairs or cleaning needed.' },
  { question: 'Am I under any obligation?', answer: 'Absolutely not. Our offer is free and there is no obligation to accept.' },
  { question: 'How do you calculate your offer?', answer: 'We assess the property based on its location, condition, and current market value, then make a fair cash offer.' },
  { question: 'What types of property do you buy?', answer: 'We buy houses, flats, bungalows, and land across England and Wales.' },
  { question: 'Do you buy houses with sitting tenants?', answer: 'Yes. We buy tenanted properties regardless of the tenancy situation, including properties with problem tenants.' },
  { question: 'Can you buy my house if I\'m in arrears?', answer: 'Yes. We work with homeowners in mortgage arrears to provide a fast sale that can help avoid repossession.' },
  { question: 'Do you buy leasehold properties?', answer: 'Yes, we buy both freehold and leasehold properties.' },
  { question: 'What areas do you cover?', answer: 'We buy properties across England and Wales.' },
  { question: 'What happens after I submit my details?', answer: 'A local property specialist will review your details and contact you within 24 hours to discuss your property and provide a cash offer.' },
  { question: 'Can I change my mind after accepting an offer?', answer: 'Yes. You can withdraw at any time before exchange of contracts without any penalty.' },
  { question: 'How does a probate sale work?', answer: 'We can buy probate properties once the grant of probate has been issued. We work with your solicitor to ensure a smooth process and can often complete faster than traditional sales.' },
]

export default function FAQPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="bg-navy py-16">
          <div className="mx-auto max-w-3xl px-4 text-center">
            <h1 className="font-heading text-4xl font-extrabold text-white">
              Frequently Asked Questions
            </h1>
            <p className="mt-4 text-lg text-white/80">
              Everything you need to know about selling your house fast for cash.
            </p>
          </div>
        </section>

        <FAQAccordion items={fullFAQs} />
        <CTAPanel />
      </main>
      <Footer />
    </>
  )
}
