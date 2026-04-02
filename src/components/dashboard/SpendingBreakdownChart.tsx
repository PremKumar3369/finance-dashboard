import { useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import ChartTooltip from '../ui/ChartTooltip';
import { useFinance } from '../../context/FinanceContext';

// Each color pair: [bright top, muted bottom] for the gradient
const GRADIENT_COLORS = [
  ['#3b82f6', '#1d4ed8'],
  ['#f87171', '#b91c1c'],
  ['#4ade80', '#15803d'],
  ['#fbbf24', '#d97706'],
  ['#a78bfa', '#7c3aed'],
  ['#f472b6', '#db2777'],
  ['#22d3ee', '#0891b2'],
  ['#fb923c', '#ea580c'],
];

export default function SpendingBreakdownChart() {
  const { transactions } = useFinance();

  const chartData = useMemo(() => {
    const categoryTotals: Record<string, number> = {};
    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
      });
    return Object.entries(categoryTotals).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  return (
    <div className="bg-slate-50 dark:bg-zorvyn-card rounded-lg border border-gray-200 dark:border-[#ffffff1a] shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4">Spending Breakdown</h3>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          {/* Define one radial gradient per color */}
          <defs>
            {GRADIENT_COLORS.map(([light, dark], index) => (
              <radialGradient key={index} id={`pie-gradient-${index}`} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={light} stopOpacity={1} />
                <stop offset="100%" stopColor={dark} stopOpacity={0.85} />
              </radialGradient>
            ))}
          </defs>

          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            outerRadius={80}
            dataKey="value"
            label={({ percent }) => `${((percent ?? 0) * 100).toFixed(0)}%`}
            labelLine={true}
            isAnimationActive={true}
            animationBegin={0}
            animationDuration={1000}
            animationEasing="ease-out"
          >
            {chartData.map((_, index) => (
              <Cell
                key={index}
                fill={`url(#pie-gradient-${index % GRADIENT_COLORS.length})`}
              />
            ))}
          </Pie>

          <Tooltip content={<ChartTooltip />} />
          <Legend iconType="circle" iconSize={10} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
