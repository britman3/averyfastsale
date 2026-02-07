import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-border-grey bg-navy text-white">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div>
            <p className="font-heading text-lg font-extrabold">
              A Very <span className="text-green">Fast</span> Sale
            </p>
            <p className="mt-2 text-sm text-white/70">
              Fair cash offers for properties across England and Wales. No fees, no chains, no hassle.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="mb-3 font-heading text-xs font-semibold uppercase tracking-wide text-white/50">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/how-it-works" className="text-white/70 hover:text-white">How It Works</Link></li>
              <li><Link href="/your-options" className="text-white/70 hover:text-white">Your Options</Link></li>
              <li><Link href="/get-offer" className="text-white/70 hover:text-white">Get an Offer</Link></li>
              <li><Link href="/reviews" className="text-white/70 hover:text-white">Reviews</Link></li>
              <li><Link href="/faq" className="text-white/70 hover:text-white">FAQ</Link></li>
            </ul>
          </div>

          {/* Situations */}
          <div>
            <h4 className="mb-3 font-heading text-xs font-semibold uppercase tracking-wide text-white/50">
              Situations
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/situations/probate" className="text-white/70 hover:text-white">Probate</Link></li>
              <li><Link href="/situations/divorce" className="text-white/70 hover:text-white">Divorce</Link></li>
              <li><Link href="/situations/arrears" className="text-white/70 hover:text-white">Mortgage Arrears</Link></li>
              <li><Link href="/situations/tenants" className="text-white/70 hover:text-white">Tenant Problems</Link></li>
              <li><Link href="/situations/relocating" className="text-white/70 hover:text-white">Relocating</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="mb-3 font-heading text-xs font-semibold uppercase tracking-wide text-white/50">
              Legal
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/privacy" className="text-white/70 hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/cookies" className="text-white/70 hover:text-white">Cookie Policy</Link></li>
              <li><Link href="/terms" className="text-white/70 hover:text-white">Terms &amp; Conditions</Link></li>
              <li><Link href="/contact" className="text-white/70 hover:text-white">Contact Us</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10 pt-6 text-center text-xs text-white/40">
          &copy; {new Date().getFullYear()} A Very Fast Sale. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
