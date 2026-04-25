import { type ImgHTMLAttributes } from 'react'
import { cn } from '../../lib/utils/cn'

interface AvatarProps extends ImgHTMLAttributes<HTMLImageElement> {
  name: string
  size?: 'sm' | 'md' | 'lg'
}

export function Avatar({ name, src, size = 'md', className, alt, ...props }: AvatarProps) {
  const sizes = {
    sm: 'h-7 w-7 text-xs',
    md: 'h-9 w-9 text-sm',
    lg: 'h-11 w-11 text-base',
  }

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  if (src) {
    return (
      <img
        src={src}
        alt={alt || name}
        className={cn('rounded-full object-cover', sizes[size], className)}
        {...props}
      />
    )
  }

  return (
    <div
      className={cn(
        'rounded-full bg-primary-light text-primary font-medium flex items-center justify-center',
        sizes[size],
        className
      )}
      title={name}
    >
      {initials}
    </div>
  )
}
