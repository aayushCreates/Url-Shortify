import { useLocation, Link } from 'react-router-dom'
import { Zap, LayoutDashboard, Link2, BarChart3, Settings as SettingsIcon, Sparkles } from 'lucide-react'
import { cn } from '../../lib/utils/cn'

export function Sidebar() {
  const location = useLocation()

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'URLs', path: '/urls', icon: Link2 },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Settings', path: '/settings', icon: SettingsIcon },
  ]

  return (
    <aside className="w-[260px] bg-white border-r border-border h-full flex flex-col hidden md:flex">
      <div className="px-4 py-5 flex items-center gap-2">
        <div className="bg-primary-light p-1.5 rounded-lg text-primary">
          <Zap className="h-5 w-5 fill-primary/20" />
        </div>
        <span className="text-base font-semibold text-text-primary tracking-tight">Shortify</span>
      </div>

      <div className="px-4 mb-2 mt-4">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-text-muted">
          Workspace
        </h3>
      </div>

      <nav className="flex-1 px-2 space-y-1">
        {navLinks.map((link) => {
          const isActive = location.pathname.startsWith(link.path)
          const Icon = link.icon

          return (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                'flex items-center gap-3 px-3 py-2 text-sm rounded-lg mx-2 transition-colors',
                isActive
                  ? 'bg-primary-light text-primary font-medium'
                  : 'text-text-secondary hover:bg-bg-muted hover:text-text-primary'
              )}
            >
              <Icon className="h-4 w-4" />
              {link.name}
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto pb-4 px-3">
        <div className="bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl p-4 text-white shadow-md">
          <div className="flex items-center gap-2 mb-0.5">
            <Sparkles className="h-4 w-4" />
            <span className="font-semibold text-sm">Upgrade to Pro</span>
          </div>
          <p className="text-xs text-white/80 mb-3">
            Unlock unlimited links & analytics
          </p>
          <button className="bg-white text-primary text-xs font-medium rounded-lg px-3 py-1.5 w-full hover:bg-primary-light transition-colors">
            Upgrade Now
          </button>
        </div>
      </div>
    </aside>
  )
}
