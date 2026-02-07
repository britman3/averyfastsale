const steps = [
  {
    number: '1',
    title: 'Tell Us About Your Property',
    description:
      'Fill in a few details. Takes under a minute.',
  },
  {
    number: '2',
    title: 'Receive a Cash Offer',
    description:
      'We review your property and come back with a fair, no-obligation cash offer within 24–48 hours.',
  },
  {
    number: '3',
    title: 'Complete on Your Timeline',
    description:
      'Accept and we handle the legal work. You choose the completion date.',
  },
]

export default function HowItWorks() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-center font-heading text-3xl font-bold text-navy">
          How It Works
        </h2>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
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
  )
}
