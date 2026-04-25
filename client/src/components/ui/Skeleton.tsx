import { cn } from '../../lib/utils/cn'

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse bg-bg-muted rounded', className)} />
}

export function SkeletonText({ className, width = 'w-full' }: { className?: string, width?: string }) {
  return <Skeleton className={cn('h-4', width, className)} />
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('p-5 bg-white rounded-xl border border-border shadow-sm', className)}>
      <SkeletonText width="w-1/3" className="mb-4" />
      <SkeletonText width="w-full" className="mb-2" />
      <SkeletonText width="w-5/6" className="mb-4" />
      <div className="flex gap-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  )
}

export function SkeletonStatCard({ className }: { className?: string }) {
  return (
    <div className={cn('bg-white rounded-xl border border-border p-5 shadow-sm', className)}>
      <div className="flex items-center justify-between mb-3">
        <SkeletonText width="w-24" />
        <Skeleton className="h-9 w-9 rounded-lg" />
      </div>
      <Skeleton className="h-9 w-32 mb-2" />
      <SkeletonText width="w-40" />
    </div>
  )
}

export function SkeletonTable({ rows = 5, className }: { rows?: number, className?: string }) {
  return (
    <div className={cn('w-full border border-border rounded-xl overflow-hidden bg-white', className)}>
      <div className="bg-bg-muted/50 p-4 border-b border-border flex gap-4">
        <SkeletonText width="w-1/4" />
        <SkeletonText width="w-1/4" />
        <SkeletonText width="w-1/4" />
        <SkeletonText width="w-1/4" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="p-4 border-b border-border flex gap-4 last:border-0">
          <SkeletonText width="w-1/4" />
          <SkeletonText width="w-1/3" />
          <SkeletonText width="w-1/6" />
          <SkeletonText width="w-1/4" />
        </div>
      ))}
    </div>
  )
}
