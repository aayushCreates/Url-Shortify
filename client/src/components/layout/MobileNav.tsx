import { useLocation, Link } from 'react-router-dom'
import { LayoutDashboard, Link2, BarChart3, Settings, CreditCard } from 'lucide-react'
import { cn } from '../../lib/utils/cn'

export function MobileNav() {
  const location = useLocation()

  const tabs = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'URLs', path: '/urls', icon: Link2 },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Billing', path: '/billing', icon: CreditCard },
    { name: 'Settings', path: '/settings', icon: Settings },
  ]

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-border z-50 flex items-center justify-around pb-safe">
      {tabs.map((tab) => {
        const isActive = location.pathname.startsWith(tab.path)
        const Icon = tab.icon

        return (
          <Link
            key={tab.path}
            to={tab.path}
            className={cn(
              'flex flex-col items-center justify-center w-full h-full gap-1 transition-colors',
              isActive ? 'text-primary' : 'text-text-muted hover:text-text-secondary'
            )}
          >
            <Icon className="h-5 w-5" />
            <span className="text-[10px] font-medium">{tab.name}</span>
          </Link>
        )
      })}
    </nav>
  )
}
