export default function TrustBar() {
  const badges = [
    { icon: '⚡', label: '24–48 Hour Offer' },
    { icon: '💷', label: 'No Fees or Commissions' },
    { icon: '🏠', label: 'Cash Buyer — No Chain' },
  ]

  return (
    <section className="border-b border-border-grey bg-white py-6">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-8 px-4">
        {badges.map((badge) => (
          <div key={badge.label} className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-light text-lg">
              {badge.icon}
            </span>
            <span className="font-heading text-sm font-semibold text-navy">{badge.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
