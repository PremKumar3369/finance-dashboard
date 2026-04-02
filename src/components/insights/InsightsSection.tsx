import { useMemo } from 'react';
import { useCountUp } from '../../lib/useCountUp';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from 'recharts';
import ChartTooltip from '../ui/ChartTooltip';
import { TrendingUp, TrendingDown, Award } from 'lucide-react';
import { useFinance } from '../../context/FinanceContext';

// A different color per bar
const BAR_COLORS = ['#2563eb', '#8b5cf6', '#ec4899', '#f59e0b', '#16a34a', '#06b6d4', '#f97316', '#dc2626'];

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

  // Max amount for progress bar widths
  const maxAmount = categoryData[0]?.amount ?? 1;

  // Count-up animations for card numbers
  const animatedTopAmount = useCountUp(topCategory?.amount ?? 0, 1000);
  const animatedCurrentMonth = useCountUp(monthlyComparison.current, 1000);
  const animatedPrevMonth = useCountUp(monthlyComparison.previous, 1000);
  const animatedChange = useCountUp(Math.abs(monthlyComparison.change), 800);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Insights</h2>

      {/* Insight cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Top spending category */}
        <div className="bg-slate-50 dark:bg-zorvyn-card rounded-xl border border-gray-200 dark:border-[#ffffff1a] shadow-sm p-6 border-l-4 border-l-yellow-400 dark:border-l-yellow-400">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-500 dark:text-zorvyn-muted">Top Spending</span>
            <div className="p-2 rounded-lg bg-yellow-50 dark:bg-[#427cf0]/10">
              <Award className="w-5 h-5 text-yellow-500" />
            </div>
          </div>
          {topCategory ? (
            <>
              <div className="text-2xl font-bold">{topCategory.name}</div>
              <div className="text-sm text-gray-500 dark:text-zorvyn-muted mt-1">
                <span className="font-mono">${animatedTopAmount.toLocaleString()}</span> total spent
              </div>
            </>
          ) : (
            <div className="text-gray-400">No expense data yet</div>
          )}
        </div>

        {/* Current month spending */}
        <div className="bg-slate-50 dark:bg-zorvyn-card rounded-xl border border-gray-200 dark:border-[#ffffff1a] shadow-sm p-6 border-l-4 border-l-red-400 dark:border-l-red-400">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-500 dark:text-zorvyn-muted">This Month</span>
            <div className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20">
              <TrendingDown className="w-5 h-5 text-red-500" />
            </div>
          </div>
          <div className="text-2xl font-bold font-mono">${animatedCurrentMonth.toLocaleString()}</div>
          <div className="text-sm text-gray-500 dark:text-zorvyn-muted mt-1">
            vs <span className="font-mono">${animatedPrevMonth.toLocaleString()}</span> last month
          </div>
        </div>

        {/* Month-over-month change */}
        <div className={`bg-slate-50 dark:bg-zorvyn-card rounded-xl border border-gray-200 shadow-sm p-6 border-l-4 ${monthlyComparison.change <= 0 ? 'border-l-green-400 dark:border-l-green-400' : 'border-l-red-400 dark:border-l-red-400'}`}>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-500 dark:text-zorvyn-muted">Month-over-Month</span>
            <div className={`p-2 rounded-lg ${monthlyComparison.change <= 0 ? 'bg-green-50 dark:bg-zorvyn-green/10' : 'bg-red-50 dark:bg-red-900/20'}`}>
              {monthlyComparison.change <= 0 ? (
                <TrendingDown className="w-5 h-5 text-green-500" />
              ) : (
                <TrendingUp className="w-5 h-5 text-red-500" />
              )}
            </div>
          </div>
          <div className={`text-2xl font-bold font-mono ${monthlyComparison.change <= 0 ? 'text-green-600 dark:text-zorvyn-green' : 'text-red-600 dark:text-red-400'}`}>
            {monthlyComparison.change > 0 ? '+' : '-'}{animatedChange.toFixed(1)}%
          </div>
          <div className="text-sm text-gray-500 dark:text-zorvyn-muted mt-1">
            {monthlyComparison.change <= 0 ? 'Spending decreased' : 'Spending increased'}
          </div>
        </div>
      </div>

      {/* Category bar chart with gradient bars */}
      <div className="bg-slate-50 dark:bg-zorvyn-card rounded-xl border border-gray-200 dark:border-[#ffffff1a] shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-6">Spending by Category</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={categoryData} barSize={36}>
            <defs>
              {BAR_COLORS.map((color, index) => (
                <linearGradient key={index} id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={1} />
                  <stop offset="100%" stopColor={color} stopOpacity={0.5} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
            <XAxis dataKey="name" stroke="#6b7280" fontSize={12} axisLine={false} tickLine={false} />
            <YAxis stroke="#6b7280" fontSize={12} axisLine={false} tickLine={false} />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(0,0,0,0.04)' }} />
            <Bar dataKey="amount" radius={[6, 6, 0, 0]} isAnimationActive={true} animationDuration={800} animationEasing="ease-out">
              {categoryData.map((_, index) => (
                <Cell key={index} fill={`url(#gradient-${index % BAR_COLORS.length})`} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Category progress bars */}
      <div className="bg-slate-50 dark:bg-zorvyn-card rounded-xl border border-gray-200 dark:border-[#ffffff1a] shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-5">Category Breakdown</h3>
        <div className="space-y-4">
          {categoryData.map((cat, index) => (
            <div key={cat.name}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium">{cat.name}</span>
                <span className="text-sm font-semibold font-mono">${cat.amount.toLocaleString()}</span>
              </div>
              <div className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${(cat.amount / maxAmount) * 100}%`,
                    backgroundColor: BAR_COLORS[index % BAR_COLORS.length],
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
