import { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

export default function Input({
  label,
  error,
  helperText,
  id,
  className = '',
  ...props
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-ink mb-1"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`
          w-full h-12 px-4 rounded-[10px]
          border transition-colors
          ${error ? 'border-error focus:border-error focus:ring-error' : 'border-border-grey focus:border-green focus:ring-green'}
          focus:outline-none focus:ring-1
          ${className}
        `}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-error">{error}</p>}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  )
}
