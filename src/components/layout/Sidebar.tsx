import { LayoutDashboard, ArrowLeftRight, TrendingUp, X } from 'lucide-react';
import { cn } from '../../lib/utils';

const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
  { id: 'insights', label: 'Insights', icon: TrendingUp },
] as const;

export type TabId = (typeof tabs)[number]['id'];

interface SidebarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ activeTab, onTabChange, isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'fixed lg:static z-50 top-0 left-0 h-full w-60 border-r border-gray-200 dark:border-[#ffffff1a] bg-slate-50 dark:bg-zorvyn-card p-4 transition-transform duration-200 lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex justify-end lg:hidden mb-2">
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-[#ffffff0d] rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex flex-col gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                onTabChange(tab.id);
                onClose();
              }}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                activeTab === tab.id
                  ? 'bg-blue-50 dark:bg-zorvyn-blue/10 text-blue-600 dark:text-zorvyn-blue'
                  : 'text-gray-600 dark:text-zorvyn-muted hover:bg-gray-100 dark:hover:bg-[#ffffff0d]'
              )}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
}
