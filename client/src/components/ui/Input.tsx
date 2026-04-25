import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react'
import { cn } from '../../lib/utils/cn'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  inputSize?: 'sm' | 'md'
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      inputSize = 'md',
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-text-secondary mb-1"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full rounded-lg border bg-white px-3 py-2 text-text-primary transition-all duration-150',
              'placeholder:text-text-muted focus:outline-none focus:ring-2',
              inputSize === 'sm' ? 'text-xs py-1.5' : 'text-sm py-2',
              leftIcon ? 'pl-9' : '',
              rightIcon ? 'pr-9' : '',
              error
                ? 'border-red-300 focus:ring-red-500/20 focus:border-red-400'
                : 'border-border focus:ring-primary/20 focus:border-primary',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-muted cursor-pointer">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="text-xs text-danger-text mt-1">{error}</p>}
        {hint && !error && <p className="text-xs text-text-muted mt-1">{hint}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
