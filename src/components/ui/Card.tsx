import { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'form'
}

export default function Card({ variant = 'default', children, className = '', ...props }: CardProps) {
  const base = 'rounded-2xl border'
  const variants = {
    default: 'bg-white border-border-grey shadow-[0_2px_12px_rgba(0,0,0,0.04)] p-6',
    form: 'bg-light-grey border-border-grey p-9 rounded-[20px]',
  }

  return (
    <div className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </div>
  )
}
