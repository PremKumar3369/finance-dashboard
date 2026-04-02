import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';

import { FinanceProvider, useFinance } from './context/FinanceContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import MainLayout from './components/layout/MainLayout';
import type { TabId } from './components/layout/Sidebar';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import ShortcutsHelpModal from './components/ui/ShortcutsHelpModal';

import SummaryCards from './components/dashboard/SummaryCards';
import BalanceTrendChart from './components/dashboard/BalanceTrendChart';
import SpendingBreakdownChart from './components/dashboard/SpendingBreakdownChart';

import TransactionFilters from './components/transactions/TransactionFilters';
import TransactionTable from './components/transactions/TransactionTable';
import TransactionModal from './components/transactions/TransactionModal';

import InsightsSection from './components/insights/InsightsSection';

import type { FilterState, Transaction } from './types';

// Inner component so it can access context hooks
function AppContent() {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const { transactions, role } = useFinance();
  const { toggleTheme } = useTheme();

  // Filter state for transactions tab
  const [filters, setFilters] = useState<FilterState>({
    category: '',
    type: 'all',
    searchQuery: '',
    sortBy: 'date',
    sortOrder: 'desc',
  });

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  // Filtered + sorted transactions derived from state
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((t) => {
        if (filters.category && t.category !== filters.category) return false;
        if (filters.type !== 'all' && t.type !== filters.type) return false;
        if (filters.searchQuery) {
          const q = filters.searchQuery.toLowerCase();
          return (
            t.description.toLowerCase().includes(q) ||
            t.category.toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => {
        const aVal = filters.sortBy === 'date' ? new Date(a.date).getTime() : a.amount;
        const bVal = filters.sortBy === 'date' ? new Date(b.date).getTime() : b.amount;
        return filters.sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
      });
  }, [transactions, filters]);

  const openAddModal = () => {
    setEditingTransaction(null);
    setModalOpen(true);
  };

  const openEditModal = (t: Transaction) => {
    setEditingTransaction(t);
    setModalOpen(true);
  };

  // Keyboard shortcuts
  useKeyboardShortcuts([
    { key: 'k', meta: true, handler: () => { if (role === 'admin') openAddModal(); } },
    { key: 'd', meta: true, handler: toggleTheme },
    { key: '1', handler: () => setActiveTab('dashboard') },
    { key: '2', handler: () => setActiveTab('transactions') },
    { key: '3', handler: () => setActiveTab('insights') },
    { key: '?', shift: true, handler: () => setShortcutsOpen((prev) => !prev) },
    { key: 'Escape', handler: () => { setModalOpen(false); setShortcutsOpen(false); } },
  ]);

  return (
    <MainLayout activeTab={activeTab} onTabChange={setActiveTab} onShortcutsOpen={() => setShortcutsOpen(true)}>
      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div key="dashboard" className="tab-content space-y-6">
          <h2 className="text-2xl font-bold">Dashboard</h2>
          <SummaryCards />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BalanceTrendChart />
            <SpendingBreakdownChart />
          </div>
        </div>
      )}

      {/* Transactions Tab */}
      {activeTab === 'transactions' && (
        <div key="transactions" className="tab-content space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Transactions</h2>
            {role === 'admin' && (
              <button
                onClick={openAddModal}
                className="flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Transaction
              </button>
            )}
          </div>

          <TransactionFilters filters={filters} onChange={setFilters} filteredTransactions={filteredTransactions} />

          <div className="bg-slate-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <TransactionTable transactions={filteredTransactions} onEdit={openEditModal} onAdd={openAddModal} />
          </div>

          <TransactionModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            transaction={editingTransaction}
          />
        </div>
      )}

      {/* Insights Tab */}
      {activeTab === 'insights' && (
        <div key="insights" className="tab-content">
          <InsightsSection />
        </div>
      )}

      {shortcutsOpen && <ShortcutsHelpModal onClose={() => setShortcutsOpen(false)} />}
    </MainLayout>
  );
}

// Root component: wrap everything with providers
function App() {
  return (
    <ThemeProvider>
      <FinanceProvider>
        <AppContent />
      </FinanceProvider>
    </ThemeProvider>
  );
}

export default App;
