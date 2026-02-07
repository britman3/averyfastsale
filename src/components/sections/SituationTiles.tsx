import Link from 'next/link'

const situations = [
  { slug: 'probate', label: 'Probate / Inherited', icon: '📋' },
  { slug: 'divorce', label: 'Divorce / Separation', icon: '💔' },
  { slug: 'arrears', label: 'Mortgage Arrears', icon: '⚠️' },
  { slug: 'tenants', label: 'Tenant Problems', icon: '🏚️' },
  { slug: 'relocating', label: 'Relocating', icon: '✈️' },
  { slug: 'downsizing', label: 'Downsizing', icon: '🏡' },
]

export default function SituationTiles() {
  return (
    <section className="bg-light-grey py-16">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-center font-heading text-3xl font-bold text-navy">
          Whatever Your Situation, We Can Help
        </h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {situations.map((s) => (
            <Link
              key={s.slug}
              href={`/situations/${s.slug}`}
              className="flex items-center gap-3 rounded-2xl border border-border-grey bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <span className="text-2xl">{s.icon}</span>
              <span className="font-heading text-base font-semibold text-navy">
                {s.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
