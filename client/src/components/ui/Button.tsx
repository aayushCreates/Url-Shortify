import { type ButtonHTMLAttributes, forwardRef, type ReactNode } from 'react'
import { cn } from '../../lib/utils/cn'
import { Spinner } from './Spinner'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  fullWidth?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const variants = {
      primary: 'bg-primary text-white hover:bg-primary-hover border border-primary',
      secondary: 'bg-white text-text-secondary border border-border hover:bg-bg-muted',
      ghost: 'text-text-secondary hover:bg-bg-muted border border-transparent',
      danger: 'bg-danger-bg text-danger-text border border-red-200 hover:bg-red-100',
    }

    const sizes = {
      sm: 'h-8 px-3 text-xs gap-1.5',
      md: 'h-9 px-4 text-sm gap-2',
      lg: 'h-11 px-5 text-base gap-2',
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center rounded-lg font-medium transition-colors duration-150',
          'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary',
          variants[variant],
          sizes[size],
          fullWidth ? 'w-full' : '',
          (disabled || isLoading) ? 'opacity-50 cursor-not-allowed pointer-events-none' : '',
          className
        )}
        {...props}
      >
        {isLoading && <Spinner size="sm" className="mr-1.5" />}
        {!isLoading && leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
        {children}
        {!isLoading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
      </button>
    )
  }
)

Button.displayName = 'Button'
