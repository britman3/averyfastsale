const testimonials = [
  {
    quote:
      'We were in a difficult situation with our inherited property. A Very Fast Sale made the whole process painless. We had a cash offer in 24 hours and completed in 2 weeks.',
    name: 'J. Thompson',
    location: 'Birmingham',
  },
  {
    quote:
      'Going through a divorce and needed to sell quickly. They were professional, fast, and offered a fair price. No estate agent fees was a huge bonus.',
    name: 'S. Williams',
    location: 'Manchester',
  },
  {
    quote:
      'I was behind on my mortgage and panicking. A Very Fast Sale stepped in, made a quick offer, and took all the stress away. Completed in just 10 days.',
    name: 'M. Patel',
    location: 'Leicester',
  },
]

export default function Testimonials() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-center font-heading text-3xl font-bold text-navy">
          What Our Sellers Say
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="rounded-2xl border border-border-grey bg-white p-6 shadow-sm"
            >
              <div className="mb-3 flex gap-1 text-amber">
                {'★★★★★'.split('').map((s, i) => (
                  <span key={i}>{s}</span>
                ))}
              </div>
              <p className="text-ink/80">&ldquo;{t.quote}&rdquo;</p>
              <p className="mt-4 font-heading text-sm font-semibold text-navy">
                {t.name}, {t.location}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
