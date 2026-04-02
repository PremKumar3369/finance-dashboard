import { Pencil, Trash2 } from 'lucide-react';
import type { Transaction } from '../../types';
import { useFinance } from '../../context/FinanceContext';
import { cn } from '../../lib/utils';

interface TableProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
}

export default function TransactionTable({ transactions, onEdit }: TableProps) {
  const { role, deleteTransaction } = useFinance();

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        No transactions found. Try adjusting your filters.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Date</th>
            <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Description</th>
            <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Category</th>
            <th className="text-left py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Type</th>
            <th className="text-right py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Amount</th>
            {role === 'admin' && (
              <th className="text-right py-3 px-4 font-medium text-gray-500 dark:text-gray-400">Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr
              key={t.id}
              className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                {new Date(t.date).toLocaleDateString()}
              </td>
              <td className="py-3 px-4">{t.description}</td>
              <td className="py-3 px-4">
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                  {t.category}
                </span>
              </td>
              <td className="py-3 px-4">
                <span
                  className={cn(
                    'px-2 py-1 rounded-full text-xs font-medium',
                    t.type === 'income'
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                      : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                  )}
                >
                  {t.type}
                </span>
              </td>
              <td
                className={cn(
                  'py-3 px-4 text-right font-medium',
                  t.type === 'income'
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                )}
              >
                {t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString()}
              </td>
              {role === 'admin' && (
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => onEdit(t)}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                    aria-label="Edit"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteTransaction(t.id)}
                    className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded ml-1 text-red-500 transition-colors"
                    aria-label="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
