import { useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import type { Transaction } from '../../types';
import { useFinance } from '../../context/FinanceContext';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction?: Transaction | null;
}

export default function TransactionModal({ isOpen, onClose, transaction }: ModalProps) {
  const { addTransaction, updateTransaction, categories } = useFinance();

  const [form, setForm] = useState({
    date: '',
    amount: '',
    category: categories[0],
    type: 'expense' as 'income' | 'expense',
    description: '',
  });

  const [error, setError] = useState('');

  // Controls whether the component is mounted at all
  const [mounted, setMounted] = useState(false);
  // Controls whether we're animating in or out
  const [animating, setAnimating] = useState<'enter' | 'exit' | null>(null);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      // Small delay so the DOM renders before animation starts
      requestAnimationFrame(() => setAnimating('enter'));
    } else if (mounted) {
      setAnimating('exit');
      const timer = setTimeout(() => {
        setMounted(false);
        setAnimating(null);
      }, 150); // match exit animation duration
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Reset / populate form when modal opens
  useEffect(() => {
    if (transaction) {
      setForm({
        date: transaction.date,
        amount: String(transaction.amount),
        category: transaction.category,
        type: transaction.type,
        description: transaction.description,
      });
    } else {
      setForm({
        date: new Date().toISOString().split('T')[0],
        amount: '',
        category: categories[0],
        type: 'expense',
        description: '',
      });
    }
    setError('');
  }, [transaction, isOpen, categories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.date || !form.amount || !form.description) {
      setError('Please fill in all fields.');
      return;
    }
    const amount = parseFloat(form.amount);
    if (isNaN(amount) || amount <= 0) {
      setError('Amount must be a positive number.');
      return;
    }

    if (transaction) {
      updateTransaction(transaction.id, {
        date: form.date,
        amount,
        category: form.category,
        type: form.type,
        description: form.description,
      });
    } else {
      addTransaction({
        date: form.date,
        amount,
        category: form.category,
        type: form.type,
        description: form.description,
      });
    }
    onClose();
  };

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/50 ${animating === 'enter' ? 'modal-backdrop-enter' : animating === 'exit' ? 'modal-backdrop-exit' : ''}`}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative bg-slate-50 dark:bg-zorvyn-card rounded-lg shadow-xl w-full max-w-md p-6 mx-4 ${animating === 'enter' ? 'modal-panel-enter' : animating === 'exit' ? 'modal-panel-exit' : ''}`}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">
            {transaction ? 'Edit Transaction' : 'Add Transaction'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-[#ffffff0d] rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <input
              type="text"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-[#ffffff1a] bg-white dark:bg-[#ffffff0d] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Grocery shopping"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Amount ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-[#ffffff1a] bg-white dark:bg-[#ffffff0d] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-[#ffffff1a] bg-white dark:bg-[#ffffff0d] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-[#ffffff1a] bg-white dark:bg-[#ffffff0d] text-sm"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as 'income' | 'expense' })}
                className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-[#ffffff1a] bg-white dark:bg-[#ffffff0d] text-sm"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-md border border-gray-300 dark:border-[#ffffff1a] text-sm font-medium hover:bg-gray-50 dark:hover:bg-[#ffffff0d] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 rounded-md bg-zorvyn-blue text-white text-sm font-medium hover:bg-zorvyn-blue/90 transition-colors"
            >
              {transaction ? 'Save Changes' : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
