import { type HTMLAttributes } from 'react'
import { cn } from '../../lib/utils/cn'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'danger' | 'warning' | 'info' | 'primary'
}

export function Badge({ children, variant = 'default', className, ...props }: BadgeProps) {
  const variants = {
    default: 'bg-bg-muted text-text-secondary',
    success: 'bg-success-bg text-success-text',
    danger: 'bg-danger-bg text-danger-text',
    warning: 'bg-warning-bg text-warning-text',
    info: 'bg-info-bg text-info-text',
    primary: 'bg-primary-light text-primary',
  }

  return (
    <span
      className={cn(
        'rounded-full px-2.5 py-0.5 text-xs font-medium inline-flex items-center gap-1',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}
