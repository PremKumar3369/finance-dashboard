import { useState } from 'react';
import type { ReactNode } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import type { TabId } from './Sidebar';

interface MainLayoutProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  onShortcutsOpen: () => void;
  children: ReactNode;
}

export default function MainLayout({ activeTab, onTabChange, onShortcutsOpen, children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-gray-900 text-gray-900 dark:text-gray-50">
      <Header onMenuToggle={() => setSidebarOpen(true)} onShortcutsOpen={onShortcutsOpen} />
      <div className="flex min-h-[calc(100vh-4rem)]">
        <Sidebar
          activeTab={activeTab}
          onTabChange={onTabChange}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
