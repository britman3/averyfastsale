import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Terms & Conditions | A Very Fast Sale',
  description: 'Terms and conditions for using the A Very Fast Sale website and services.',
}

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="py-12">
        <div className="mx-auto max-w-3xl px-4">
          <h1 className="mb-8 font-heading text-3xl font-extrabold text-navy">Terms &amp; Conditions</h1>
          <div className="space-y-6 text-ink/80 leading-relaxed">
            <p>Last updated: February 2026</p>

            <h2 className="font-heading text-xl font-bold text-navy">1. Introduction</h2>
            <p>These terms and conditions govern your use of the A Very Fast Sale website (averyfastsale.com) and our property buying services.</p>

            <h2 className="font-heading text-xl font-bold text-navy">2. Our Service</h2>
            <p>A Very Fast Sale provides property buying services. We make cash offers on residential properties across England and Wales. All offers are subject to survey, verification, and our standard due diligence.</p>

            <h2 className="font-heading text-xl font-bold text-navy">3. No Guarantees</h2>
            <p>While we strive to provide fair offers and complete transactions quickly, we do not guarantee: any specific offer price, completion within any specific timeframe, or that we will be able to purchase every property submitted to us.</p>

            <h2 className="font-heading text-xl font-bold text-navy">4. Your Obligations</h2>
            <p>When submitting your details, you confirm that: the information provided is accurate, you are the property owner or have authority to sell, and you consent to being contacted about your property.</p>

            <h2 className="font-heading text-xl font-bold text-navy">5. Limitation of Liability</h2>
            <p>A Very Fast Sale shall not be liable for any indirect, incidental, or consequential losses arising from the use of our website or services.</p>

            <h2 className="font-heading text-xl font-bold text-navy">6. Governing Law</h2>
            <p>These terms are governed by the laws of England and Wales.</p>

            <h2 className="font-heading text-xl font-bold text-navy">7. Contact</h2>
            <p>For questions about these terms, contact us at legal@averyfastsale.com.</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
