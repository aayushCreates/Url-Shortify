import {
  Search,
  Bell,
  Menu,
  ChevronDown,
  LogOut,
  User as UserIcon,
  Settings as SettingsIcon,
  Zap,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Avatar } from "../ui/Avatar";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";

export function Topbar() {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-14 bg-white border-b border-border px-4 md:px-6 flex items-center justify-between">
      <div className="flex items-center gap-4 flex-1">
        <div className="flex items-center gap-2">
          <div className="bg-primary-light p-1.5 rounded-lg text-primary">
            <Zap className="h-5 w-5 fill-primary/20" />
          </div>
          <span className="text-xl font-bold text-text-primary tracking-tight">
            Shortify
          </span>
        </div>

        <div className="hidden md:flex relative max-w-sm w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-text-muted" />
          </div>
          <input
            type="text"
            placeholder="Search links, tags, or domains..."
            className="w-full bg-bg-muted border-transparent focus:bg-white rounded-lg pl-9 pr-12 py-1.5 text-sm text-text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary border"
          />
          <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
            <span className="text-[10px] font-medium text-text-muted bg-white border border-border rounded px-1.5 py-0.5">
              ⌘K
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="h-5 w-px bg-border hidden md:block"></div>

        <div className="relative" ref={dropdownRef}>
          <button
            className="flex items-center gap-2 hover:bg-bg-muted p-1 pr-2 rounded-lg transition-colors"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <Avatar name={user?.name || "User"} size="sm" />
            <span className="text-sm font-medium text-text-primary hidden md:block">
              {user?.name?.split(" ")[0] || "User"}
            </span>
            <ChevronDown className="h-4 w-4 text-text-muted hidden md:block" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-1 bg-white border border-border rounded-xl shadow-lg py-1 w-44 z-50">
              <div className="px-4 py-2 border-b border-border mb-1 md:hidden">
                <p className="text-sm font-medium text-text-primary truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-text-muted truncate">
                  {user?.email}
                </p>
              </div>
              <Link
                to="/settings"
                className="flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:bg-bg-muted hover:text-text-primary"
                onClick={() => setIsDropdownOpen(false)}
              >
                <UserIcon className="h-4 w-4" />
                Profile
              </Link>
              <Link
                to="/settings"
                className="flex items-center gap-2 px-4 py-2 text-sm text-text-secondary hover:bg-bg-muted hover:text-text-primary"
                onClick={() => setIsDropdownOpen(false)}
              >
                <SettingsIcon className="h-4 w-4" />
                Settings
              </Link>
              <div className="h-px bg-border my-1"></div>
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-danger-text hover:bg-danger-bg transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
