import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import type { ElementType } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { useCountUp } from '../../lib/useCountUp';

interface CardProps {
  title: string;
  amount: number;
  icon: ElementType;
  color: string;
  bg: string;
}

function SummaryCard({ title, amount, icon: Icon, color, bg }: CardProps) {
  const animated = useCountUp(Math.abs(amount), 1000);

  return (
    <div className="bg-slate-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</span>
        <div className={`p-2 rounded-md ${bg}`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
      </div>
      <div className={`text-2xl font-bold font-mono ${amount < 0 ? 'text-red-600 dark:text-red-400' : ''}`}>
        {amount < 0 ? '-' : ''}${animated.toLocaleString()}
      </div>
    </div>
  );
}

export default function SummaryCards() {
  const { summary } = useFinance();

  const cards = [
    {
      title: 'Total Balance',
      amount: summary.totalBalance,
      icon: DollarSign,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-900/30',
    },
    {
      title: 'Total Income',
      amount: summary.totalIncome,
      icon: TrendingUp,
      color: 'text-green-600 dark:text-green-400',
      bg: 'bg-green-50 dark:bg-green-900/30',
    },
    {
      title: 'Total Expenses',
      amount: summary.totalExpenses,
      icon: TrendingDown,
      color: 'text-red-600 dark:text-red-400',
      bg: 'bg-red-50 dark:bg-red-900/30',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card) => (
        <SummaryCard key={card.title} {...card} />
      ))}
    </div>
  );
}
