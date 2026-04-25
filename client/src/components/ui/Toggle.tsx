import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '../../lib/utils/cn'

interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
}

export const Toggle = forwardRef<HTMLInputElement, ToggleProps>(
  ({ className, checked, onChange, disabled, label, id, ...props }, ref) => {
    const toggleId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <label 
        htmlFor={toggleId}
        className={cn(
          'inline-flex items-center gap-3',
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
          className
        )}
      >
        <div className="relative inline-flex h-5 w-9 flex-shrink-0">
          <input
            type="checkbox"
            id={toggleId}
            ref={ref}
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            className="sr-only peer"
            {...props}
          />
          <div
            className={cn(
              'absolute inset-0 rounded-full transition-colors duration-200 ease-in-out',
              checked ? 'bg-primary' : 'bg-border'
            )}
          />
          <div
            className={cn(
              'absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out',
              checked ? 'translate-x-4' : 'translate-x-0'
            )}
          />
        </div>
        {label && (
          <span className="text-sm font-medium text-text-primary">
            {label}
          </span>
        )}
      </label>
    )
  }
)

Toggle.displayName = 'Toggle'
