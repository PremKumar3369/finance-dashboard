import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { TrendingUp, TrendingDown, Award } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

export default function InsightsSection() {
  const { transactions } = useFinance();

  // Top spending category
  const topCategory = useMemo(() => {
    const totals: Record<string, number> = {};
    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        totals[t.category] = (totals[t.category] || 0) + t.amount;
      });
    const sorted = Object.entries(totals).sort(([, a], [, b]) => b - a);
    return sorted[0] ? { name: sorted[0][0], amount: sorted[0][1] } : null;
  }, [transactions]);

  // Monthly comparison: current vs previous month expenses
  const monthlyComparison = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    let currentExpenses = 0;
    let prevExpenses = 0;

    transactions.forEach((t) => {
      if (t.type !== 'expense') return;
      const d = new Date(t.date);
      if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
        currentExpenses += t.amount;
      }
      if (d.getMonth() === prevMonth && d.getFullYear() === prevYear) {
        prevExpenses += t.amount;
      }
    });

    const change =
      prevExpenses > 0
        ? ((currentExpenses - prevExpenses) / prevExpenses) * 100
        : 0;

    return { current: currentExpenses, previous: prevExpenses, change };
  }, [transactions]);

  // Category breakdown for bar chart
  const categoryData = useMemo(() => {
    const totals: Record<string, number> = {};
    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        totals[t.category] = (totals[t.category] || 0) + t.amount;
      });
    return Object.entries(totals)
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount);
  }, [transactions]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Insights</h2>

      {/* Insight cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Top spending category */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-2 mb-3">
            <Award className="w-5 h-5 text-yellow-500" />
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Top Spending Category
            </span>
          </div>
          {topCategory ? (
            <>
              <div className="text-xl font-bold">{topCategory.name}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                ${topCategory.amount.toLocaleString()} total spent
              </div>
            </>
          ) : (
            <div className="text-gray-400">No expense data yet</div>
          )}
        </div>

        {/* Current month spending */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-2 mb-3">
            <TrendingDown className="w-5 h-5 text-red-500" />
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              This Month's Expenses
            </span>
          </div>
          <div className="text-xl font-bold">${monthlyComparison.current.toLocaleString()}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            vs ${monthlyComparison.previous.toLocaleString()} last month
          </div>
        </div>

        {/* Month-over-month change */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center gap-2 mb-3">
            {monthlyComparison.change <= 0 ? (
              <TrendingDown className="w-5 h-5 text-green-500" />
            ) : (
              <TrendingUp className="w-5 h-5 text-red-500" />
            )}
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Month-over-Month
            </span>
          </div>
          <div
            className={`text-xl font-bold ${
              monthlyComparison.change <= 0
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400'
            }`}
          >
            {monthlyComparison.change > 0 ? '+' : ''}
            {monthlyComparison.change.toFixed(1)}%
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {monthlyComparison.change <= 0 ? 'Spending decreased' : 'Spending increased'}
          </div>
        </div>
      </div>

      {/* Category bar chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold mb-4">Spending by Category</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={categoryData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
            <YAxis stroke="#6b7280" fontSize={12} />
            <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Amount']} />
            <Bar dataKey="amount" fill="#2563eb" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
