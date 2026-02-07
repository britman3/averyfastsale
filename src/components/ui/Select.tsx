import { SelectHTMLAttributes, forwardRef } from 'react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { value: string; label: string }[]
  placeholder?: string
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, className = '', id, ...props }, ref) => {
    const selectId = id || props.name
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="mb-1.5 block font-heading text-xs font-semibold uppercase tracking-wide text-navy"
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={`h-12 w-full rounded-[10px] border-[1.5px] px-4 text-base transition-colors appearance-none bg-white
            ${error ? 'border-error' : 'border-border-grey'}
            focus:border-green focus:outline-none focus:ring-1 focus:ring-green
            ${className}`}
          {...props}
        >
          {placeholder && (
            <option value="">{placeholder}</option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="mt-1 text-sm text-error">{error}</p>
        )}
      </div>
    )
  }
)
Select.displayName = 'Select'

export default Select
