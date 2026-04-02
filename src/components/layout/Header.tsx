import { useState, useRef, useEffect } from 'react';
import { Moon, Sun, Wallet, ChevronDown, Shield, Eye, Keyboard } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useFinance } from '../../context/FinanceContext';
import type { UserRole } from '../../types';

interface HeaderProps {
  onMenuToggle: () => void;
  onShortcutsOpen: () => void;
}

const roles: { value: UserRole; label: string; icon: typeof Shield; description: string }[] = [
  { value: 'admin', label: 'Admin', icon: Shield, description: 'Full access' },
  { value: 'viewer', label: 'Viewer', icon: Eye, description: 'Read only' },
];

export default function Header({ onMenuToggle, onShortcutsOpen }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const { role, setRole } = useFinance();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const current = roles.find((r) => r.value === role)!;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-16 border-b border-gray-200 dark:border-gray-700 bg-slate-50 dark:bg-gray-800 flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-2">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md mr-1"
          aria-label="Toggle menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <Wallet className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        <span className="text-xl font-bold">FinDash</span>
      </div>

      <div className="flex items-center gap-4">
        {/* Animated role dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-sm font-medium shadow-sm"
          >
            <current.icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>{current.label}</span>
            <ChevronDown
              className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Dropdown panel */}
          <div
            className={`absolute right-0 mt-2 w-44 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl shadow-lg overflow-hidden transition-all duration-200 origin-top ${
              open ? 'opacity-100 scale-y-100 translate-y-0' : 'opacity-0 scale-y-95 -translate-y-1 pointer-events-none'
            }`}
          >
            {roles.map((r) => (
              <button
                key={r.value}
                onClick={() => {
                  setRole(r.value);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-gray-50 dark:hover:bg-gray-600 ${
                  role === r.value ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-200'
                }`}
              >
                <r.icon className="w-4 h-4" />
                <div className="text-left">
                  <div className="font-medium">{r.label}</div>
                  <div className="text-xs text-gray-400 dark:text-gray-500">{r.description}</div>
                </div>
                {role === r.value && (
                  <div className="ml-auto w-2 h-2 rounded-full bg-blue-500" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Keyboard shortcuts button */}
        <button
          onClick={onShortcutsOpen}
          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Keyboard shortcuts"
          title="Keyboard shortcuts (Shift + ?)"
        >
          <Keyboard className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </button>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </button>
      </div>
    </header>
  );
}
