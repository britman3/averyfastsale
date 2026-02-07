import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Cookie Policy | A Very Fast Sale',
  description: 'How A Very Fast Sale uses cookies on our website.',
}

export default function CookiesPage() {
  return (
    <>
      <Navbar />
      <main className="py-12">
        <div className="mx-auto max-w-3xl px-4">
          <h1 className="mb-8 font-heading text-3xl font-extrabold text-navy">Cookie Policy</h1>
          <div className="space-y-6 text-ink/80 leading-relaxed">
            <p>Last updated: February 2026</p>

            <h2 className="font-heading text-xl font-bold text-navy">What Are Cookies</h2>
            <p>Cookies are small text files stored on your device when you visit a website. They help the website function properly and provide information to the site owners.</p>

            <h2 className="font-heading text-xl font-bold text-navy">Cookies We Use</h2>
            <p><strong>Essential cookies:</strong> These are necessary for the website to function. They enable basic features like page navigation and form submission. These cannot be disabled.</p>
            <p><strong>Analytics cookies:</strong> We use these to understand how visitors interact with our website, helping us improve our service. These are only set with your consent.</p>

            <h2 className="font-heading text-xl font-bold text-navy">Managing Cookies</h2>
            <p>You can control cookies through your browser settings. Disabling essential cookies may affect the functionality of our website.</p>

            <h2 className="font-heading text-xl font-bold text-navy">Contact</h2>
            <p>If you have questions about our use of cookies, contact us at privacy@averyfastsale.com.</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
