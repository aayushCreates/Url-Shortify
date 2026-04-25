import { forwardRef, type SelectHTMLAttributes } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '../../lib/utils/cn'

export interface SelectOption {
  value: string | number
  label: string
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  hint?: string
  options: SelectOption[]
  selectSize?: 'sm' | 'md'
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      label,
      error,
      hint,
      options,
      selectSize = 'md',
      id,
      ...props
    },
    ref
  ) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-text-secondary mb-1"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              'w-full appearance-none rounded-lg border bg-white pl-3 pr-10 py-2 text-text-primary transition-all duration-150',
              'focus:outline-none focus:ring-2',
              selectSize === 'sm' ? 'text-xs py-1.5' : 'text-sm py-2',
              error
                ? 'border-red-300 focus:ring-red-500/20 focus:border-red-400'
                : 'border-border focus:ring-primary/20 focus:border-primary',
              className
            )}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-text-muted">
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
        {error && <p className="text-xs text-danger-text mt-1">{error}</p>}
        {hint && !error && <p className="text-xs text-text-muted mt-1">{hint}</p>}
      </div>
    )
  }
)

Select.displayName = 'Select'
