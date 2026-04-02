import { useMemo } from 'react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import ChartTooltip from '../ui/ChartTooltip';
import { useFinance } from '../../context/FinanceContext';

export default function BalanceTrendChart() {
  const { transactions } = useFinance();

  const chartData = useMemo(() => {
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
    <div className="bg-slate-50 dark:bg-zorvyn-card rounded-lg border border-gray-200 dark:border-[#ffffff1a] shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4">Balance Trend (6 Months)</h3>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={chartData}>
          <defs>
            {/* Gradient for the line stroke */}
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#22c38e" />
              <stop offset="50%" stopColor="#427cf0" />
              <stop offset="100%" stopColor="#855cd6" />
            </linearGradient>

            {/* Gradient for the area fill below the line */}
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#427cf0" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#427cf0" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
          <XAxis dataKey="name" stroke="#6b7280" fontSize={12} axisLine={false} tickLine={false} />
          <YAxis stroke="#6b7280" fontSize={12} axisLine={false} tickLine={false} />
          <Tooltip content={<ChartTooltip />} />

          {/* Filled area with gradient */}
          <Area
            type="monotone"
            dataKey="balance"
            name="Balance"
            stroke="url(#lineGradient)"
            strokeWidth={3}
            fill="url(#areaGradient)"
            dot={{ r: 5, fill: '#427cf0', stroke: '#fff', strokeWidth: 2 }}
            activeDot={{ r: 7, fill: '#427cf0', stroke: '#fff', strokeWidth: 2 }}
            isAnimationActive={true}
            animationBegin={0}
            animationDuration={1200}
            animationEasing="ease-out"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
