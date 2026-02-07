import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'amber'
  size?: 'default' | 'sm' | 'lg'
  loading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'default', loading, children, className = '', disabled, ...props }, ref) => {
    const base =
      'inline-flex items-center justify-center font-heading font-bold rounded-[12px] transition-colors focus:outline-none focus:ring-2 focus:ring-green focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

    const variants = {
      primary: 'bg-green text-white hover:bg-green-hover',
      secondary: 'bg-white text-navy border-2 border-navy hover:bg-light-grey',
      amber: 'bg-amber hover:bg-amber/90 text-navy',
    }

    const sizes = {
      sm: 'h-10 px-4 text-sm',
      default: 'h-[52px] px-8 text-[15px]',
      lg: 'h-14 px-10 text-base',
    }

    return (
      <button
        ref={ref}
        className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'

export default Button
