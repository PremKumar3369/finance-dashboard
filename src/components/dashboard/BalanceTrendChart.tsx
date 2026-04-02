import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useFinance } from '../../context/FinanceContext';

export default function BalanceTrendChart() {
  const { transactions } = useFinance();

  const chartData = useMemo(() => {
    // Build last 6 months list
    const months: { label: string; month: number; year: number }[] = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        label: d.toLocaleString('default', { month: 'short' }),
        month: d.getMonth(),
        year: d.getFullYear(),
      });
    }

    // Accumulate balance month by month
    let runningBalance = 0;
    return months.map((m) => {
      transactions.forEach((t) => {
        const d = new Date(t.date);
        if (d.getMonth() === m.month && d.getFullYear() === m.year) {
          runningBalance += t.type === 'income' ? t.amount : -t.amount;
        }
      });
      return { name: m.label, balance: runningBalance };
    });
  }, [transactions]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold mb-4">Balance Trend (6 Months)</h3>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
          <YAxis stroke="#6b7280" fontSize={12} />
          <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Balance']} />
          <Line
            type="monotone"
            dataKey="balance"
            stroke="#2563eb"
            strokeWidth={2}
            dot={{ r: 4, fill: '#2563eb' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
