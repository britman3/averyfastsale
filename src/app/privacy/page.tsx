import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Privacy Policy | A Very Fast Sale',
  description: 'How A Very Fast Sale collects, uses, and protects your personal data.',
}

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="py-12">
        <div className="mx-auto max-w-3xl px-4">
          <h1 className="mb-8 font-heading text-3xl font-extrabold text-navy">Privacy Policy</h1>
          <div className="space-y-6 text-ink/80 leading-relaxed">
            <p>Last updated: February 2026</p>
            <h2 className="font-heading text-xl font-bold text-navy">1. Who We Are</h2>
            <p>A Very Fast Sale (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) is committed to protecting your privacy. This policy explains how we collect, use, and protect your personal data when you use our website and services.</p>

            <h2 className="font-heading text-xl font-bold text-navy">2. What Data We Collect</h2>
            <p>When you submit a form on our website, we collect: your name, phone number, email address (optional), property address, postcode, approximate property value, reason for sale, timeline, and consent information including timestamp and IP address.</p>
            <p>We also collect technical data including UTM parameters, referrer URL, and browser information for analytics purposes.</p>

            <h2 className="font-heading text-xl font-bold text-navy">3. How We Use Your Data</h2>
            <p>We use your data to: provide you with a property valuation and cash offer, connect you with a local property specialist, communicate with you about our services, and improve our website and services.</p>

            <h2 className="font-heading text-xl font-bold text-navy">4. Legal Basis for Processing</h2>
            <p>We process your data based on: your consent (when you submit a form and check the consent box), our legitimate interest in providing property buying services, and legal obligations (anti-money laundering regulations).</p>

            <h2 className="font-heading text-xl font-bold text-navy">5. Data Sharing</h2>
            <p>We may share your data with: our local property specialists who will contact you about your property, our solicitors and legal partners involved in any transaction, and service providers who help us operate our business (hosting, email).</p>
            <p>We will never sell your data to third parties for marketing purposes.</p>

            <h2 className="font-heading text-xl font-bold text-navy">6. Data Retention</h2>
            <p>We retain your data for as long as necessary to provide our services, typically up to 6 years after your last interaction with us, in line with UK legal requirements.</p>

            <h2 className="font-heading text-xl font-bold text-navy">7. Your Rights</h2>
            <p>Under the UK GDPR, you have the right to: access your personal data, correct inaccurate data, request deletion of your data, restrict processing, data portability, and object to processing.</p>
            <p>To exercise any of these rights, contact us at privacy@averyfastsale.com.</p>

            <h2 className="font-heading text-xl font-bold text-navy">8. Contact Us</h2>
            <p>If you have questions about this privacy policy, contact us at: privacy@averyfastsale.com</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
