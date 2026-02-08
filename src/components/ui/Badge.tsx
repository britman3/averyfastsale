import { ReactNode } from 'react'

type BadgeVariant = 'amber' | 'green' | 'navy'

interface BadgeProps {
  variant?: BadgeVariant
  children: ReactNode
  className?: string
}

const variantStyles: Record<BadgeVariant, string> = {
  amber: 'bg-amber-light text-amber',
  green: 'bg-green/10 text-green',
  navy: 'bg-navy/10 text-navy',
}

export default function Badge({
  variant = 'navy',
  children,
  className = '',
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center
        px-3 py-1 rounded-full
        text-xs font-heading font-semibold
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  )
}
