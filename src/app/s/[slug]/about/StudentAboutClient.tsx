'use client'

import Image from 'next/image'
import Link from 'next/link'

interface StudentAboutProps {
  student: {
    id: string
    slug: string
    displayName: string
    phone: string
    email: string
    whatsappNumber: string | null
    headshotUrl: string | null
    bio: string | null
    serviceAreas: {
      areaType: string
      areaValue: string
    }[]
  }
}

export default function StudentAboutClient({ student }: StudentAboutProps) {
  const whatsappLink = student.whatsappNumber
    ? `https://wa.me/${student.whatsappNumber.replace(/^0/, '44').replace(/\s/g, '')}`
    : null

  return (
    <>
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4">
          {/* Student photo */}
          <div className="mb-8 flex justify-center">
            {student.headshotUrl ? (
              <Image
                src={student.headshotUrl}
                alt={student.displayName}
                width={200}
                height={200}
                className="rounded-full border-4 border-green object-cover"
              />
            ) : (
              <div className="flex h-48 w-48 items-center justify-center rounded-full bg-light-grey text-4xl font-bold text-navy">
                {student.displayName
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </div>
            )}
          </div>

          {/* Name */}
          <h1 className="text-center font-heading text-4xl font-bold text-navy">
            {student.displayName}
          </h1>
          <p className="mt-2 text-center text-lg text-ink/60">Local Property Specialist</p>

          {/* Bio */}
          {student.bio && (
            <div className="mt-8">
              <p className="text-lg leading-relaxed text-ink/80">{student.bio}</p>
            </div>
          )}

          {/* Service areas */}
          {student.serviceAreas.length > 0 && (
            <div className="mt-10">
              <h2 className="font-heading text-xl font-bold text-navy">Areas I Cover</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {student.serviceAreas.map((area) => (
                  <span
                    key={`${area.areaType}-${area.areaValue}`}
                    className="rounded-full bg-green/10 px-4 py-2 text-sm font-medium text-navy"
                  >
                    {area.areaValue}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Contact details */}
          <div className="mt-10">
            <h2 className="font-heading text-xl font-bold text-navy">Get in Touch</h2>
            <div className="mt-4 space-y-3">
              <p>
                <a
                  href={`tel:${student.phone}`}
                  className="text-lg font-semibold text-green hover:text-green-hover"
                >
                  {student.phone}
                </a>
              </p>
              {whatsappLink && (
                <p>
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-green hover:text-green-hover"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    WhatsApp
                  </a>
                </p>
              )}
              <p>
                <a
                  href={`mailto:${student.email}`}
                  className="text-green hover:text-green-hover"
                >
                  {student.email}
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Backed by A Very Fast Sale */}
      <section className="border-t border-border-grey bg-white py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <p className="font-heading text-sm font-semibold uppercase tracking-wide text-ink/50">
            Backed By
          </p>
          <p className="mt-2 font-heading text-2xl font-bold text-navy">
            A Very <span className="text-green">Fast</span> Sale
          </p>
          <p className="mt-4 text-ink/70">
            {student.displayName} works with A Very Fast Sale, a UK-wide property buying service.
            We make fair cash offers with no fees, no chains, and no obligation.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-green py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="font-heading text-3xl font-bold text-white">
            Ready to Get Your Free Cash Offer?
          </h2>
          <p className="mt-3 text-lg text-white/80">
            No obligation. No fees. Just a fair offer.
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
