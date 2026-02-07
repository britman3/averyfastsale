import Link from 'next/link'

export default function CTAPanel() {
  return (
    <section className="bg-green py-16">
      <div className="mx-auto max-w-3xl px-4 text-center">
        <h2 className="font-heading text-3xl font-bold text-white">
          Ready to Get Your Free Cash Offer?
        </h2>
        <p className="mt-3 text-lg text-white/80">
          No obligation. No fees. Just a fair offer.
        </p>
        <Link
          href="/get-offer"
          className="mt-8 inline-block rounded-[12px] bg-white px-10 py-4 font-heading text-base font-bold text-green transition-colors hover:bg-warm-white"
        >
          Get My Offer
        </Link>
      </div>
    </section>
  )
}
